package application

import (
	"errors"
	"testing"
	"time"

	db "ApplyTrack/internal/db/queries"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestImportApplicationsFromCSV(t *testing.T) {
	userID := uuid.New()

	tests := []struct {
		name           string
		csvData        string
		mockSetup      func(*MockStore)
		expectedResult ImportResult
		expectError    bool
	}{
		{
			name: "successful import with valid CSV",
			csvData: `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com
Backend Developer,StartupInc,2024-01-16,New York,pending,Remote work,https://startup.com`,
			mockSetup: func(mockStore *MockStore) {
				mockStore.On("CreateOne", db.CreateOneApplicationParams{
					UserID:           userID,
					TitleApplication: "Software Engineer",
					Company:          "TechCorp",
					SentDate:         time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
					Location:         "San Francisco",
					Status:           "sent",
					Notes:            "Great opportunity",
					UrlApplication:   "https://example.com",
				}).Return(db.Application{
					ID:               uuid.New(),
					TitleApplication: "Software Engineer",
					Company:          "TechCorp",
					SentDate:         time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
					Location:         "San Francisco",
					Status:           "sent",
					Notes:            "Great opportunity",
					UrlApplication:   "https://example.com",
					UserID:           userID,
					CreatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
					UpdatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
				}, nil)

				mockStore.On("CreateOne", db.CreateOneApplicationParams{
					UserID:           userID,
					TitleApplication: "Backend Developer",
					Company:          "StartupInc",
					SentDate:         time.Date(2024, 1, 16, 0, 0, 0, 0, time.UTC),
					Location:         "New York",
					Status:           "pending",
					Notes:            "Remote work",
					UrlApplication:   "https://startup.com",
				}).Return(db.Application{
					ID:               uuid.New(),
					TitleApplication: "Backend Developer",
					Company:          "StartupInc",
					SentDate:         time.Date(2024, 1, 16, 0, 0, 0, 0, time.UTC),
					Location:         "New York",
					Status:           "pending",
					Notes:            "Remote work",
					UrlApplication:   "https://startup.com",
					UserID:           userID,
					CreatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
					UpdatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
				}, nil)
			},
			expectedResult: ImportResult{
				TotalRecords: 2,
				SuccessCount: 2,
				FailureCount: 0,
				Failures:     nil,
			},
			expectError: false,
		},
		{
			name:    "empty CSV file",
			csvData: "",
			mockSetup: func(mockStore *MockStore) {
			},
			expectedResult: ImportResult{},
			expectError:    true,
		},
		{
			name:    "CSV with only headers",
			csvData: `title,company,sent_date,location,status,notes,url`,
			mockSetup: func(mockStore *MockStore) {
			},
			expectedResult: ImportResult{
				TotalRecords: 0,
				SuccessCount: 0,
				FailureCount: 0,
				Failures:     nil,
			},
			expectError: false,
		},
		{
			name: "CSV with insufficient columns",
			csvData: `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity`,
			mockSetup: func(mockStore *MockStore) {
			},
			expectedResult: ImportResult{},
			expectError:    true,
		},
		{
			name: "CSV with invalid date format",
			csvData: `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,invalid-date,San Francisco,sent,Great opportunity,https://example.com`,
			mockSetup: func(mockStore *MockStore) {
			},
			expectedResult: ImportResult{
				TotalRecords: 1,
				SuccessCount: 0,
				FailureCount: 1,
				Failures:     []string{"Row 2: invalid date format in SentDate field"},
			},
			expectError: false,
		},
		{
			name: "database error during creation",
			csvData: `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com`,
			mockSetup: func(mockStore *MockStore) {
				mockStore.On("CreateOne", db.CreateOneApplicationParams{
					UserID:           userID,
					TitleApplication: "Software Engineer",
					Company:          "TechCorp",
					SentDate:         time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
					Location:         "San Francisco",
					Status:           "sent",
					Notes:            "Great opportunity",
					UrlApplication:   "https://example.com",
				}).Return(db.Application{}, errors.New("database connection failed"))
			},
			expectedResult: ImportResult{
				TotalRecords: 1,
				SuccessCount: 0,
				FailureCount: 1,
				Failures:     []string{"Row 2: database connection failed"},
			},
			expectError: false,
		},
		{
			name: "mixed success and failure",
			csvData: `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com
Backend Developer,StartupInc,invalid-date,New York,pending,Remote work,https://startup.com
Frontend Developer,BigCorp,2024-01-17,Boston,rejected,Not selected,https://bigcorp.com`,
			mockSetup: func(mockStore *MockStore) {
				mockStore.On("CreateOne", db.CreateOneApplicationParams{
					UserID:           userID,
					TitleApplication: "Software Engineer",
					Company:          "TechCorp",
					SentDate:         time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
					Location:         "San Francisco",
					Status:           "sent",
					Notes:            "Great opportunity",
					UrlApplication:   "https://example.com",
				}).Return(db.Application{
					ID:               uuid.New(),
					TitleApplication: "Software Engineer",
					Company:          "TechCorp",
					SentDate:         time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
					Location:         "San Francisco",
					Status:           "sent",
					Notes:            "Great opportunity",
					UrlApplication:   "https://example.com",
					UserID:           userID,
					CreatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
					UpdatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
				}, nil)

				mockStore.On("CreateOne", db.CreateOneApplicationParams{
					UserID:           userID,
					TitleApplication: "Frontend Developer",
					Company:          "BigCorp",
					SentDate:         time.Date(2024, 1, 17, 0, 0, 0, 0, time.UTC),
					Location:         "Boston",
					Status:           "rejected",
					Notes:            "Not selected",
					UrlApplication:   "https://bigcorp.com",
				}).Return(db.Application{
					ID:               uuid.New(),
					TitleApplication: "Frontend Developer",
					Company:          "BigCorp",
					SentDate:         time.Date(2024, 1, 17, 0, 0, 0, 0, time.UTC),
					Location:         "Boston",
					Status:           "rejected",
					Notes:            "Not selected",
					UrlApplication:   "https://bigcorp.com",
					UserID:           userID,
					CreatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
					UpdatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
				}, nil)
			},
			expectedResult: ImportResult{
				TotalRecords: 3,
				SuccessCount: 2,
				FailureCount: 1,
				Failures:     []string{"Row 3: invalid date format in SentDate field"},
			},
			expectError: false,
		},
		{
			name: "malformed CSV data",
			csvData: `title,company,sent_date,location,status,notes,url
"Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com`,
			mockSetup: func(mockStore *MockStore) {
			},
			expectedResult: ImportResult{},
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockStore := new(MockStore)
			if tt.mockSetup != nil {
				tt.mockSetup(mockStore)
			}

			service := NewService(mockStore)
			result, err := service.ImportApplicationsFromCSV(userID, []byte(tt.csvData))

			if tt.expectError {
				require.Error(t, err)
				return
			}

			require.NoError(t, err)
			assert.Equal(t, tt.expectedResult.TotalRecords, result.TotalRecords)
			assert.Equal(t, tt.expectedResult.SuccessCount, result.SuccessCount)
			assert.Equal(t, tt.expectedResult.FailureCount, result.FailureCount)
			assert.ElementsMatch(t, tt.expectedResult.Failures, result.Failures)

			mockStore.AssertExpectations(t)
		})
	}
}

