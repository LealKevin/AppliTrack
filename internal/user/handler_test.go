package user

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	db "ApplyTrack/internal/db/queries"
	"ApplyTrack/internal/utils"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jackc/tern/v2/migrate"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

func Test_Register(t *testing.T) {
	t.Log("Running Test_Register")
	ctx := context.Background()

	pgcontainer, err := postgres.Run(ctx,
		"postgres:15-alpine",
		postgres.WithDatabase("testdb"),
		postgres.WithUsername("testuser"),
		postgres.WithPassword("testpass"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).
				WithStartupTimeout(60*time.Second),
		))
	if err != nil {
		t.Fatalf("Failed to start PostgreSQL container: %v", err)
	}

	t.Cleanup(func() {
		if err := pgcontainer.Terminate(ctx); err != nil {
			t.Fatalf("Failed to terminate PostgreSQL container: %v", err)
		}
	})

	connStr, err := pgcontainer.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		t.Fatalf("Failed to get connection string: %v", err)
	}

	migrateConn, err := pgx.Connect(ctx, connStr)
	if err != nil {
		t.Fatalf("Failed to connect to PostgreSQL for migration: %v", err)
	}
	defer migrateConn.Close(ctx)

	migrationDir := "./../../migrations"

	migrator, err := migrate.NewMigrator(ctx, migrateConn, "schema_version")
	require.NoError(t, err)
	if err := migrator.LoadMigrations(os.DirFS(migrationDir)); err != nil {
		t.Fatalf("Failed to load migrations: %v", err)
	}
	if err := migrator.Migrate(ctx); err != nil {
		t.Fatalf("Failed to apply migrations: %v", err)
	}

	dbPool, err := pgxpool.New(ctx, connStr)
	assert.NoError(t, err)
	defer dbPool.Close()

	require.Eventually(t, func() bool {
		return dbPool.Ping(ctx) == nil
	}, 5*time.Second, 500*time.Millisecond, "Database connection should be established")

	queries := db.New(dbPool)

	userStore := NewUserStorage(queries)
	userService := NewService(userStore)
	handler := NewHandler(userService)

	t.Run("Happy path", func(t *testing.T) {
		user := &RegisterRequest{
			Email:                 "foo@bar.com",
			Password:              "password123",
			PasswordRepeat:        "password123",
			AcceptedPrivacyPolicy: true,
			AcceptedTerms:         true,
		}

		userJson, err := json.Marshal(user)
		require.NoError(t, err)

		req, err := http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(userJson))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()

		e := echo.New()
		e.Validator = &utils.CustomValidator{Validator: validator.New()}
		c := e.NewContext(req, rec)

		err = handler.Register(c)
		t.Logf("Handler error: %v \n", err)
		t.Logf("Response code: %d \n", rec.Code)
		t.Logf("Response body: %s \n", rec.Body.String())

		if err != nil {
			if he, ok := err.(*echo.HTTPError); ok {
				t.Logf("HTTP Error - Code: %d, Message: %v", he.Code, he.Message)
			}
		}

		assert.NoError(t, err)
		assert.Equal(t, http.StatusCreated, rec.Code)
	})
}
