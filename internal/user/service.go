package user

import (
	"errors"
	"fmt"
	"strings"

	hash "ApplyTrack/internal/utils"

	"github.com/google/uuid"
)

// Define specific error types for user operations
var (
	ErrDuplicateEmail = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid email or password")
)

// isDuplicateEmailError checks if the error is related to duplicate email constraint
func isDuplicateEmailError(err error) bool {
	errorMsg := strings.ToLower(err.Error())
	// Check for PostgreSQL unique constraint violation patterns
	return strings.Contains(errorMsg, "duplicate") ||
		   strings.Contains(errorMsg, "unique") ||
		   strings.Contains(errorMsg, "already exists") ||
		   strings.Contains(errorMsg, "violates unique constraint")
}

type LoginRequest struct {
	Email    string
	Password string
}

type AuthResponse struct {
	User  User
	Token string
}

type UserService struct {
	Store Store
}

func NewService(store Store) *UserService {
	return &UserService{
		Store: store,
	}
}

func (s *UserService) Register(req RegisterRequest) (AuthResponse, error) {
	if req.Email == "" || req.Password == "" {
		return AuthResponse{}, errors.New("missing required fields")
	}

	if req.Password != req.PasswordRepeat {
		return AuthResponse{}, errors.New("passwords do not match")
	}

	hashedPassword, err := hash.HashPassword(req.Password)
	if err != nil {
		return AuthResponse{}, errors.New("failed to hash password")
	}

	params := CreateUserParams{
		Email:    req.Email,
		Password: hashedPassword,
	}

	user, err := s.Store.CreateOne(params)
	if err != nil {
		if isDuplicateEmailError(err) {
			return AuthResponse{}, ErrDuplicateEmail
		}
		return AuthResponse{}, fmt.Errorf("failed to create user: %w", err)
	}

	token, err := hash.CreateToken(user.ID.String())
	if err != nil {
		return AuthResponse{}, errors.New("failed to create token")
	}

	return AuthResponse{
		User:  user,
		Token: token,
	}, nil
}

func (s *UserService) Login(req LoginRequest) (AuthResponse, error) {
	user, err := s.Store.GetOneByEmail(req.Email)
	if err != nil {
		return AuthResponse{}, ErrInvalidCredentials
	}

	err = hash.ComparePassword(req.Password, user.Password)
	if err != nil {
		return AuthResponse{}, ErrInvalidCredentials
	}

	token, err := hash.CreateToken(user.ID.String())
	if err != nil {
		return AuthResponse{}, errors.New("failed to create token")
	}

	return AuthResponse{
		User:  user,
		Token: token,
	}, nil
}

func (s *UserService) GetUserByID(userID uuid.UUID) (User, error) {
	return s.Store.GetOneByID(userID)
}

func (s *UserService) GetAllUsers() ([]User, error) {
	return s.Store.GetAll()
}

func (s *UserService) DeleteUser(userID uuid.UUID) error {
	return s.Store.DeleteByID(userID)
}
