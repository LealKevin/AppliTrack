package server

import (
	"net/http"
	"os"
	"strings"
	"time"

	"ApplyTrack/internal/application"
	"ApplyTrack/internal/db"
	"ApplyTrack/internal/reminder"
	"ApplyTrack/internal/user"
	"ApplyTrack/internal/utils"

	q "ApplyTrack/internal/db/queries"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/time/rate"
)

type Server struct {
	echo *echo.Echo
	db   *db.Database
}

func New(db *db.Database) *Server {
	return &Server{
		echo: echo.New(),
		db:   db,
	}
}

func (s *Server) Start(port string) error {
	queries := q.New(db.Conn)

	userStore := user.NewUserStorage(queries)
	applicationStore := application.NewApplicationStorage(queries)
	reminderStore := reminder.NewStore(queries)

	userService := user.NewService(userStore)
	applicationService := application.NewService(applicationStore)
	reminderService := reminder.NewService(reminderStore)

	userHandler := user.NewHandler(userService)
	applicationHandler := application.NewHandler(applicationService, applicationStore)
	reminderHandler := reminder.NewHandler(reminderService)

	s.SetupMiddleware()
	s.SetupRoutes(userHandler, applicationHandler, reminderHandler)

	return s.echo.Start(port)
}

func (s *Server) Stop() error {
	if s.db != nil {
		s.db.Close()
	}
	return s.echo.Close()
}

func (s *Server) SetupMiddleware() {
	s.echo.Use(middleware.Logger())
	s.echo.Use(middleware.Recover())
	s.echo.Use(utils.SecurityHeadersMiddleware())

	s.echo.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(
		rate.Limit(100),
	)))

	allowedOrigins := []string{"http://localhost:5173"}
	if originsEnv := os.Getenv("CORS_ALLOWED_ORIGINS"); originsEnv != "" {
		allowedOrigins = strings.Split(originsEnv, ",")
		for i, origin := range allowedOrigins {
			allowedOrigins[i] = strings.TrimSpace(origin)
		}
	}

	s.echo.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.PATCH, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization, "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	s.echo.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
		TokenLookup:    "header:X-CSRF-Token",
		CookiePath:     "/",
		CookieHTTPOnly: true,
		CookieSameSite: http.SameSiteStrictMode,
	}))
	s.echo.Validator = &utils.CustomValidator{Validator: validator.New()}
}

func (s *Server) SetupRoutes(userHandler *user.Handler, appHandler *application.Handler, reminderHandler *reminder.Handler) {
	api := s.echo.Group("/api")

	authGroup := api.Group("")
	authGroup.Use(utils.AuthRateLimitMiddleware(5, 15*time.Minute))
	authGroup.POST("/register", userHandler.Register)
	authGroup.POST("/login", userHandler.Login)
	authGroup.POST("/logout", userHandler.Logout)
	authGroup.GET("/csrf", userHandler.GetCSRFToken)

	protected := api.Group("")
	protected.Use(utils.EchoAuthMiddleware())

	appHandler.RegisterRoutes(protected)
	userHandler.RegisterProtectedRoutes(protected)
	reminderHandler.RegisterRoutes(protected)
}
