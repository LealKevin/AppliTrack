package main

import (
	"fmt"
	"os"
	"os/signal"

	"ApplyTrack/internal/db"
	"ApplyTrack/internal/server"
)

func main() {
	fmt.Println("Starting server...")

	db, err := db.NewDatabase()
	if err != nil {
		fmt.Printf("Error initializing database: %v\n", err)
		os.Exit(1)
	}
	srv := server.New(db)

	go func() {
		if err := srv.Start(":8080"); err != nil {
			fmt.Printf("Error starting server: %v\n", err)
		}
	}()

	fmt.Println("Server successfully started on port 8080")

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop

	fmt.Println("Shutting down server...")
	if err := srv.Stop(); err != nil {
		fmt.Printf("Error shutting down server: %v\n", err)
	}

	fmt.Println("Server shut down complete")
}
