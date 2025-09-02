package reminder

import (
	"time"

	"ApplyTrack/internal/application"
	db "ApplyTrack/internal/db/queries"
	"ApplyTrack/internal/utils"

	"github.com/google/uuid"
)

type Service interface {
	GetReminders(userID uuid.UUID) ([]ReminderResp, error)
	CreateReminder(userID uuid.UUID, req ReminderReq) (ReminderResp, error)
	UpdateReminder(userID, reminderID uuid.UUID, req ReminderReq) (ReminderResp, error)
	CompleteReminder(userID, reminderID uuid.UUID) error
	DeleteReminder(userID, reminderID uuid.UUID) error
	GetDueReminders(userID uuid.UUID) ([]ReminderResp, error)
	GetRemindersWithApplications(userID uuid.UUID) (OverdueReminderResp, error)
}

type reminderService struct {
	store Store
}

func NewService(store Store) *reminderService {
	return &reminderService{
		store: store,
	}
}

func (s *reminderService) GetReminders(userID uuid.UUID) ([]ReminderResp, error) {
	reminders, err := s.store.GetReminders(userID)
	if err != nil {
		return nil, err
	}

	var resp []ReminderResp
	for _, reminder := range reminders {
		resp = append(resp, ReminderResp{
			ID:            reminder.ID,
			ReminderDate:  reminder.ReminderDate,
			Status:        *utils.PgtypeTextToPointer(reminder.Status),
			ApplicationID: reminder.ApplicationID,
			CreatedAt:     reminder.CreatedAt,
			UpdatedAt:     reminder.UpdatedAt,
		})
	}

	return resp, nil
}

func (s *reminderService) CreateReminder(userID uuid.UUID, req ReminderReq) (ReminderResp, error) {
	storeReq := db.CreateReminderParams{
		Status:        utils.PgtypeTextFromPointer(req.Status),
		ReminderDate:  req.ReminderDate,
		ApplicationID: req.ApplicationID,
	}
	reminder, err := s.store.CreateReminder(storeReq)
	if err != nil {
		return ReminderResp{}, err
	}

	return ReminderResp{
		ID:            reminder.ID,
		ReminderDate:  reminder.ReminderDate,
		Status:        *utils.PgtypeTextToPointer(reminder.Status),
		ApplicationID: reminder.ApplicationID,
		CreatedAt:     reminder.CreatedAt,
		UpdatedAt:     reminder.UpdatedAt,
	}, nil
}

func (s *reminderService) CompleteReminder(userID, reminderID uuid.UUID) error {
	err := s.store.CompleteReminder(userID, reminderID)
	if err != nil {
		return err
	}
	return nil
}

func (s *reminderService) DeleteReminder(userID, reminderID uuid.UUID) error {
	err := s.store.DeleteReminder(userID, reminderID)
	if err != nil {
		return err
	}
	return nil
}

func (s *reminderService) GetDueReminders(userID uuid.UUID) ([]ReminderResp, error) {
	reminders, err := s.store.GetDueReminders(userID)
	if err != nil {
		return nil, err
	}

	var resp []ReminderResp
	for _, reminder := range reminders {
		resp = append(resp, ReminderResp{
			ID:            reminder.ID,
			ReminderDate:  reminder.ReminderDate,
			Status:        *utils.PgtypeTextToPointer(reminder.Status),
			ApplicationID: reminder.ApplicationID,
			CreatedAt:     reminder.CreatedAt,
			UpdatedAt:     reminder.UpdatedAt,
		})
	}

	return resp, nil
}

func (s *reminderService) UpdateReminder(userID, reminderID uuid.UUID, req ReminderReq) (ReminderResp, error) {
	storeReq := db.UpdateReminderParams{
		ID:           reminderID,
		Status:       utils.PgtypeTextFromPointer(req.Status),
		ReminderDate: req.ReminderDate,
		UserID:       userID,
	}

	reminder, err := s.store.UpdateReminder(storeReq)
	if err != nil {
		return ReminderResp{}, err
	}

	return ReminderResp{
		ID:            reminder.ID,
		ReminderDate:  reminder.ReminderDate,
		Status:        *utils.PgtypeTextToPointer(reminder.Status),
		ApplicationID: reminder.ApplicationID,
		CreatedAt:     reminder.CreatedAt,
		UpdatedAt:     reminder.UpdatedAt,
	}, nil
}

