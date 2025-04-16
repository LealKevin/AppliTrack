#!/bin/sh

echo " Running DB migrations with Tern..."
tern migrate -c ./migrations/tern.conf -d ./migrations 

echo " Starting API server..."
./main

