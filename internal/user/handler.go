package user

import (
	"errors"
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
}

func (h *Handler) RegisterProtectedRoutes(e *echo.Group) {
	e.GET("/users", h.GetAllUsers)
	e.GET("/user/current", h.GetCurrentUser)
	e.DELETE("/user/current", h.DeleteCurrentUser)
	e.GET("/user/export", h.ExportUserData)
}

type RegisterRequest struct {
	Email                 string `json:"email" validate:"required,email"`
	Password              string `json:"password" validate:"required,min=8"`
	PasswordRepeat        string `json:"passwordRepeat" validate:"required,eqfield=Password"`
	AcceptedPrivacyPolicy bool   `json:"acceptedPrivacyPolicy" validate:"required"`
	AcceptedTerms         bool   `json:"acceptedTerms" validate:"required"`
}

type loginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
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
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	if err := c.Validate(req); err != nil {
		return err
	}

	// Validate GDPR consents
	if !req.AcceptedPrivacyPolicy {
		return echo.NewHTTPError(http.StatusBadRequest, "You must accept the privacy policy to create an account")
	}
	
	if !req.AcceptedTerms {
		return echo.NewHTTPError(http.StatusBadRequest, "You must accept the terms of service to create an account")
	}

	serviceReq := RegisterRequest{
		Email:                 req.Email,
		Password:              req.Password,
		PasswordRepeat:        req.PasswordRepeat,
		AcceptedPrivacyPolicy: req.AcceptedPrivacyPolicy,
		AcceptedTerms:         req.AcceptedTerms,
	}

	authResp, err := h.Service.Register(serviceReq)
	if err != nil {
		if errors.Is(err, ErrDuplicateEmail) {
			return echo.NewHTTPError(http.StatusConflict, "Email already exists")
		}
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

    c.SetCookie(&http.Cookie{
        Name:     "jwt",
        Value:    authResp.Token,
        Path:     "/",
        HttpOnly: true,
        Secure:   !isDevelopment(),
        SameSite: func() http.SameSite {
            if isDevelopment() {
                return http.SameSiteLaxMode
            }
            return http.SameSiteNoneMode
        }(),
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

	if err := c.Validate(req); err != nil {
		return err
	}

	serviceReq := LoginRequest{
		Email:    req.Email,
		Password: req.Password,
	}

	authResp, err := h.Service.Login(serviceReq)
	if err != nil {
		if errors.Is(err, ErrInvalidCredentials) {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid email or password")
		}
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

    c.SetCookie(&http.Cookie{
        Name:     "jwt",
        Value:    authResp.Token,
        Path:     "/",
        HttpOnly: true,
        Secure:   !isDevelopment(),
        SameSite: func() http.SameSite {
            if isDevelopment() {
                return http.SameSiteLaxMode
            }
            return http.SameSiteNoneMode
        }(),
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
        SameSite: func() http.SameSite {
            if isDevelopment() {
                return http.SameSiteLaxMode
            }
            return http.SameSiteNoneMode
        }(),
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
	return c.JSON(http.StatusOK, map[string]string{
		"token": c.Get("csrf").(string),
	})
}

func (h *Handler) DeleteCurrentUser(c echo.Context) error {
	userIDValue := c.Get("userID")
	if userIDValue == nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "invalid user")
	}

	userID := userIDValue.(uuid.UUID)

	err := h.Service.DeleteUser(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to delete user")
	}

    c.SetCookie(&http.Cookie{
        Name:     "jwt",
        Value:    "",
        Path:     "/",
        HttpOnly: true,
        Secure:   !isDevelopment(),
        SameSite: func() http.SameSite {
            if isDevelopment() {
                return http.SameSiteLaxMode
            }
            return http.SameSiteNoneMode
        }(),
        Expires:  time.Unix(0, 0),
        MaxAge:   -1,
    })

	return c.JSON(http.StatusOK, map[string]string{"message": "user deleted successfully"})
}

func (h *Handler) ExportUserData(c echo.Context) error {
	userIDValue := c.Get("userID")
	if userIDValue == nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "invalid user")
	}

	userID := userIDValue.(uuid.UUID)

	// Get user profile
	user, err := h.Service.GetUserByID(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "user not found")
	}

	// Note: In a real implementation, you would also fetch:
	// - All user applications
	// - All reminders
	// - All interview rounds
	// For this GDPR implementation, we'll export the available user data
	
	exportData := map[string]interface{}{
		"export_date": time.Now().UTC().Format(time.RFC3339),
		"user_profile": map[string]interface{}{
			"id":         user.ID,
			"email":      user.Email,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
		},
		"data_description": map[string]string{
			"personal_data": "Email address and account timestamps",
			"application_data": "Job applications, companies, positions, notes (available in main app)",
			"reminder_data": "Personal reminders and follow-up dates (available in main app)",
			"interview_data": "Interview rounds and feedback (available in main app)",
		},
		"gdpr_info": map[string]interface{}{
			"legal_basis": "Consent and legitimate interest",
			"retention_period": "Data retained while account is active",
			"rights": []string{
				"Right to access (this export)",
				"Right to rectification (edit in app)",
				"Right to erasure (delete account)",
				"Right to data portability (this export)",
			},
		},
	}

	// Set proper headers for download
	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().Header().Set("Content-Disposition", "attachment; filename=applytrack_data_export.json")

	return c.JSON(http.StatusOK, exportData)
}

func mapToUserResponse(user User) userResponse {
	return userResponse{
		ID:        user.ID,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}
