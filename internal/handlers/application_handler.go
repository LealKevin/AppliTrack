package handlers

import (
	client "ApplyTrack/internal/db"
	db "ApplyTrack/internal/db/queries"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/jackc/pgx/v5/pgtype"
)

func GetHomePage(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello from go chi"))
}

func GetAllApplications(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	statusParam := r.URL.Query().Get("status")
	fmt.Printf("Params: %v", r.URL.Query().Get("status"))

	queries := db.New(client.Conn)

	var status pgtype.Text
	status.String = statusParam
	status.Valid = true

	var applications []db.Application
	var err error

	if statusParam == "all" {
		applications, err = queries.GetAllApplications(ctx)
		log.Println("Applications: ", applications)
	} else {
		applications, err = queries.GetApplicationsByStatus(ctx, status)
		log.Println("Applications without status: ", applications)
	}
	if err != nil {
		log.Println("Error getting applications", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(applications)

}

func GetApplicationsByStatus(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	statusParam := chi.URLParam(r, "status")
	if statusParam == "" {
		log.Println("No status provided")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var status pgtype.Text
	status.String = statusParam

	queries := db.New(client.Conn)
	applications, err := queries.GetApplicationsByStatus(ctx, status)
	if err != nil {
		log.Println("Error getting applications by status", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(applications)

}

func GetOneApplicationByID(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	idInt, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	id := int32(idInt)

	queries := db.New(client.Conn)
	application, err := queries.GetOneApplicationByID(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(application)
}

func DeleteOneApplicationByID(w http.ResponseWriter, r *http.Request) {
	fmt.Println("DeleteOneApplicationByID")
	ctx := context.Background()

	idInt, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	id := int32(idInt)

	queries := db.New(client.Conn)
	deleted, err := queries.DeleteOneApplicationByID(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deleted)
}

func CreateOneApplication(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var data db.CreateOneApplicationParams

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		log.Println("Error decoding json", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	queries := db.New(client.Conn)
	application, err := queries.CreateOneApplication(ctx, data)
	if err != nil {
		log.Println("Error creating application", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(application)
}
