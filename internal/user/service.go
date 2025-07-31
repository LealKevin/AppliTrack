package user

import (
	"errors"

	hash "ApplyTrack/internal/utils"
)

type RegisterRequest struct {
	Name           string
	Email          string
	Password       string
	PasswordRepeat string
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
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
	}

	user, err := s.Store.CreateOne(params)
	if err != nil {
		return AuthResponse{}, errors.New("failed to create user")
	}

	token, err := hash.CreateToken(int(user.ID))
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
		return AuthResponse{}, errors.New("invalid email or password")
	}

	err = hash.ComparePassword(req.Password, user.Password)
	if err != nil {
		return AuthResponse{}, errors.New("invalid email or password")
	}

	token, err := hash.CreateToken(int(user.ID))
	if err != nil {
		return AuthResponse{}, errors.New("failed to create token")
	}

	return AuthResponse{
		User:  user,
		Token: token,
	}, nil
}

func (s *UserService) GetUserByID(userID int32) (User, error) {
	return s.Store.GetOneByID(userID)
}

func (s *UserService) GetAllUsers() ([]User, error) {
	return s.Store.GetAll()
}