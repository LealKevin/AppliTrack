package application

import (
	"fmt"
	"io"
	"net/http"
	"time"

	db "ApplyTrack/internal/db/queries"
	"ApplyTrack/internal/utils"

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
	e.GET("/applications/:id", h.GetOneApplication)
	e.POST("/application", h.CreateApplication)
	e.DELETE("/applications/:id", h.DeleteApplication)
	e.PUT("/applications/:id", h.UpdateApplication)

	e.POST("/application/import", h.ImportApplications)

	e.GET("/applications/count", h.GetApplicationCounts)
	e.GET("/analytics/overview", h.GetAnalyticsOverview)
	e.GET("/analytics/trends", h.GetAnalyticsTrends)
	e.GET("/analytics/companies", h.GetAnalyticsCompanies)

	e.GET("/applications/:id/rounds", h.GetApplicationRounds)
	e.POST("/application/:id/rounds", h.CreateRound)
	e.PUT("/rounds/:id", h.UpdateRound)
	e.DELETE("/rounds/:id", h.DeleteRound)

	e.GET("/interviews", h.GetInterviewApplications)
}

type applicationResp struct {
	ID               uuid.UUID `json:"id"`
	TitleApplication string    `json:"title_application"`
	Company          string    `json:"company"`
	Location         string    `json:"location"`
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
	All                int64 `json:"all_count"`
	Sent               int64 `json:"sent_count"`
	Pending            int64 `json:"pending_count"`
	Rejected           int64 `json:"rejected_count"`
	InterviewScheduled int64 `json:"interview_scheduled_count"`
	Interviewing       int64 `json:"interviewing_count"`
	Offer              int64 `json:"offer_count"`
}

type analyticsOverviewResp struct {
	TotalApplications    int64   `json:"total_applications"`
	SuccessRate          float64 `json:"success_rate"`
	ApplicationsThisWeek int64   `json:"applications_this_week"`
	TopCompany           string  `json:"top_company"`
}

type analyticsTrendsResp struct {
	Trends []dailyTrend `json:"trends"`
}

type dailyTrend struct {
	Date  string `json:"date"`
	Count int64  `json:"count"`
}

type analyticsCompaniesResp struct {
	Companies []companyStats `json:"companies"`
}

type companyStats struct {
	Name         string  `json:"name"`
	Applications int64   `json:"applications"`
	SuccessRate  float64 `json:"success_rate"`
}

func (h *Handler) GetAllApplications(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	status := c.QueryParam("status")

	applicationsResp, err := h.Service.GetAllApplications(userID, status)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load applications")
	}

	return c.JSON(http.StatusOK, applicationsResp)
}

func (h *Handler) GetOneApplication(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	ID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid application ID")
	}

	application, err := h.Service.GetApplicationByID(userID, ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load application")
	}

	return c.JSON(http.StatusOK, application)
}

func (h *Handler) DeleteApplication(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	appID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid application ID")
	}
	fmt.Println("userID:", userID)
	fmt.Println("appID:", appID)

	if err := h.Store.DeleteOne(userID, appID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not delete application")
	}

	return c.NoContent(http.StatusNoContent)
}

type CreateApplicationRequest struct {
	TitleApplication string    `json:"title" validate:"required,min=3"`
	Company          string    `json:"company" validate:"required,min=2"`
	Location         string    `json:"location" validate:"required,min=2"`
	SentDate         time.Time `json:"sent_date" validate:"required"`
	Status           *string   `json:"status" validate:"required,oneof=sent pending rejected interview_scheduled interviewing offer"`
	Notes            *string   `json:"notes"`
	UrlApplication   *string   `json:"url_application" validate:"omitempty,url"`
}

func (h *Handler) CreateApplication(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	var appRequest CreateApplicationRequest
	if err := c.Bind(&appRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid input")
	}

	if err := c.Validate(appRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "validation failed: "+err.Error())
	}

	app := db.CreateOneApplicationParams{
		TitleApplication: appRequest.TitleApplication,
		Company:          appRequest.Company,
		Location:         appRequest.Location,
		SentDate:         appRequest.SentDate,
		Status:           utils.PgtypeTextFromPointer(appRequest.Status),
		Notes:            utils.PgtypeTextFromPointer(appRequest.Notes),
		UrlApplication:   utils.PgtypeTextFromPointer(appRequest.UrlApplication),
		UserID:           userID,
	}
	fmt.Println("Creating application with params:", appRequest)

	application, err := h.Store.CreateOne(app)
	if err != nil {
		if IsDuplicateError(err) {
			return echo.NewHTTPError(http.StatusConflict, "Application with same title, company, and date already exists")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, mapperToApplicationResp(application))
}

type UpdateApplicationRequest struct {
	ID               uuid.UUID `json:"id"`
	TitleApplication string    `json:"title"`
	Company          string    `json:"company"`
	Location         string    `json:"location"`
	SentDate         time.Time `json:"sent_date"`
	Status           *string   `json:"status"`
	Notes            *string   `json:"notes"`
	UrlApplication   *string   `json:"url_application"`
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
		Location:         appRequest.Location,
		SentDate:         appRequest.SentDate,
		Status:           utils.PgtypeTextFromPointer(appRequest.Status),
		Notes:            utils.PgtypeTextFromPointer(appRequest.Notes),
		UrlApplication:   utils.PgtypeTextFromPointer(appRequest.UrlApplication),
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
		All:                counts.TotalCount,
		Sent:               counts.SentCount,
		Pending:            counts.PendingCount,
		Rejected:           counts.RejectedCount,
		Interviewing:       counts.Interviewing,
		InterviewScheduled: counts.InterviewScheduled,
		Offer:              counts.OfferCount,
	}

	return c.JSON(http.StatusOK, response)
}

