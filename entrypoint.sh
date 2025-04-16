#!/bin/sh

echo " Running DB migrations with Tern..."
tern migrate -c /app/tern.conf -d /app/migrations || exit 1

echo " Starting API server..."
./main