func TestImportApplicationsFromCSV_EdgeCases(t *testing.T) {
	userID := uuid.New()

	t.Run("empty fields in CSV", func(t *testing.T) {
		csvData := `title,company,sent_date,location,status,notes,url
,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com`

		mockStore := new(MockStore)
		mockStore.On("CreateOne", db.CreateOneApplicationParams{
			UserID:           userID,
			TitleApplication: "",
			Company:          "TechCorp",
			SentDate:         time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
			Location:         "San Francisco",
			Status:           "sent",
			Notes:            "Great opportunity",
			UrlApplication:   "https://example.com",
		}).Return(db.Application{
			ID:               uuid.New(),
			TitleApplication: "",
			Company:          "TechCorp",
			SentDate:         time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
			Location:         "San Francisco",
			Status:           "sent",
			Notes:            "Great opportunity",
			UrlApplication:   "https://example.com",
			UserID:           userID,
			CreatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
			UpdatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
		}, nil)

		service := NewService(mockStore)
		result, err := service.ImportApplicationsFromCSV(userID, []byte(csvData))

		require.NoError(t, err)
		assert.Equal(t, 1, result.TotalRecords)
		assert.Equal(t, 1, result.SuccessCount)
		assert.Equal(t, 0, result.FailureCount)

		mockStore.AssertExpectations(t)
	})

	t.Run("date edge cases", func(t *testing.T) {
		testCases := []struct {
			name     string
			date     string
			expected time.Time
		}{
			{"leap year date", "2024-02-29", time.Date(2024, 2, 29, 0, 0, 0, 0, time.UTC)},
			{"end of year", "2024-12-31", time.Date(2024, 12, 31, 0, 0, 0, 0, time.UTC)},
			{"start of year", "2024-01-01", time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)},
		}

		for _, tc := range testCases {
			t.Run(tc.name, func(t *testing.T) {
				csvData := `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,` + tc.date + `,San Francisco,sent,Great opportunity,https://example.com`

				mockStore := new(MockStore)
				mockStore.On("CreateOne", db.CreateOneApplicationParams{
					UserID:           userID,
					TitleApplication: "Software Engineer",
					Company:          "TechCorp",
					SentDate:         tc.expected,
					Location:         "San Francisco",
					Status:           "sent",
					Notes:            "Great opportunity",
					UrlApplication:   "https://example.com",
				}).Return(db.Application{
					ID:               uuid.New(),
					TitleApplication: "Software Engineer",
					Company:          "TechCorp",
					SentDate:         tc.expected,
					Location:         "San Francisco",
					Status:           "sent",
					Notes:            "Great opportunity",
					UrlApplication:   "https://example.com",
					UserID:           userID,
					CreatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
					UpdatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
				}, nil)

				service := NewService(mockStore)
				result, err := service.ImportApplicationsFromCSV(userID, []byte(csvData))

				require.NoError(t, err)
				assert.Equal(t, 1, result.TotalRecords)
				assert.Equal(t, 1, result.SuccessCount)
				assert.Equal(t, 0, result.FailureCount)

				mockStore.AssertExpectations(t)
			})
		}
	})
}
