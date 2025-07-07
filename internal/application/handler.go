package application

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	Service *ApplicationService
	Store   Store
}

func NewHandler(service *ApplicationService, store Store) *Handler {
	return &Handler{
		Service: service,
		Store:   store,
	}
}

func (h *Handler) RegisterRoutes(e *echo.Echo) {
	e.GET("/applications", h.GetAllApplications)
	//e.GET("/applications/{id}", h.GetOneApplicationByID)
	//e.POST("/application", h.CreateOneApplication)
	//e.DELETE("/applications/{id}", h.DeleteOneApplicationByID)
	//e.PUT("/applications/{id}", h.UpdateOneApplicationByID)
	//e.GET("/applications/count", h.AppsCount)
}

func (h *Handler) GetAllApplications(c echo.Context) error {
	userID := c.Get("userID").(int64)
	applications, err := h.Store.GetAll(int(userID))

	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load applications")
	}

	return c.JSON(http.StatusOK, applications)
}
