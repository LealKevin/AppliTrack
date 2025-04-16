#!/bin/sh

cd /app

echo " Running DB migrations with Tern..."
tern migrate -c app/migrations/tern.conf -d app/migrations 

echo " Starting API server..."
./main

