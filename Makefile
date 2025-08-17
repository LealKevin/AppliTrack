.PHONY: help migrate migrate-down migrate-status sqlc db-up db-reset dev build test clean

help:
	@echo "Available targets:"
	@echo "  migrate        - Run database migrations"
	@echo "  migrate-down   - Rollback last migration"
	@echo "  migrate-status - Show migration status"
	@echo "  sqlc           - Generate sqlc code"
	@echo "  db-up          - Run migrations + generate code (common workflow)"
	@echo "  db-reset       - Reset database and regenerate code"
	@echo "  dev            - Start development server (with db-up)"
	@echo "  build          - Build the API binary"
	@echo "  test           - Run tests"
	@echo "  clean          - Clean build artifacts"

# Database migrations
migrate:
	@echo "Running database migrations..."
	cd migrations && tern migrate
	@echo "Migrations completed"

migrate-down:
	@echo "Rolling back last migration..."
	cd migrations && tern migrate --destination=-1
	@echo "Rollback completed"

migrate-status:
	@echo "Migration status:"
	cd migrations && tern status

# Code generation
sqlc:
	@echo "Generating sqlc code..."
	cd internal/db/queries && sqlc generate
	@echo "Code generation completed"

# Combined workflows
db-up: migrate sqlc
	@echo "Database is ready (migrated + code generated)"

db-reset: migrate-down migrate sqlc
	@echo "Database reset and code regenerated"

# Development
dev:
	@echo "Starting development server..."
	go run cmd/api/main.go

# Build
build:
	@echo "Building API binary..."
	go build -o tmp/main cmd/api/main.go
	@echo "Build completed: tmp/main"

# Testing
test:
	@echo "Running tests..."
	go test -v ./...


docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d
	@echo "Docker containers are running"

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down
	@echo "Docker containers stopped"

dev-docker: docker-down docker-up dev
	@echo "Development environment started with Docker"

# Cleanup
clean:
	@echo "Cleaning build artifacts..."
	rm -f tmp/main
	@echo "Clean completed"

