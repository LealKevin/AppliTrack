package application

import (
	"context"
	"fmt"
	"strings"
	"time"

	db "ApplyTrack/internal/db/queries"
	"ApplyTrack/internal/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
)

type Store interface {
	GetAll(userID uuid.UUID) ([]db.Application, error)
	GetOne(userID, ID uuid.UUID) (db.Application, error)
	CreateOne(application db.CreateOneApplicationParams) (db.Application, error)
	DeleteOne(userID, ID uuid.UUID) error
	UpdateOne(application db.UpdateOneApplicationByIDParams) (db.Application, error)
	GetApplicationsByStatus(userID uuid.UUID, status string) ([]db.Application, error)

	GetCounts(userID uuid.UUID) (db.GetApplicationCountsByUserRow, error)
	GetAnalyticsOverview(userID uuid.UUID) (db.GetAnalyticsOverviewRow, error)
	GetAnalyticsTrends(userID uuid.UUID, startDate, endDate string) ([]db.GetAnalyticsTrendsRow, error)
	GetAnalyticsCompanies(userID uuid.UUID) ([]db.GetAnalyticsCompaniesRow, error)
	GetTopCompany(userID uuid.UUID) (string, error)

	GetRounds(appID uuid.UUID) ([]db.Round, error)
	GetRoundByID(roundID uuid.UUID) (db.Round, error)
	CreateRound(round db.CreateRoundParams) (db.Round, error)
	UpdateRound(round db.UpdateRoundParams) (db.Round, error)
	DeleteRound(roundID uuid.UUID) error

	GetInterviewApplications(userID uuid.UUID) ([]db.Application, error)
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

func (s *PostgresApplicationStore) GetApplicationsByStatus(userID uuid.UUID, status string) ([]db.Application, error) {
	ctx := context.Background()

	applications, err := s.db.GetApplicationsByStatus(ctx, db.GetApplicationsByStatusParams{
		Status: utils.PgtypeTextFromPointer(&status),
		UserID: userID,
	})
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
		if pgErr, ok := err.(*pgconn.PgError); ok {
			if pgErr.Code == "23505" && strings.Contains(pgErr.ConstraintName, "unique_title_company_user_date") {
				return db.Application{}, ErrDuplicateApplication
			}
		}
		return db.Application{}, err
	}
	fmt.Println("Created application:", application.ID)
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

func (s *PostgresApplicationStore) GetRounds(appID uuid.UUID) ([]db.Round, error) {
	ctx := context.Background()
	rounds, err := s.db.GetRoundsByApplicationID(ctx, appID)
	if err != nil {
		return []db.Round{}, err
	}
	return rounds, nil
}

func (s *PostgresApplicationStore) CreateRound(round db.CreateRoundParams) (db.Round, error) {
	ctx := context.Background()
	createdRound, err := s.db.CreateRound(ctx, round)
	if err != nil {
		return db.Round{}, fmt.Errorf("could not create round: %w", err)
	}
	return createdRound, nil
}

func (s *PostgresApplicationStore) UpdateRound(round db.UpdateRoundParams) (db.Round, error) {
	ctx := context.Background()
	updatedRound, err := s.db.UpdateRound(ctx, round)
	if err != nil {
		return db.Round{}, fmt.Errorf("could not update round: %w", err)
	}
	return updatedRound, nil
}

func (s *PostgresApplicationStore) DeleteRound(roundID uuid.UUID) error {
	ctx := context.Background()
	err := s.db.DeleteRound(ctx, roundID)
	if err != nil {
		return fmt.Errorf("could not delete round with ID %s: %w", roundID, err)
	}
	return nil
}

func (s *PostgresApplicationStore) GetRoundByID(roundID uuid.UUID) (db.Round, error) {
	ctx := context.Background()
	round, err := s.db.GetRoundByID(ctx, roundID)
	if err != nil {
		return db.Round{}, fmt.Errorf("could not find round with ID %s, error: %w ", roundID, err)
	}
	return round, nil
}

func (s *PostgresApplicationStore) GetInterviewApplications(userID uuid.UUID) ([]db.Application, error) {
	ctx := context.Background()
	applications, err := s.db.GetInterviewsByUser(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("could not get interview applications: %w", err)
	}
	return applications, nil
}
