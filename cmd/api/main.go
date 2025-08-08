package main

import (
	"fmt"
	"net/http"
	"os"
	"os/signal"

	"ApplyTrack/internal/application"
	"ApplyTrack/internal/db"
	dbQueries "ApplyTrack/internal/db/queries"
	"ApplyTrack/internal/user"
	"ApplyTrack/internal/utils"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	fmt.Println("Starting server...")

	db.InitDB()
	defer db.CloseDB()

	queries := dbQueries.New(db.Conn)

	appStore := application.NewApplicationStorage(queries)
	appService := application.NewService(appStore)
	appHandler := application.NewHandler(appService, appStore)

	userStore := user.NewUserStorage(queries)
	userService := user.NewService(userStore)
	userHandler := user.NewHandler(userService)

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.PATCH, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
	}))
	e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
		TokenLookup:    "header:X-CSRF-Token",
		CookiePath:     "/",
		CookieHTTPOnly: true,
		CookieSameSite: http.SameSiteStrictMode,
	}))

	api := e.Group("/api")

	userHandler.RegisterRoutes(api)

	protected := api.Group("")
	protected.Use(utils.EchoAuthMiddleware())

	appHandler.RegisterRoutes(protected)
	userHandler.RegisterProtectedRoutes(protected)

	go func() {
		if err := e.Start(":8080"); err != nil {
			fmt.Printf("Error starting server: %v\n", err)
		}
	}()

	fmt.Println("Server successfully started on port 8080")

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop

	fmt.Println("Shutting down server...")
	if err := e.Shutdown(nil); err != nil {
		fmt.Printf("Error shutting down server: %v\n", err)
	}

	fmt.Println("Server shut down complete")
}
