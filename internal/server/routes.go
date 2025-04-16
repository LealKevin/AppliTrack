package server

import (
	"ApplyTrack/internal/handlers"
	"ApplyTrack/internal/utils"

	"github.com/go-chi/chi"
)

func Router() *chi.Mux {
	router := chi.NewRouter()

	router.Route("/api", func(r chi.Router) {

		r.Post("/users", handlers.CreateUser)
		r.Get("/pong", handlers.Pong)
		r.Post("/login", handlers.Login)
		r.Post("/logout", handlers.Logout)

		r.Group(func(r chi.Router) {
			r.Use(utils.AuthMiddleware)

			r.Get("/applications", handlers.GetAllApplications)
			r.Get("/applications/{id}", handlers.GetOneApplicationByID)
			r.Post("/application", handlers.CreateOneApplication)
			r.Delete("/applications/{id}", handlers.DeleteOneApplicationByID)
			r.Put("/applications/{id}", handlers.UpdateOneApplicationByID)

			r.Get("/users", handlers.GetAllUsers)
			r.Get("/me", handlers.GetCurrentUser)
		})
	})

	return router
}
