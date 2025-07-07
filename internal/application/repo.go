package application

import "github.com/labstack/echo/v4"

type Store interface{}

func GetAllApplications(c echo.Context) {
	userID := r.Context().Value("userID").(int)
	ctx := context.Background()

	statusParam := r.URL.Query().Get("status")

	queries := db.New(client.Conn)

	var status pgtype.Text
	status.String = statusParam
	status.Valid = true

	var applications []db.Application
	var err error

	user, err := queries.GetOneUserByID(ctx, int32(userID))
	if err != nil {
		http.Error(w, "Unable to get user", http.StatusBadRequest)
	}

	if statusParam == "all" {
		applications, err = queries.GetAllApplications(ctx, user.ID)
	} else {
		args := db.GetApplicationsByStatusParams{
			Status: status,
			UserID: user.ID,
		}

		applications, err = queries.GetApplicationsByStatus(ctx, args)
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
