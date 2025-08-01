package application

import (
	"net/http"
	"time"

	db "ApplyTrack/internal/db/queries"

	"github.com/google/uuid"
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

func (h *Handler) RegisterRoutes(e *echo.Group) {
	e.GET("/applications", h.GetAllApplications)
	e.GET("/applications/{id}", h.GetOneApplication)
	e.POST("/application", h.CreateApplication)
	e.DELETE("/applications/{id}", h.DeleteApplication)
	e.PUT("/applications/{id}", h.UpdateApplication)
	e.GET("/applications/count", h.GetApplicationCounts)
}

type applicationResp struct {
	ID               uuid.UUID `json:"id"`
	TitleApplication string    `json:"title_application"`
	Company          string    `json:"company"`
	SentDate         time.Time `json:"sent_date"`
	Status           string    `json:"status"`
	Notes            string    `json:"notes"`
	UrlApplication   string    `json:"url_application"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type applicationsResp struct {
	Applications []applicationResp `json:"applications"`
}

type applicationCountsResp struct {
	All      int64 `json:"all_count"`
	Sent     int64 `json:"sent_count"`
	Pending  int64 `json:"pending_count"`
	Rejected int64 `json:"rejected_count"`
}

func (h *Handler) GetAllApplications(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	applications, err := h.Store.GetAll(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load applications")
	}
	mapp := make([]applicationResp, len(applications))
	for i, app := range applications {
		mapp[i] = mapperToApplicationResp(app)
	}

	return c.JSON(http.StatusOK, applicationsResp{
		Applications: mapp,
	})
}

func (h *Handler) GetOneApplication(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	ID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid application ID")
	}

	application, err := h.Store.GetOne(userID, ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load application")
	}

	return c.JSON(http.StatusOK, mapperToApplicationResp(application))
}

func (h *Handler) DeleteApplication(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	appID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid application ID")
	}

	if err := h.Store.DeleteOne(userID, appID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not delete application")
	}

	return c.NoContent(http.StatusNoContent)
}

type CreateApplicationRequest struct {
	TitleApplication string    `json:"title"`
	Company          string    `json:"company"`
	SentDate         time.Time `json:"sent_date"`
	Status           string    `json:"status"`
	Notes            string    `json:"notes"`
	UrlApplication   string    `json:"url_application"`
}

func (h *Handler) CreateApplication(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	var appRequest CreateApplicationRequest
	if err := c.Bind(&appRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid input")
	}

	app := db.CreateOneApplicationParams{
		TitleApplication: appRequest.TitleApplication,
		Company:          appRequest.Company,
		SentDate:         appRequest.SentDate,
		Status:           appRequest.Status,
		Notes:            appRequest.Notes,
		UrlApplication:   appRequest.UrlApplication,
		UserID:           userID,
	}

	application, err := h.Store.CreateOne(app)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not create application")
	}

	return c.JSON(http.StatusCreated, mapperToApplicationResp(application))
}

type UpdateApplicationRequest struct {
	ID               uuid.UUID `json:"id"`
	TitleApplication string    `json:"title"`
	Company          string    `json:"company"`
	SentDate         time.Time `json:"sent_date"`
	Status           string    `json:"status"`
	Notes            string    `json:"notes"`
	UrlApplication   string    `json:"url_application"`
}

func (h *Handler) UpdateApplication(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	appID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid application ID")
	}

	var appRequest UpdateApplicationRequest
	if err := c.Bind(&appRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid input")
	}

	updateParams := db.UpdateOneApplicationByIDParams{
		ID:               appID,
		TitleApplication: appRequest.TitleApplication,
		Company:          appRequest.Company,
		SentDate:         appRequest.SentDate,
		Status:           appRequest.Status,
		Notes:            appRequest.Notes,
		UrlApplication:   appRequest.UrlApplication,
		UserID:           userID,
	}

	application, err := h.Store.UpdateOne(updateParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not update application")
	}
	return c.JSON(http.StatusOK, mapperToApplicationResp(application))
}

func (h *Handler) GetApplicationCounts(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)

	counts, err := h.Store.GetCounts(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load application counts")
	}

	response := applicationCountsResp{
		All:      counts.TotalCount,
		Sent:     counts.SentCount,
		Pending:  counts.PendingCount,
		Rejected: counts.RejectedCount,
	}

	return c.JSON(http.StatusOK, response)
}

func mapperToApplicationResp(app db.Application) applicationResp {
	return applicationResp{
		ID:               app.ID,
		TitleApplication: app.TitleApplication,
		Company:          app.Company,
		SentDate:         app.SentDate,
		Status:           app.Status,
		Notes:            app.Notes,
		UrlApplication:   app.UrlApplication,
		CreatedAt:        app.CreatedAt.Time,
		UpdatedAt:        app.UpdatedAt.Time,
	}
}
