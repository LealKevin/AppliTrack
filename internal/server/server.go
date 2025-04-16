package server

import (
	"fmt"
	"net/http"
)

func InitServer() {

	router := Router()
	fmt.Printf("Sucessfull connection to server on 8080")

	if err := http.ListenAndServe("0.0.0.0:8080", router); err != nil {
		fmt.Printf("Error connection to server: %v", err)
	}

}
