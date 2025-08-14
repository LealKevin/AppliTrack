package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var Conn *pgxpool.Pool

func InitDB() {
	var err error
	if err := godotenv.Load("./../../.env"); err != nil {
		log.Fatal("Unable to find .env")
	}

	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		log.Fatal("Unable to find dsn")
	}

	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Fatal("Unable to parse DATABASE_URL")
	}

	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnIdleTime = time.Hour
	config.MaxConnLifetime.Minutes()

	Conn, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to connect to DB, error: %v", err)
	}

	if err = Conn.Ping(context.Background()); err != nil {
		log.Fatalf("Unable to Ping, error: %v", err)
	}

	fmt.Println("Sucessfull connection to database")
}

func CloseDB() {
	if Conn != nil {
		Conn.Close()
		fmt.Println("Closed connection to database")
	}
}
