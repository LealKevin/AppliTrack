package user

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	Service *UserService
}

func NewHandler(service *UserService) *Handler {
	return &Handler{
		Service: service,
	}
}

func isDevelopment() bool {
	env := os.Getenv("GO_ENV")
	return env == "" || env == "development"
}

func (h *Handler) RegisterRoutes(e *echo.Group) {
	e.POST("/register", h.Register)
	e.POST("/login", h.Login)
	e.POST("/logout", h.Logout)
	e.GET("/csrf", h.GetCSRFToken)
}

func (h *Handler) RegisterProtectedRoutes(e *echo.Group) {
	e.GET("/users", h.GetAllUsers)
	e.GET("/user/current", h.GetCurrentUser)
}

type registerRequest struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	PasswordRepeat string `json:"passwordRepeat"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type userResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type authResponse struct {
	User  userResponse `json:"user"`
	Token string       `json:"token"`
}

func (h *Handler) Register(c echo.Context) error {
	var req registerRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	serviceReq := RegisterRequest{
		Name:           req.Name,
		Email:          req.Email,
		Password:       req.Password,
		PasswordRepeat: req.PasswordRepeat,
	}

	authResp, err := h.Service.Register(serviceReq)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	c.SetCookie(&http.Cookie{
		Name:     "jwt",
		Value:    authResp.Token,
		Path:     "/",
		HttpOnly: true,
		Secure:   !isDevelopment(),
		SameSite: http.SameSiteLaxMode,
		MaxAge:   60 * 60 * 24,
	})

	return c.JSON(http.StatusCreated, authResponse{
		User:  mapToUserResponse(authResp.User),
		Token: authResp.Token,
	})
}

func (h *Handler) Login(c echo.Context) error {
	var req loginRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	serviceReq := LoginRequest{
		Email:    req.Email,
		Password: req.Password,
	}

	authResp, err := h.Service.Login(serviceReq)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "invalid email or password")
	}

	c.SetCookie(&http.Cookie{
		Name:     "jwt",
		Value:    authResp.Token,
		Path:     "/",
		HttpOnly: true,
		Secure:   !isDevelopment(),
		SameSite: http.SameSiteLaxMode,
		MaxAge:   60 * 60 * 24,
	})

	return c.JSON(http.StatusOK, authResponse{
		User:  mapToUserResponse(authResp.User),
		Token: authResp.Token,
	})
}

func (h *Handler) Logout(c echo.Context) error {
	c.SetCookie(&http.Cookie{
		Name:     "jwt",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   !isDevelopment(),
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	})

	return c.JSON(http.StatusOK, map[string]string{"message": "logged out"})
}

func (h *Handler) GetAllUsers(c echo.Context) error {
	users, err := h.Service.GetAllUsers()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "unable to get users")
	}

	userResponses := make([]userResponse, len(users))
	for i, user := range users {
		userResponses[i] = mapToUserResponse(user)
	}

	return c.JSON(http.StatusOK, userResponses)
}

func (h *Handler) GetCurrentUser(c echo.Context) error {
	userIDValue := c.Get("userID")
	if userIDValue == nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "invalid user")
	}

	userID := userIDValue.(uuid.UUID)

	user, err := h.Service.GetUserByID(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "user not found")
	}

	return c.JSON(http.StatusOK, mapToUserResponse(user))
}

func (h *Handler) GetCSRFToken(c echo.Context) error {
	fmt.Println("Generating CSRF token")
	fmt.Println("CSRF token:", c.Get("csrf"))
	return c.JSON(http.StatusOK, map[string]string{
		"token": c.Get("csrf").(string),
	})
}

func mapToUserResponse(user User) userResponse {
	return userResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}
