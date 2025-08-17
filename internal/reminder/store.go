package reminder

import (
	"context"

	db "ApplyTrack/internal/db/queries"

	"github.com/google/uuid"
)

type Store interface {
	GetReminders(userID uuid.UUID) ([]db.Reminder, error)
	CreateReminder(userID uuid.UUID, req db.CreateReminderParams) (db.Reminder, error)
	UpdateReminder(storeReq db.UpdateReminderParams) (db.Reminder, error)
	CompleteReminder(userID, reminderID uuid.UUID) error
	DeleteReminder(userID, reminderID uuid.UUID) error

	GetDueReminders(userID uuid.UUID) ([]db.GetReminderDueRow, error)
	GetRemindersDueToday(userID uuid.UUID) ([]db.GetRemindersDueTodayRow, error)
	GetRemindersDueThisWeek(userID uuid.UUID) ([]db.GetRemindersDueThisWeekRow, error)
	GetRemindersOverdue(userID uuid.UUID) ([]db.GetRemindersOverdueRow, error)
	GetTotalOverdueReminders(userID uuid.UUID) (int64, error)
}

type postgresReminderStore struct {
	db *db.Queries
}

func NewStore(queries *db.Queries) *postgresReminderStore {
	return &postgresReminderStore{
		db: queries,
	}
}

func (s *postgresReminderStore) GetReminders(userID uuid.UUID) ([]db.Reminder, error) {
	ctx := context.Background()
	reminders, err := s.db.GetRemindersByUser(ctx, userID)
	if err != nil {
		return nil, err
	}
	return reminders, nil
}

func (s *postgresReminderStore) CreateReminder(userID uuid.UUID, req db.CreateReminderParams) (db.Reminder, error) {
	ctx := context.Background()
	reminder, err := s.db.CreateReminder(ctx, req)
	if err != nil {
		return db.Reminder{}, err
	}
	return reminder, nil
}

func (s *postgresReminderStore) CompleteReminder(userID, reminderID uuid.UUID) error {
	ctx := context.Background()
	err := s.db.ReminderCompleted(ctx, db.ReminderCompletedParams{
		UserID: userID,
		ID:     reminderID,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *postgresReminderStore) DeleteReminder(userID, reminderID uuid.UUID) error {
	ctx := context.Background()
	err := s.db.DeleteReminder(ctx, db.DeleteReminderParams{
		UserID: userID,
		ID:     reminderID,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *postgresReminderStore) GetDueReminders(userID uuid.UUID) ([]db.GetReminderDueRow, error) {
	ctx := context.Background()
	reminders, err := s.db.GetReminderDue(ctx, userID)
	if err != nil {
		return nil, err
	}
	return reminders, nil
}

func (s *postgresReminderStore) UpdateReminder(storeReq db.UpdateReminderParams) (db.Reminder, error) {
	ctx := context.Background()
	reminder, err := s.db.UpdateReminder(ctx, storeReq)
	if err != nil {
		return db.Reminder{}, err
	}
	return reminder, nil
}

func (s *postgresReminderStore) GetRemindersDueToday(userID uuid.UUID) ([]db.GetRemindersDueTodayRow, error) {
	ctx := context.Background()
	reminders, err := s.db.GetRemindersDueToday(ctx, userID)
	if err != nil {
		return nil, err
	}
	return reminders, nil
}

func (s *postgresReminderStore) GetRemindersDueThisWeek(userID uuid.UUID) ([]db.GetRemindersDueThisWeekRow, error) {
	ctx := context.Background()
	reminders, err := s.db.GetRemindersDueThisWeek(ctx, userID)
	if err != nil {
		return nil, err
	}
	return reminders, nil
}

func (s *postgresReminderStore) GetRemindersOverdue(userID uuid.UUID) ([]db.GetRemindersOverdueRow, error) {
	ctx := context.Background()
	reminders, err := s.db.GetRemindersOverdue(ctx, userID)
	if err != nil {
		return nil, err
	}
	return reminders, nil
}

func (s *postgresReminderStore) GetTotalOverdueReminders(userID uuid.UUID) (int64, error) {
	ctx := context.Background()
	total, err := s.db.GetTotalRemindersByUser(ctx, userID)
	if err != nil {
		return 0, err
	}
	return total, nil
}
