#!/bin/sh

echo " Running DB migrations with Tern..."
tern migrate 

echo " Starting API server..."
./main

