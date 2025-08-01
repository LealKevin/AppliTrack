package application

import (
	"context"

	db "ApplyTrack/internal/db/queries"

	"github.com/google/uuid"
)

type Store interface {
	GetAll(userID uuid.UUID) ([]db.Application, error)
	GetOne(userID, ID uuid.UUID) (db.Application, error)
	CreateOne(application db.CreateOneApplicationParams) (db.Application, error)
	DeleteOne(userID, ID uuid.UUID) error
	UpdateOne(application db.UpdateOneApplicationByIDParams) (db.Application, error)
	GetCounts(userID uuid.UUID) (db.GetApplicationCountsByUserRow, error)
}

type PostgresApplicationStore struct {
	db *db.Queries
}

func NewApplicationStorage(q *db.Queries) *PostgresApplicationStore {
	return &PostgresApplicationStore{db: q}
}

func (s *PostgresApplicationStore) GetAll(userID uuid.UUID) ([]db.Application, error) {
	ctx := context.Background()

	var applications []db.Application
	var err error

	applications, err = s.db.GetAllApplications(ctx, userID)
	if err != nil {
		return nil, err
	}

	return applications, nil
}

func (s *PostgresApplicationStore) GetOne(UserID, ID uuid.UUID) (db.Application, error) {
	ctx := context.Background()

	application, err := s.db.GetOneApplicationByID(ctx, db.GetOneApplicationByIDParams{
		ID:     ID,
		UserID: UserID,
	})
	if err != nil {
		return db.Application{}, err
	}

	return application, nil
}

func (s *PostgresApplicationStore) DeleteOne(userID, ID uuid.UUID) error {
	ctx := context.Background()

	err := s.db.DeleteOneApplicationByID(ctx, db.DeleteOneApplicationByIDParams{
		ID:     ID,
		UserID: userID,
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *PostgresApplicationStore) CreateOne(app db.CreateOneApplicationParams) (db.Application, error) {
	ctx := context.Background()

	application, err := s.db.CreateOneApplication(ctx, app)
	if err != nil {
		return db.Application{}, err
	}
	return application, nil
}

func (s *PostgresApplicationStore) UpdateOne(app db.UpdateOneApplicationByIDParams) (db.Application, error) {
	ctx := context.Background()
	application, err := s.db.UpdateOneApplicationByID(ctx, app)
	if err != nil {
		return db.Application{}, err
	}
	return application, nil
}

func (s *PostgresApplicationStore) GetCounts(userID uuid.UUID) (db.GetApplicationCountsByUserRow, error) {
	ctx := context.Background()
	counts, err := s.db.GetApplicationCountsByUser(ctx, userID)
	if err != nil {
		return db.GetApplicationCountsByUserRow{}, err
	}
	return counts, nil
}
