package server

import (
	"fmt"
	"net/http"
)

func InitServer() {

	router := Router()
	fmt.Printf("Sucessfull connection to server")

	if err := http.ListenAndServe(":8080", router); err != nil {
		fmt.Printf("Error connection to server: %v", err)
	}

}
