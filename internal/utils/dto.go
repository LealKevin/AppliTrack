package utils

import (
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/google/uuid"
)

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

func PgtypeUUIDToUUID(p pgtype.UUID) uuid.UUID {
	if !p.Valid {
		return uuid.Nil
	}
	return p.Bytes
}
