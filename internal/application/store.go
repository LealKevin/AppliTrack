package application

import (
	db "ApplyTrack/internal/db/queries"
	"context"
)

type Store interface {
	GetAll(userID int) ([]db.Application, error)
}

type PostgresApplicationStore struct {
	db *db.Queries
}

func NewApplicationStorage(q *db.Queries) *PostgresApplicationStore {
	return &PostgresApplicationStore{db: q}
}

func (s *PostgresApplicationStore) GetAll(userID int) ([]db.Application, error) {
	ctx := context.Background()

	var applications []db.Application
	var err error

	applications, err = s.db.GetAllApplications(ctx, int32(userID))
	if err != nil {
		return nil, err
	}

	return applications, nil
}
