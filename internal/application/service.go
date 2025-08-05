package application

import (
	"bytes"
	"encoding/csv"
	"net/http"
	"strconv"

	db "ApplyTrack/internal/db/queries"
	"ApplyTrack/internal/utils"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type ApplicationServiceInterface interface {
	CreateApplication(uuid.UUID, db.CreateOneApplicationParams) (db.Application, error)
	ImportApplicationsFromCSV(uuid.UUID, []byte) (ImportResult, error)
}

type ApplicationService struct {
	Store Store
}

func NewService(store Store) *ApplicationService {
	return &ApplicationService{Store: store}
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
			Status:           record[4],
			Notes:            record[5],
			UrlApplication:   record[6],
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
