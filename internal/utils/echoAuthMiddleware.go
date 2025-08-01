package utils

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func EchoAuthMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cookie, err := c.Cookie("jwt")
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
			}

			claims, err := VerifyToken(cookie.Value)
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
			}

			userID, err := uuid.Parse(claims.UserId)
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid user ID")
			}

			c.Set("userID", userID)
			return next(c)
		}
	}
}