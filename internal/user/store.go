package user

import (
	"context"
	"time"

	db "ApplyTrack/internal/db/queries"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateUserParams struct {
	Name     string
	Email    string
	Password string
}

type Store interface {
	GetAll() ([]User, error)
	GetOneByID(userID uuid.UUID) (User, error)
	GetOneByEmail(email string) (User, error)
	CreateOne(params CreateUserParams) (User, error)
}

type PostgresUserStore struct {
	db *db.Queries
}

func NewUserStorage(q *db.Queries) *PostgresUserStore {
	return &PostgresUserStore{db: q}
}

func (s *PostgresUserStore) GetAll() ([]User, error) {
	ctx := context.Background()

	dbUsers, err := s.db.GetAllUsers(ctx)
	if err != nil {
		return nil, err
	}

	users := make([]User, len(dbUsers))
	for i, dbUser := range dbUsers {
		users[i] = mapFromDBUser(dbUser)
	}

	return users, nil
}

func (s *PostgresUserStore) GetOneByID(userID uuid.UUID) (User, error) {
	ctx := context.Background()

	dbUser, err := s.db.GetOneUserByID(ctx, userID)
	if err != nil {
		return User{}, err
	}

	return mapFromDBUser(dbUser), nil
}

func (s *PostgresUserStore) GetOneByEmail(email string) (User, error) {
	ctx := context.Background()

	dbUser, err := s.db.GetOneUserByEmail(ctx, email)
	if err != nil {
		return User{}, err
	}

	return mapFromDBUser(dbUser), nil
}

func (s *PostgresUserStore) CreateOne(params CreateUserParams) (User, error) {
	ctx := context.Background()

	dbParams := db.CreateUserParams{
		Name:     params.Name,
		Email:    params.Email,
		Password: params.Password,
	}

	dbUser, err := s.db.CreateUser(ctx, dbParams)
	if err != nil {
		return User{}, err
	}

	return mapFromDBUser(dbUser), nil
}

func mapFromDBUser(dbUser db.User) User {
	return User{
		ID:        dbUser.ID,
		Name:      dbUser.Name,
		Email:     dbUser.Email,
		Password:  dbUser.Password,
		CreatedAt: dbUser.CreatedAt.Time,
		UpdatedAt: dbUser.UpdatedAt.Time,
	}
}

