package application

import "errors"

var (
	ErrDuplicateApplication = errors.New("application with same title, company, and date already exists")
	ErrApplicationNotFound  = errors.New("application not found")
)

func IsDuplicateError(err error) bool {
	return errors.Is(err, ErrDuplicateApplication)
}
