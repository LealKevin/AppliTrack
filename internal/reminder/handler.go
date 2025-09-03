package reminder

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) RegisterRoutes(e *echo.Group) {
	e.GET("/reminders", h.GetReminders)
	e.POST("/reminders", h.CreateReminder)
	e.PUT("/reminders/:id", h.UpdateReminder)
	e.PUT("/reminders/:id/complete", h.CompleteReminder)
	e.DELETE("/reminders/:id", h.DeleteReminder)
	e.GET("/reminders/due", h.GetDueReminders)

	e.GET("/reminders/dashboard", h.GetRemindersWithApplications)
}

type ReminderResp struct {
	ID            uuid.UUID `json:"id"`
	ReminderDate  time.Time `json:"reminder_date"`
	Status        string    `json:"status"`
	ApplicationID uuid.UUID `json:"application_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

func (h *Handler) GetReminders(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	reminders, err := h.service.GetReminders(userID)
	if err != nil {
		return echo.NewHTTPError(500, "Failed to fetch reminders")
	}
	return c.JSON(200, reminders)
}

type ReminderReq struct {
	Status        *string   `json:"status"`
	ReminderDate  time.Time `json:"reminder_date"`
	ApplicationID uuid.UUID `json:"application_id"`
}

func (h *Handler) CreateReminder(c echo.Context) error {
	var req ReminderReq
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(400, "Invalid request body")
	}

	userID := c.Get("userID").(uuid.UUID)
	reminder, err := h.service.CreateReminder(userID, req)
	if err != nil {
		return echo.NewHTTPError(500, "Failed to create reminder")
	}

	return c.JSON(201, reminder)
}

func (h *Handler) CompleteReminder(c echo.Context) error {
	reminderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(400, "Invalid reminder ID")
	}
	userID := c.Get("userID").(uuid.UUID)

	if err := h.service.CompleteReminder(userID, reminderID); err != nil {
		return echo.NewHTTPError(500, "Failed to complete reminder")
	}

	return c.NoContent(204)
}

func (h *Handler) DeleteReminder(c echo.Context) error {
	reminderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(400, "Invalid reminder ID")
	}
	userID := c.Get("userID").(uuid.UUID)

	if err := h.service.DeleteReminder(userID, reminderID); err != nil {
		return echo.NewHTTPError(500, "Failed to delete reminder")
	}

	return c.NoContent(204)
}

func (h *Handler) GetDueReminders(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	dueReminders, err := h.service.GetDueReminders(userID)
	if err != nil {
		return echo.NewHTTPError(500, "Failed to fetch due reminders")
	}
	return c.JSON(200, dueReminders)
}

func (h *Handler) UpdateReminder(c echo.Context) error {
	reminderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(400, "Invalid reminder ID")
	}

	var req ReminderReq
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(400, "Invalid request body")
	}

	userID := c.Get("userID").(uuid.UUID)
	reminder, err := h.service.UpdateReminder(userID, reminderID, req)
	if err != nil {
		return echo.NewHTTPError(500, "Failed to update reminder")
	}

	return c.JSON(200, reminder)
}

func (h *Handler) GetRemindersWithApplications(c echo.Context) error {
	userID := c.Get("userID").(uuid.UUID)
	reminders, err := h.service.GetRemindersWithApplications(userID)
	if err != nil {
		return echo.NewHTTPError(500, "Failed to fetch reminders with applications")
	}
	return c.JSON(200, reminders)
}
