package server

import (
	"ApplyTrack/internal/handlers"

	"github.com/go-chi/chi"
)

func Router() *chi.Mux {
	router := chi.NewRouter()

	router.Get("/", handlers.GetHomePage)

	router.Get("/applications", handlers.GetAllApplications)
	router.Get("/applications/{id}", handlers.GetOneApplicationByID)
	router.Get("/applications/{status}", handlers.GetApplicationsByStatus)
	router.Post("/application", handlers.CreateOneApplication)
	router.Delete("/applications/{id}", handlers.DeleteOneApplicationByID)

	return router
}
