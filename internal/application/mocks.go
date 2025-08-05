package application

import (
	db "ApplyTrack/internal/db/queries"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockStore struct {
	mock.Mock
}

func (m *MockStore) GetAll(userID uuid.UUID) ([]db.Application, error) {
	args := m.Called(userID)
	return args.Get(0).([]db.Application), args.Error(1)
}

func (m *MockStore) GetOne(userID, ID uuid.UUID) (db.Application, error) {
	args := m.Called(userID, ID)
	return args.Get(0).(db.Application), args.Error(1)
}

func (m *MockStore) CreateOne(application db.CreateOneApplicationParams) (db.Application, error) {
	args := m.Called(application)
	return args.Get(0).(db.Application), args.Error(1)
}

func (m *MockStore) DeleteOne(userID, ID uuid.UUID) error {
	args := m.Called(userID, ID)
	return args.Error(0)
}

func (m *MockStore) UpdateOne(application db.UpdateOneApplicationByIDParams) (db.Application, error) {
	args := m.Called(application)
	return args.Get(0).(db.Application), args.Error(1)
}

func (m *MockStore) GetCounts(userID uuid.UUID) (db.GetApplicationCountsByUserRow, error) {
	args := m.Called(userID)
	return args.Get(0).(db.GetApplicationCountsByUserRow), args.Error(1)
}

func (m *MockStore) GetAnalyticsOverview(userID uuid.UUID) (db.GetAnalyticsOverviewRow, error) {
	args := m.Called(userID)
	return args.Get(0).(db.GetAnalyticsOverviewRow), args.Error(1)
}

func (m *MockStore) GetAnalyticsTrends(userID uuid.UUID, startDate, endDate string) ([]db.GetAnalyticsTrendsRow, error) {
	args := m.Called(userID, startDate, endDate)
	return args.Get(0).([]db.GetAnalyticsTrendsRow), args.Error(1)
}

func (m *MockStore) GetAnalyticsCompanies(userID uuid.UUID) ([]db.GetAnalyticsCompaniesRow, error) {
	args := m.Called(userID)
	return args.Get(0).([]db.GetAnalyticsCompaniesRow), args.Error(1)
}

func (m *MockStore) GetTopCompany(userID uuid.UUID) (string, error) {
	args := m.Called(userID)
	return args.String(0), args.Error(1)
}