package application

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"

	db "ApplyTrack/internal/db/queries"
	"ApplyTrack/internal/utils"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type ApplicationServiceInterface interface {
	GetAllApplications(uuid.UUID) ([]InterviewApplicationResp, error)
	CreateApplication(uuid.UUID, db.CreateOneApplicationParams) (db.Application, error)
	ImportApplicationsFromCSV(uuid.UUID, []byte) (ImportResult, error)
	GetApplicationByID(uuid.UUID, uuid.UUID) (db.Application, error)
	GetApplicationRounds(uuid.UUID, uuid.UUID) (InterviewApplicationResp, error)
	CreateRound(uuid.UUID, uuid.UUID, RoundRequest) (RoundResp, error)
	UpdateRound(uuid.UUID, RoundRequest) (RoundResp, error)
	DeleteRound(uuid.UUID, uuid.UUID) error
	GetInterviewApplications(uuid.UUID) ([]InterviewApplicationResp, error)
}

type ApplicationService struct {
	Store Store
}

func NewService(store Store) *ApplicationService {
	return &ApplicationService{Store: store}
}

func (s *ApplicationService) GetAllApplications(userID uuid.UUID, status string) ([]InterviewApplicationResp, error) {
	var applications []db.Application
	var err error

	if status != "" && status != "all" {
		applications, err = s.Store.GetApplicationsByStatus(userID, status)
	} else {
		applications, err = s.Store.GetAll(userID)
	}
	if err != nil {
		return nil, fmt.Errorf("could not get applications: %w", err)
	}

	resp := make([]InterviewApplicationResp, 0, len(applications))
	for _, app := range applications {
		rounds, err := s.Store.GetRounds(app.ID)
		if err != nil {
			return nil, fmt.Errorf("could not get rounds for application %s: %w", app.ID, err)
		}
		applicationResp := mapperToApplicationResp(app)
		roundsResp := mapperToRoundsResp(rounds)
		resp = append(resp, InterviewApplicationResp{Application: applicationResp, Rounds: roundsResp})
	}
	return resp, nil
}

func (s *ApplicationService) GetApplicationByID(userID, appID uuid.UUID) (ApplicationResp, error) {
	application, err := s.Store.GetOne(userID, appID)
	if err != nil {
		return ApplicationResp{}, err
	}
	return ApplicationResp{
		ID:               application.ID,
		TitleApplication: application.TitleApplication,
		Company:          application.Company,
		Location:         application.Location,
		SentDate:         application.SentDate,
		Status:           application.Status.String,
		Notes:            application.Notes.String,
		UrlApplication:   application.UrlApplication.String,
		CreatedAt:        application.CreatedAt,
		UpdatedAt:        application.UpdatedAt,
	}, nil
}

func (s *ApplicationService) GetApplicationRounds(userID, appID uuid.UUID) (InterviewApplicationResp, error) {
	application, err := s.Store.GetOne(userID, appID)
	if err != nil {
		return InterviewApplicationResp{}, err
	}
	rounds, err := s.Store.GetRounds(appID)
	if err != nil {
		return InterviewApplicationResp{}, err
	}

	applicationResp := mapperToApplicationResp(application)
	roundsReps := mapperToRoundsResp(rounds)

	return InterviewApplicationResp{Application: applicationResp, Rounds: roundsReps}, nil
}

type ImportResult struct {
	TotalRecords int      `json:"total_records"`
	SuccessCount int      `json:"success_count"`
	FailureCount int      `json:"failure_count"`
	Failures     []string `json:"failures"`
}

func (s *ApplicationService) ImportApplicationsFromCSV(userID uuid.UUID, csvData []byte) (ImportResult, error) {
	reader := csv.NewReader(bytes.NewReader(csvData))
	records, err := reader.ReadAll()
	if err != nil {
		return ImportResult{}, echo.NewHTTPError(http.StatusBadRequest, "could not read CSV file: "+err.Error())
	}

	if len(records) < 1 {
		return ImportResult{}, echo.NewHTTPError(http.StatusBadRequest, "CSV file is empty or invalid")
	}

	var importResult ImportResult

	for i, record := range records[1:] {
		lineNumber := strconv.Itoa(i + 2)
		if len(record) < 7 {
			importResult.FailureCount++
			importResult.Failures = append(importResult.Failures, "Row "+lineNumber+" is missing required fields")
			continue
		}

		sentDate, err := utils.NormalizeDate(record[2])
		if err != nil {
			importResult.FailureCount++
			importResult.Failures = append(importResult.Failures, "Row "+lineNumber+": invalid date format in SentDate field")
			continue
		}

		storeRequest := db.CreateOneApplicationParams{
			UserID:           userID,
			TitleApplication: record[0],
			Company:          record[1],
			SentDate:         sentDate,
			Location:         record[3],
			Status:           utils.PgtypeTextFromPointer(&record[4]),
			Notes:            utils.PgtypeTextFromPointer(&record[5]),
			UrlApplication:   utils.PgtypeTextFromPointer(&record[6]),
		}

		_, err = s.Store.CreateOne(storeRequest)
		if err != nil {
			importResult.FailureCount++
			if IsDuplicateError(err) {
				importResult.Failures = append(importResult.Failures, "Row "+lineNumber+": duplicate application")
			} else {
				importResult.Failures = append(importResult.Failures, "Row "+lineNumber+": "+err.Error())
			}
			continue
		}
		importResult.SuccessCount++
	}
	importResult.TotalRecords = len(records) - 1
	return importResult, nil
}

