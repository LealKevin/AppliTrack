package utils

import (
	"net/http"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
)

type AuthRateLimiter struct {
	attempts map[string][]time.Time
	mutex    sync.RWMutex
	limit    int
	window   time.Duration
}

func NewAuthRateLimiter(limit int, window time.Duration) *AuthRateLimiter {
	limiter := &AuthRateLimiter{
		attempts: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
	}

	go limiter.cleanup()
	return limiter
}

func (rl *AuthRateLimiter) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mutex.Lock()
		now := time.Now()
		windowStart := now.Add(-rl.window)

		for ip, attempts := range rl.attempts {
			validAttempts := make([]time.Time, 0, len(attempts))
			for _, attempt := range attempts {
				if attempt.After(windowStart) {
					validAttempts = append(validAttempts, attempt)
				}
			}

			if len(validAttempts) == 0 {
				delete(rl.attempts, ip)
			} else {
				rl.attempts[ip] = validAttempts
			}
		}
		rl.mutex.Unlock()
	}
}

func (rl *AuthRateLimiter) isAllowed(ip string) bool {
	rl.mutex.Lock()
	defer rl.mutex.Unlock()

	now := time.Now()
	windowStart := now.Add(-rl.window)

	attempts := rl.attempts[ip]
	validAttempts := make([]time.Time, 0, len(attempts))
	for _, attempt := range attempts {
		if attempt.After(windowStart) {
			validAttempts = append(validAttempts, attempt)
		}
	}

	if len(validAttempts) >= rl.limit {
		rl.attempts[ip] = validAttempts
		return false
	}

	rl.attempts[ip] = append(validAttempts, now)
	return true
}

func AuthRateLimitMiddleware(limit int, window time.Duration) echo.MiddlewareFunc {
	limiter := NewAuthRateLimiter(limit, window)

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			ip := c.RealIP()
			if !limiter.isAllowed(ip) {
				return echo.NewHTTPError(http.StatusTooManyRequests, "Too many authentication attempts. Please try again later.")
			}
			return next(c)
		}
	}
}
