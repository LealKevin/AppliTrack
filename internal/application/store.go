package application

import (
	"context"
	"time"

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
	GetAnalyticsOverview(userID uuid.UUID) (db.GetAnalyticsOverviewRow, error)
	GetAnalyticsTrends(userID uuid.UUID, startDate, endDate string) ([]db.GetAnalyticsTrendsRow, error)
	GetAnalyticsCompanies(userID uuid.UUID) ([]db.GetAnalyticsCompaniesRow, error)
	GetTopCompany(userID uuid.UUID) (string, error)
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

func (s *PostgresApplicationStore) GetAnalyticsOverview(userID uuid.UUID) (db.GetAnalyticsOverviewRow, error) {
	ctx := context.Background()
	overview, err := s.db.GetAnalyticsOverview(ctx, userID)
	if err != nil {
		return db.GetAnalyticsOverviewRow{}, err
	}
	return overview, nil
}

func (s *PostgresApplicationStore) GetAnalyticsTrends(userID uuid.UUID, startDate, endDate string) ([]db.GetAnalyticsTrendsRow, error) {
	ctx := context.Background()
	
	startDateTime, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return nil, err
	}
	
	endDateTime, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return nil, err
	}
	
	trends, err := s.db.GetAnalyticsTrends(ctx, db.GetAnalyticsTrendsParams{
		UserID:     userID,
		SentDate:   startDateTime,
		SentDate_2: endDateTime,
	})
	if err != nil {
		return nil, err
	}
	return trends, nil
}

func (s *PostgresApplicationStore) GetAnalyticsCompanies(userID uuid.UUID) ([]db.GetAnalyticsCompaniesRow, error) {
	ctx := context.Background()
	companies, err := s.db.GetAnalyticsCompanies(ctx, userID)
	if err != nil {
		return nil, err
	}
	return companies, nil
}

func (s *PostgresApplicationStore) GetTopCompany(userID uuid.UUID) (string, error) {
	ctx := context.Background()
	company, err := s.db.GetTopCompanyByUser(ctx, userID)
	if err != nil {
		return "", err
	}
	return company, nil
}
