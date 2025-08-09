package application

import (
	"bytes"
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	db "ApplyTrack/internal/db/queries"
	"ApplyTrack/internal/utils"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func matchCreateOneParams(title, company string) interface{} {
	return mock.MatchedBy(func(params db.CreateOneApplicationParams) bool {
		return params.TitleApplication == title && params.Company == company
	})
}

func createMockApplication(title, company string) db.Application {
	return db.Application{
		ID:               uuid.New(),
		TitleApplication: title,
		Company:          company,
		SentDate:         time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
		Location:         "Test Location",
		Status:           "sent",
		Notes:            "Test notes",
		UrlApplication:   "https://example.com",
		UserID:           uuid.New(),
		CreatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
		UpdatedAt:        pgtype.Timestamptz{Time: time.Now(), Valid: true},
	}
}

func TestCreateApplication(t *testing.T) {
	mockStore := new(MockStore)
	service := NewService(mockStore)
	handler := NewHandler(service, mockStore)

	t.Run("CreateApplication_Success", func(t *testing.T) {
		mockStore.On("CreateOne", mock.AnythingOfType("db.CreateOneApplicationParams")).Return(
			createMockApplication("Software Engineer", "TechCorp"), nil)

		e := echo.New()
		e.Validator = &utils.CustomValidator{Validator: validator.New()}

		body := `{
	"title": "Software Engineer",
	"company": "TechCorp",
	"location": "Remote",
	"sent_date": "2025-08-01T00:00:00Z",
	"status": "pending",
	"notes": "",
	"url_application": "https://example.com/job"
}`
		req := httptest.NewRequest(http.MethodPost, "/application", strings.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		userID := uuid.New()
		c.Set("userID", userID)

		err := handler.CreateApplication(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusCreated, rec.Code)
		mockStore.AssertExpectations(t)
	})
	t.Run("CreateApplication_ValidationError", func(t *testing.T) {
		e := echo.New()
		e.Validator = &utils.CustomValidator{Validator: validator.New()}

		body := `{
	"title": "",
	"company": "TechCorp",
	"location": "Remote",
	"sent_date": "2025-08-01T00:00:00Z",
	"status": "pending",
	"notes": "",
	"url_application": "https://example.com/job"
}`
		req := httptest.NewRequest(http.MethodPost, "/application", strings.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		userID := uuid.New()
		c.Set("userID", userID)
		err := handler.CreateApplication(c)

		require.Error(t, err)
		httpErr, ok := err.(*echo.HTTPError)
		require.True(t, ok)

		assert.Equal(t, http.StatusBadRequest, httpErr.Code)
		assert.Contains(t, httpErr.Message.(string), "failed on the 'required' tag")
	})
}

func TestHandler_ImportApplications(t *testing.T) {
	tests := []struct {
		name           string
		setupRequest   func() (*http.Request, error)
		setupMocks     func(*MockStore)
		expectedStatus int
		expectedBody   string
	}{
		{
			name: "successful import",
			setupRequest: func() (*http.Request, error) {
				csvContent := `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com`
				return createMultipartRequest(csvContent)
			},
			setupMocks: func(mockStore *MockStore) {
				mockStore.On("CreateOne", matchCreateOneParams("Software Engineer", "TechCorp")).Return(
					createMockApplication("Software Engineer", "TechCorp"), nil)
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{"total_records":1,"success_count":1,"failure_count":0,"failures":null}`,
		},
		{
			name: "missing file in request",
			setupRequest: func() (*http.Request, error) {
				req := httptest.NewRequest(http.MethodPost, "/application/import", nil)
				req.Header.Set("Content-Type", "multipart/form-data")
				return req, nil
			},
			setupMocks: func(mockStore *MockStore) {
			},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"could not read file"}`,
		},
		{
			name: "empty CSV file",
			setupRequest: func() (*http.Request, error) {
				return createMultipartRequest("")
			},
			setupMocks: func(mockStore *MockStore) {
			},
			expectedStatus: http.StatusInternalServerError,
			expectedBody:   `{"message":"could not import applications"}`,
		},
		{
			name: "invalid CSV format",
			setupRequest: func() (*http.Request, error) {
				csvContent := `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,invalid-date,San Francisco,sent,Great opportunity,https://example.com`
				return createMultipartRequest(csvContent)
			},
			setupMocks: func(mockStore *MockStore) {
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{"total_records":1,"success_count":0,"failure_count":1,"failures":["Row 2: invalid date format in SentDate field"]}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockStore := new(MockStore)
			tt.setupMocks(mockStore)

			service := NewService(mockStore)
			handler := NewHandler(service, mockStore)

			e := echo.New()
			req, err := tt.setupRequest()
			require.NoError(t, err)

			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)

			userID := uuid.New()
			c.Set("userID", userID)

			err = handler.ImportApplications(c)

			if tt.expectedStatus >= 400 {
				require.Error(t, err)
				httpErr, ok := err.(*echo.HTTPError)
				require.True(t, ok)
				assert.Equal(t, tt.expectedStatus, httpErr.Code)
				assert.Contains(t, httpErr.Message, strings.Trim(tt.expectedBody, `{}"message": `))
			} else {
				require.NoError(t, err)
				assert.Equal(t, tt.expectedStatus, rec.Code)
				assert.JSONEq(t, tt.expectedBody, rec.Body.String())
			}

			mockStore.AssertExpectations(t)
		})
	}
}

func TestHandler_ImportApplications_IntegrationTests(t *testing.T) {
	t.Run("end-to-end successful import", func(t *testing.T) {
		mockStore := new(MockStore)

		mockStore.On("CreateOne", matchCreateOneParams("Software Engineer", "TechCorp")).Return(
			createMockApplication("Software Engineer", "TechCorp"), nil)
		mockStore.On("CreateOne", matchCreateOneParams("Backend Developer", "StartupInc")).Return(
			createMockApplication("Backend Developer", "StartupInc"), nil)

		service := NewService(mockStore)
		handler := NewHandler(service, mockStore)

		csvContent := `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com
Backend Developer,StartupInc,2024-01-16,New York,pending,Remote work,https://startup.com`

		req, err := createMultipartRequest(csvContent)
		require.NoError(t, err)

		e := echo.New()
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		userID := uuid.New()
		c.Set("userID", userID)

		err = handler.ImportApplications(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)

		assert.JSONEq(t, `{"total_records":2,"success_count":2,"failure_count":0,"failures":null}`, rec.Body.String())
		mockStore.AssertExpectations(t)
	})

	t.Run("partial success with validation errors", func(t *testing.T) {
		mockStore := new(MockStore)

		mockStore.On("CreateOne", matchCreateOneParams("Software Engineer", "TechCorp")).Return(
			createMockApplication("Software Engineer", "TechCorp"), nil)
		mockStore.On("CreateOne", matchCreateOneParams("Frontend Developer", "BigCorp")).Return(
			createMockApplication("Frontend Developer", "BigCorp"), nil)

		service := NewService(mockStore)
		handler := NewHandler(service, mockStore)

		csvContent := `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com
Backend Developer,StartupInc,invalid-date,New York,pending,Remote work,https://startup.com
Frontend Developer,BigCorp,2024-01-17,Boston,rejected,Not selected,https://bigcorp.com`

		req, err := createMultipartRequest(csvContent)
		require.NoError(t, err)

		e := echo.New()
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		userID := uuid.New()
		c.Set("userID", userID)

		err = handler.ImportApplications(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), `"total_records":3`)
		assert.Contains(t, rec.Body.String(), `"success_count":2`)
		assert.Contains(t, rec.Body.String(), `"failure_count":1`)
		assert.Contains(t, rec.Body.String(), `invalid date format in SentDate field`)

		mockStore.AssertExpectations(t)
	})

	t.Run("database error handling", func(t *testing.T) {
		mockStore := new(MockStore)

		mockStore.On("CreateOne", matchCreateOneParams("Software Engineer", "TechCorp")).Return(
			createMockApplication("", ""), errors.New("database connection failed"))

		service := NewService(mockStore)
		handler := NewHandler(service, mockStore)

		csvContent := `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com`

		req, err := createMultipartRequest(csvContent)
		require.NoError(t, err)

		e := echo.New()
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		userID := uuid.New()
		c.Set("userID", userID)

		err = handler.ImportApplications(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), `"total_records":1`)
		assert.Contains(t, rec.Body.String(), `"success_count":0`)
		assert.Contains(t, rec.Body.String(), `"failure_count":1`)
		assert.Contains(t, rec.Body.String(), `database connection failed`)

		mockStore.AssertExpectations(t)
	})
}

func TestHandler_ImportApplications_ErrorScenarios(t *testing.T) {
	t.Run("missing userID in context", func(t *testing.T) {
		mockStore := new(MockStore)
		service := NewService(mockStore)
		handler := NewHandler(service, mockStore)

		csvContent := `title,company,sent_date,location,status,notes,url
Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com`

		req, err := createMultipartRequest(csvContent)
		require.NoError(t, err)

		e := echo.New()
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		assert.Panics(t, func() {
			handler.ImportApplications(c)
		})
	})

	t.Run("large CSV file handling", func(t *testing.T) {
		mockStore := new(MockStore)

		mockStore.On("CreateOne", mock.AnythingOfType("db.CreateOneApplicationParams")).Return(
			db.Application{}, errors.New("database overloaded"))

		service := NewService(mockStore)
		handler := NewHandler(service, mockStore)

		var csvBuilder strings.Builder
		csvBuilder.WriteString("title,company,sent_date,location,status,notes,url\n")

		for i := 0; i < 10; i++ {
			csvBuilder.WriteString("Software Engineer,TechCorp,2024-01-15,San Francisco,sent,Great opportunity,https://example.com\n")
		}

		req, err := createMultipartRequest(csvBuilder.String())
		require.NoError(t, err)

		e := echo.New()
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		userID := uuid.New()
		c.Set("userID", userID)

		err = handler.ImportApplications(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), `"total_records":10`)
		assert.Contains(t, rec.Body.String(), `"success_count":0`)
		assert.Contains(t, rec.Body.String(), `"failure_count":10`)
		assert.Contains(t, rec.Body.String(), `database overloaded`)
	})
}

func createMultipartRequest(csvContent string) (*http.Request, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", "test.csv")
	if err != nil {
		return nil, err
	}

	_, err = io.WriteString(part, csvContent)
	if err != nil {
		return nil, err
	}

	err = writer.Close()
	if err != nil {
		return nil, err
	}

	req := httptest.NewRequest(http.MethodPost, "/application/import", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	return req, nil
}