func (s ApplicationService) CreateRound(userID, applicationID uuid.UUID, roundRequest RoundRequest) (RoundResp, error) {
	if err := CheckApplicationExists(s.Store, userID, applicationID); err != nil {
		return RoundResp{}, fmt.Errorf("application does not exist for user: %w", err)
	}

	roundParams := db.CreateRoundParams{
		ApplicationID: applicationID,
		Title:         roundRequest.Title,
		Type:          roundRequest.Type,
		Status:        roundRequest.Status,
		Date:          roundRequest.Date,
		Notes:         utils.PgtypeTextFromPointer(roundRequest.Notes),
		Interviewer:   utils.PgtypeTextFromPointer(roundRequest.Interviewer),
		Duration:      utils.PgtypeTextFromPointer(roundRequest.Duration),
		Outcome:       utils.PgtypeTextFromPointer(roundRequest.Outcome),
	}

	round, err := s.Store.CreateRound(roundParams)
	if err != nil {
		return RoundResp{}, fmt.Errorf("could not create round: %w", err)
	}
	return mapperToRoundResp(round), nil
}

func (s *ApplicationService) UpdateRound(userID uuid.UUID, roundRequest UpdateRoundRequest) (RoundResp, error) {
	if err := CheckApplicationExists(s.Store, userID, roundRequest.ApplicationID); err != nil {
		return RoundResp{}, fmt.Errorf("application does not exist for user: %w", err)
	}

	roundParams := db.UpdateRoundParams{
		Title:       roundRequest.Title,
		Type:        roundRequest.Type,
		Status:      roundRequest.Status,
		Date:        roundRequest.Date,
		Notes:       utils.PgtypeTextFromPointer(roundRequest.Notes),
		Interviewer: utils.PgtypeTextFromPointer(roundRequest.Interviewer),
		Duration:    utils.PgtypeTextFromPointer(roundRequest.Duration),
		Outcome:     utils.PgtypeTextFromPointer(roundRequest.Outcome),
		ID:          roundRequest.ID,
	}

	round, err := s.Store.UpdateRound(roundParams)
	if err != nil {
		return RoundResp{}, fmt.Errorf("could not update round: %w", err)
	}
	return mapperToRoundResp(round), nil
}

func (s *ApplicationService) DeleteRound(userID uuid.UUID, roundID uuid.UUID) error {
	round, err := s.Store.GetRoundByID(roundID)
	if err != nil {
		return fmt.Errorf("could not find round with ID %s: %w", roundID, err)
	}

	if err := CheckApplicationExists(s.Store, userID, round.ApplicationID); err != nil {
		return fmt.Errorf("application does not exist for user: %w", err)
	}

	if err := s.Store.DeleteRound(roundID); err != nil {
		return fmt.Errorf("could not delete round with ID %s: %w", roundID, err)
	}
	return nil
}

func (s *ApplicationService) GetInterviewApplications(userID uuid.UUID) ([]InterviewApplicationResp, error) {
	applications, err := s.Store.GetInterviewApplications(userID)
	if err != nil {
		return nil, fmt.Errorf("could not get interview applications: %w", err)
	}

	resp := make([]InterviewApplicationResp, 0)
	for _, app := range applications {
		// Get rounds for this application
		rounds, err := s.Store.GetRounds(app.ID)
		if err != nil {
			return nil, fmt.Errorf("could not get rounds for application %s: %w", app.ID, err)
		}

		applicationResp := mapperToApplicationResp(app)
		roundsResp := mapperToRoundsResp(rounds)

		resp = append(resp, InterviewApplicationResp{
			Application: applicationResp,
			Rounds:      roundsResp,
		})
	}
	return resp, nil
}

func mapperToApplicationResp(app db.Application) ApplicationResp {
	return ApplicationResp{
		ID:               app.ID,
		TitleApplication: app.TitleApplication,
		Company:          app.Company,
		Location:         app.Location,
		SentDate:         app.SentDate,
		Status:           app.Status.String,
		Notes:            app.Notes.String,
		UrlApplication:   app.UrlApplication.String,
		CreatedAt:        app.CreatedAt,
		UpdatedAt:        app.UpdatedAt,
	}
}

func mapperToRoundsResp(rounds []db.Round) []RoundResp {
	var roundsResp []RoundResp
	for _, round := range rounds {
		roundsResp = append(roundsResp, mapperToRoundResp(round))
	}
	return roundsResp
}

func mapperToRoundResp(round db.Round) RoundResp {
	notesPtr := utils.PgtypeTextToPointer(round.Notes)
	interviewerPtr := utils.PgtypeTextToPointer(round.Interviewer)
	durationPtr := utils.PgtypeTextToPointer(round.Duration)
	outcomePtr := utils.PgtypeTextToPointer(round.Outcome)

	notes := ""
	if notesPtr != nil {
		notes = *notesPtr
	}

	interviewer := ""
	if interviewerPtr != nil {
		interviewer = *interviewerPtr
	}

	duration := ""
	if durationPtr != nil {
		duration = *durationPtr
	}

	outcome := ""
	if outcomePtr != nil {
		outcome = *outcomePtr
	}

	return RoundResp{
		ID:            round.ID,
		ApplicationID: round.ApplicationID,
		Title:         round.Title,
		Type:          round.Type,
		Status:        round.Status,
		Date:          round.Date,
		Notes:         notes,
		Interviewer:   interviewer,
		Duration:      duration,
		Outcome:       outcome,
		Created_at:    round.CreatedAt,
		Updated_at:    round.UpdatedAt,
	}
}

func CheckApplicationExists(store Store, userID, appID uuid.UUID) error {
	_, err := store.GetOne(userID, appID)
	if err != nil {
		return fmt.Errorf("application with ID %s not found for user %s: %w", appID, userID, err)
	}
	return nil
}