type OverdueReminderResp struct {
	Overdue     []ReminderWithApplicationResp `json:"overdue"`
	DueToday    []ReminderWithApplicationResp `json:"due_today"`
	DueThisWeek []ReminderWithApplicationResp `json:"due_this_week"`

	TotalPending int `json:"total_pending"`
}
type ReminderWithApplicationResp struct {
	ID            uuid.UUID `json:"id"`
	ReminderDate  time.Time `json:"reminder_date"`
	Status        string    `json:"status"`
	ApplicationID uuid.UUID `json:"application_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Application   application.ApplicationResp
}

func (s *reminderService) GetRemindersWithApplications(userID uuid.UUID) (OverdueReminderResp, error) {
	dueToday, err := s.store.GetRemindersDueToday(userID)
	if err != nil {
		return OverdueReminderResp{}, err
	}

	dueThisWeek, err := s.store.GetRemindersDueThisWeek(userID)
	if err != nil {
		return OverdueReminderResp{}, err
	}

	overdue, err := s.store.GetRemindersOverdue(userID)
	if err != nil {
		return OverdueReminderResp{}, err
	}

	totalPending, err := s.store.GetTotalOverdueReminders(userID)
	if err != nil {
		return OverdueReminderResp{}, err
	}

	dueTodayResp := make([]ReminderWithApplicationResp, 0, len(dueToday))
	for _, reminder := range dueToday {
		dueTodayResp = append(dueTodayResp, ReminderWithApplicationResp{
			ID:            reminder.ID,
			ReminderDate:  reminder.ReminderDate,
			Status:        *utils.PgtypeTextToPointer(reminder.Status),
			ApplicationID: reminder.ApplicationID,
			CreatedAt:     reminder.CreatedAt,
			UpdatedAt:     reminder.UpdatedAt,
			Application: application.ApplicationResp{
				ID:               utils.PgtypeUUIDToUUID(reminder.ID_2),
				TitleApplication: reminder.TitleApplication.String,
				Company:          reminder.Company.String,
				Location:         reminder.Location.String,
				SentDate:         reminder.SentDate.Time,
				Status:           *utils.PgtypeTextToPointer(reminder.Status_2),
				Notes:            reminder.Notes.String,
				UrlApplication:   reminder.UrlApplication.String,
				CreatedAt:        reminder.CreatedAt_2.Time,
				UpdatedAt:        reminder.UpdatedAt_2.Time,
			},
		})
	}

	dueThisWeekResp := make([]ReminderWithApplicationResp, 0, len(dueThisWeek))
	for _, reminder := range dueThisWeek {
		dueThisWeekResp = append(dueThisWeekResp, ReminderWithApplicationResp{
			ID:            reminder.ID,
			ReminderDate:  reminder.ReminderDate,
			Status:        *utils.PgtypeTextToPointer(reminder.Status),
			ApplicationID: reminder.ApplicationID,
			CreatedAt:     reminder.CreatedAt,
			UpdatedAt:     reminder.UpdatedAt,
			Application: application.ApplicationResp{
				ID:               utils.PgtypeUUIDToUUID(reminder.ID_2),
				TitleApplication: reminder.TitleApplication.String,
				Company:          reminder.Company.String,
				Location:         reminder.Location.String,
				SentDate:         reminder.SentDate.Time,
				Status:           *utils.PgtypeTextToPointer(reminder.Status_2),
				Notes:            reminder.Notes.String,
				UrlApplication:   reminder.UrlApplication.String,
				CreatedAt:        reminder.CreatedAt_2.Time,
				UpdatedAt:        reminder.UpdatedAt_2.Time,
			},
		})
	}

	overdueResp := make([]ReminderWithApplicationResp, 0, len(overdue))
	for _, reminder := range overdue {
		overdueResp = append(overdueResp, ReminderWithApplicationResp{
			ID:            reminder.ID,
			ReminderDate:  reminder.ReminderDate,
			Status:        *utils.PgtypeTextToPointer(reminder.Status),
			ApplicationID: reminder.ApplicationID,
			CreatedAt:     reminder.CreatedAt,
			UpdatedAt:     reminder.UpdatedAt,
			Application: application.ApplicationResp{
				ID:               utils.PgtypeUUIDToUUID(reminder.ID_2),
				TitleApplication: reminder.TitleApplication.String,
				Company:          reminder.Company.String,
				Location:         reminder.Location.String,
				SentDate:         reminder.SentDate.Time,
				Status:           *utils.PgtypeTextToPointer(reminder.Status_2),
				Notes:            reminder.Notes.String,
				UrlApplication:   reminder.UrlApplication.String,
				CreatedAt:        reminder.CreatedAt_2.Time,
				UpdatedAt:        reminder.UpdatedAt_2.Time,
			},
		})
	}

	return OverdueReminderResp{
		Overdue:      overdueResp,
		DueToday:     dueTodayResp,
		DueThisWeek:  dueThisWeekResp,
		TotalPending: int(totalPending),
	}, nil
}
