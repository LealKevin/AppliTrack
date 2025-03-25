package db

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var Conn *pgxpool.Pool

func InitDB() {

	if err := godotenv.Load(".env"); err != nil {
		fmt.Print("Unable to find .env")
		return
	}

	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		fmt.Print("Unable to find dsn")
		return
	}

	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		fmt.Printf("Unable to parse DATABASE_URL")
		return
	}

	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnIdleTime = time.Hour
	config.MaxConnLifetime.Minutes()

	Conn, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		fmt.Printf("Unable to connect to DB, error: %v", err)
		return
	}

	if err := Conn.Ping(context.Background()); err != nil {
		fmt.Printf("Unable to Ping, error: %v", err)
	}

	fmt.Println("Sucessfull connection to database")
}

func CloseDB() {
	if Conn != nil {
		Conn.Close()
		fmt.Println("Closed connection to database")
	}

}