func (h *Handler) ImportApplications(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)

	file, err := c.FormFile("file")
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "could not read file")
	}

	src, err := file.Open()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not open file")
	}
	srcBytes, err := io.ReadAll(src)

	resultImport, err := h.Service.ImportApplicationsFromCSV(userID, srcBytes)
	defer src.Close()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not import applications")
	}

	return c.JSON(http.StatusOK, resultImport)
}

func (h *Handler) GetAnalyticsOverview(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)

	overview, err := h.Store.GetAnalyticsOverview(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load analytics overview")
	}

	topCompany, err := h.Store.GetTopCompany(userID)
	if err != nil {
		topCompany = "N/A"
	}

	successRate := overview.SuccessRate

	response := analyticsOverviewResp{
		TotalApplications:    overview.TotalApplications,
		SuccessRate:          successRate,
		ApplicationsThisWeek: overview.ApplicationsThisWeek,
		TopCompany:           topCompany,
	}

	return c.JSON(http.StatusOK, response)
}

func (h *Handler) GetAnalyticsTrends(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)

	startDate := c.QueryParam("start_date")
	endDate := c.QueryParam("end_date")

	if startDate == "" {
		startDate = time.Now().AddDate(0, 0, -30).Format("2006-01-02")
	}
	if endDate == "" {
		endDate = time.Now().Format("2006-01-02")
	}

	trends, err := h.Store.GetAnalyticsTrends(userID, startDate, endDate)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load analytics trends")
	}

	var trendData []dailyTrend
	for _, trend := range trends {
		trendData = append(trendData, dailyTrend{
			Date:  trend.Date,
			Count: trend.Count,
		})
	}

	response := analyticsTrendsResp{
		Trends: trendData,
	}

	return c.JSON(http.StatusOK, response)
}

func (h *Handler) GetAnalyticsCompanies(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)

	companies, err := h.Store.GetAnalyticsCompanies(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load analytics companies")
	}

	var companyData []companyStats
	for _, company := range companies {
		successRate := company.SuccessRate

		companyData = append(companyData, companyStats{
			Name:         company.Name,
			Applications: company.Applications,
			SuccessRate:  successRate,
		})
	}

	response := analyticsCompaniesResp{
		Companies: companyData,
	}

	return c.JSON(http.StatusOK, response)
}

type RoundResp struct {
	ID            uuid.UUID `json:"id"`
	ApplicationID uuid.UUID `json:"application_id"`
	Title         string    `json:"title"`
	Type          string    `json:"type"`
	Status        string    `json:"status"`
	Date          time.Time `json:"date"`
	Notes         string    `json:"notes"`
	Interviewer   string    `json:"interviewer"`
	Duration      string    `json:"duration"`
	Outcome       string    `json:"outcome"`
	Created_at    time.Time `json:"created_at"`
	Updated_at    time.Time `json:"updated_at"`
}

type InterviewApplicationResp struct {
	Application applicationResp `json:"Application"`
	Rounds      []RoundResp     `json:"Rounds"`
}

func (h *Handler) GetApplicationRounds(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	applicationID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid application ID")
	}

	ApplicationRoundsResp, err := h.Service.GetApplicationRounds(userID, applicationID)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Unable to get Application Rounds")
	}

	return c.JSON(http.StatusOK, ApplicationRoundsResp)
}

type RoundRequest struct {
	Title         string    `json:"title"`
	Type          string    `json:"type"`
	Status        string    `json:"status"`
	Date          time.Time `json:"date"`
	Notes         *string   `json:"notes,omitempty"`
	Interviewer   *string   `json:"interviewer,omitempty"`
	Duration      *string   `json:"duration,omitempty"`
	Outcome       *string   `json:"outcome,omitempty"`
	ApplicationID uuid.UUID `json:"application_id"`
}

func (h *Handler) CreateRound(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	applicationID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid application ID")
	}

	var roundRequest RoundRequest
	if err := c.Bind(&roundRequest); err != nil {
		fmt.Println("Creating round with params:", roundRequest)
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("invalid round json: %w", err))
	}

	createdRound, err := h.Service.CreateRound(userID, applicationID, roundRequest)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "unable to create round: "+err.Error())
	}

	return c.JSON(http.StatusCreated, createdRound)
}

type UpdateRoundRequest struct {
	ID            uuid.UUID `json:"id"`
	Title         string    `json:"title"`
	Type          string    `json:"type"`
	Status        string    `json:"status"`
	Date          time.Time `json:"date"`
	Notes         *string   `json:"notes,omitempty"`
	Interviewer   *string   `json:"interviewer,omitempty"`
	Duration      *string   `json:"duration,omitempty"`
	Outcome       *string   `json:"outcome,omitempty"`
	ApplicationID uuid.UUID `json:"application_id"`
}

func (h *Handler) UpdateRound(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)

	var updateRoundRequest UpdateRoundRequest
	if err := c.Bind(&updateRoundRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid round json")
	}

	updatedRound, err := h.Service.UpdateRound(userID, updateRoundRequest)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "unable to update round")
	}

	return c.JSON(http.StatusOK, updatedRound)
}

func (h *Handler) DeleteRound(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	roundID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid round ID")
	}

	if err := h.Service.DeleteRound(userID, roundID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not delete round")
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *Handler) GetInterviewApplications(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)

	applications, err := h.Service.GetInterviewApplications(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not load interview applications")
	}

	return c.JSON(http.StatusOK, applications)
}
