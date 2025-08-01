package main

import (
	"fmt"
	"os"
	"os/signal"

	"ApplyTrack/internal/application"
	"ApplyTrack/internal/db"
	dbQueries "ApplyTrack/internal/db/queries"
	"ApplyTrack/internal/user"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	fmt.Println("Starting server...")
	
	db.InitDB()
	defer db.CloseDB()

	queries := dbQueries.New(db.Conn)

	appStore := application.NewApplicationStorage(queries)
	appService := application.NewService()
	appHandler := application.NewHandler(appService, appStore)

	userStore := user.NewUserStorage(queries)
	userService := user.NewService(userStore)
	userHandler := user.NewHandler(userService)

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	api := e.Group("/api")
	
	appHandler.RegisterRoutes(api)
	userHandler.RegisterRoutes(api)

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
