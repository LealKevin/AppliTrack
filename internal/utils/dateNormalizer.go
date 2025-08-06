package utils

import (
	"errors"
	"strings"
	"time"
)

var dateLayouts = []string{
	"02/01/2006", "02-01-2006", "02.01.2006",
	"01/02/2006", "01-02-2006", "01.02.2006",
	"2006/01/02", "2006-01-02", "2006.01.02",
}

func NormalizeDate(input string) (time.Time, error) {
	input = strings.TrimSpace(input)
	for _, layout := range dateLayouts {
		if t, err := time.Parse(layout, input); err == nil {
			return t, nil
		}
	}
	return time.Time{}, errors.New("unrecognized date format: " + input)
}
