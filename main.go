package main

import (
	"ApplyTrack/internal/db"
	"ApplyTrack/internal/server"
	"fmt"
	"os"
	"os/signal"
)

func main() {
	db.InitDB()
	server.InitServer()

	stop := make(chan os.Signal, 1)

	signal.Notify(stop, os.Interrupt)
	<-stop

	db.CloseDB()

	fmt.Println("Closed connection to database")

}
