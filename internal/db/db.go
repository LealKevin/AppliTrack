package db

import (
	"context"
	"fmt"
	"net/url"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var Conn *pgxpool.Pool

type Database struct {
	Conn *pgxpool.Pool
}

func NewDatabase() (*Database, error) {
	var err error
	// Load .env if present (for local dev), but do not fail if missing
	_ = godotenv.Load(".env")

	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		return &Database{}, fmt.Errorf("DATABASE_URL is not set")
	}

	// Add SSL mode to the URL if not already present
	parsedURL, err := url.Parse(dsn)
	if err != nil {
		return &Database{}, fmt.Errorf("unable to parse DATABASE_URL: %w", err)
	}

	query := parsedURL.Query()
	if query.Get("sslmode") == "" {
		sslMode := os.Getenv("SSL_MODE")
		if sslMode == "" {
			// Default based on environment
			goEnv := os.Getenv("GO_ENV")
			if goEnv == "development" {
				sslMode = "disable"
			} else {
				sslMode = "require" // secure default for production
			}
		}
		query.Set("sslmode", sslMode)
		parsedURL.RawQuery = query.Encode()
		dsn = parsedURL.String()
	}

	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return &Database{}, fmt.Errorf("unable to parse DATABASE_URL: %w", err)
	}

	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnIdleTime = time.Minute * 30
	config.MaxConnLifetime = time.Hour
	config.ConnConfig.ConnectTimeout = time.Second * 30

	Conn, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return &Database{}, fmt.Errorf("unable to connect to database: %w", err)
	}

	if err = Conn.Ping(context.Background()); err != nil {
		return &Database{}, fmt.Errorf("unable to ping database: %w", err)
	}

	fmt.Println("Successful connection to database")
	return &Database{Conn: Conn}, nil
}

func (db *Database) GetConnection() *pgxpool.Pool {
	if db.Conn == nil {
		fmt.Println("Database connection is not initialized")
		return nil
	}
	return db.Conn
}

func (db *Database) Close() {
	if db.Conn != nil {
		db.Conn.Close()
		fmt.Println("Closed connection to database")
	}
}
