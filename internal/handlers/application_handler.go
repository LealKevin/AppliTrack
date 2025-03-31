package handlers

import (
	client "ApplyTrack/internal/db"
	db "ApplyTrack/internal/db/queries"
	hash "ApplyTrack/internal/utils"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/jackc/pgx/v5/pgtype"
)

func GetHomePage(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello from go chi"))
}

func GetAllApplications(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	statusParam := r.URL.Query().Get("status")

	queries := db.New(client.Conn)

	var status pgtype.Text
	status.String = statusParam
	status.Valid = true

	var applications []db.Application
	var err error

	if statusParam == "all" {
		applications, err = queries.GetAllApplications(ctx)
	} else {
		applications, err = queries.GetApplicationsByStatus(ctx, status)
	}
	if err != nil {
		log.Println("Error getting applications", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(applications)

}

func GetOneApplicationByID(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	idInt, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	id := int32(idInt)

	queries := db.New(client.Conn)
	application, err := queries.GetOneApplicationByID(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(application)
}

func DeleteOneApplicationByID(w http.ResponseWriter, r *http.Request) {
	fmt.Println("DeleteOneApplicationByID")
	ctx := context.Background()

	idInt, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	id := int32(idInt)

	queries := db.New(client.Conn)
	deleted, err := queries.DeleteOneApplicationByID(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deleted)
}

func CreateOneApplication(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var data db.CreateOneApplicationParams

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		log.Println("Error decoding json", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	queries := db.New(client.Conn)
	application, err := queries.CreateOneApplication(ctx, data)
	if err != nil {
		log.Println("Error creating application", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(application)
}

type CreateUserRequest struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	PasswordRepeat string `json:"passwordRepeat"`
}

func CreateUser(w http.ResponseWriter, r *http.Request) {

	ctx := context.Background()

	var req CreateUserRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Password != req.PasswordRepeat {
		log.Print("Password do not match in account creation")
		http.Error(w, "Passwords do not match", http.StatusBadRequest)
		return
	}

	hashedPassword, err := hash.HashPassword(req.Password)
	if err != nil {
		log.Printf("Failed to hash password, error: %v", err)
		http.Error(w, "Passwords do not match", http.StatusBadRequest)
		http.Error(w, "Failed to hash password", http.StatusBadRequest)
		return
	}

	userParams := db.CreateUserParams{
		Email:    req.Email,
		Name:     req.Name,
		Password: hashedPassword,
	}

	queries := db.New(client.Conn)
	user, err := queries.CreateUser(ctx, userParams)
	if err != nil {
		log.Printf("Failed to create user, error: %v", err)
		http.Error(w, "Failed to create user", http.StatusBadRequest)
		return
	}

	token, err := hash.CreateToken(int(user.ID))

	http.SetCookie(w, &http.Cookie{
		Name:     "jwt",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   60 * 60 * 24,
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	queries := db.New(client.Conn)

	users, err := queries.GetAllUsers(ctx)
	if err != nil {
		http.Error(w, "Unable to get all users", http.StatusBadRequest)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)
	if userID == 0 {
		http.Error(w, "Invalid user", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	query := db.New(client.Conn)
	user, err := query.GetOneUserByID(ctx, int32(userID))
	if err != nil {
		http.Error(w, "Unable to get user", http.StatusBadRequest)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)

}

func Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "jwt",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Logged out"))
}

type UserConnection struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	var userParams UserConnection

	err := json.NewDecoder(r.Body).Decode(&userParams)
	if err != nil {
		http.Error(w, "Unable to get user ", http.StatusBadRequest)
	}

	query := db.New(client.Conn)
	user, err := query.GetOneUserByEmail(ctx, userParams.Email)
	if err != nil {
		http.Error(w, "Email or Password invalid", http.StatusUnauthorized)
	}

	err = hash.ComparePassword(userParams.Password, user.Password)
	if err != nil {
		http.Error(w, "Email or Password invalid", http.StatusUnauthorized)
	}

	token, err := hash.CreateToken(int(user.ID))
	if err != nil {
		http.Error(w, "Email or Password invalid", http.StatusUnauthorized)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "jwt",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   60 * 60 * 24,
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
