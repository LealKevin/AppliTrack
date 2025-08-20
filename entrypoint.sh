#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until pg_isready -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" > /dev/null 2>&1; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "Database is ready!"

if [ ! -d "migrations" ]; then
  echo "Error: migrations directory not found"
  exit 1
fi

echo "Running database migrations..."
cd migrations

if [ ! -f "tern.conf" ]; then
  echo "Error: tern.conf not found in migrations directory"
  exit 1
fi

tern migrate
if [ $? -ne 0 ]; then
  echo "Error: Database migration failed"
  exit 1
fi

cd ..

echo "Starting API server..."
exec ./main

