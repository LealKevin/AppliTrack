#!/bin/sh

echo " Running DB migrations with Tern..."
tern migrate || exit 1

echo " Starting API server..."
./main

