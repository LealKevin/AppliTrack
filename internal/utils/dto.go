package utils

import "github.com/jackc/pgx/v5/pgtype"

func PgtypeTextFromPointer(s *string) pgtype.Text {
	if s == nil {
		return pgtype.Text{Valid: false}
	}
	return pgtype.Text{
		String: *s,
		Valid:  true,
	}
}

func PgtypeTextToPointer(t pgtype.Text) *string {
	if !t.Valid {
		return nil
	}
	return &t.String
}
