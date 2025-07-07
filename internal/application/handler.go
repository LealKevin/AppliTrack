package application

import (
	db "ApplyTrack/internal/db/queries"
	"encoding/json"
	"log"
	"net/http"

	"github.com/jackc/pgx/pgtype"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	Service *Service
	Store   Store
}

func NewHandler(service *Service, store Store) *Handler {
	return &Handler{
		Service: service,
		Store:   store,
	}
}

func (h *Handler) RegisterRoutes(e *echo.Echo) {
	e.GET("/applications", h.GetAllApplications)
	e.GET("/applications/{id}", h.GetOneApplicationByID)
	e.POST("/application", h.CreateOneApplication)
	e.DELETE("/applications/{id}", h.DeleteOneApplicationByID)
	e.PUT("/applications/{id}", h.UpdateOneApplicationByID)
	e.GET("/applications/count", h.AppsCount)
}

func (h *Handler) GetAllApplications(c echo.Context) error {
	userID := c.Get("userID").(int64)
	statusParam := c.QueryParam("status")

	queries := db.New(client.Conn)

	var status pgtype.Text
	status.String = statusParam
	status.Valid = true

	var applications []db.Application
	var err error

	user, err := queries.GetOneUserByID(ctx, int32(userID))
	if err != nil {
		http.Error(w, "Unable to get user", http.StatusBadRequest)
	}

	if statusParam == "all" {
		applications, err = queries.GetAllApplications(ctx, user.ID)
	} else {
		args := db.GetApplicationsByStatusParams{
			Status: status,
			UserID: user.ID,
		}

		applications, err = queries.GetApplicationsByStatus(ctx, args)
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
