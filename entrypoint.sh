#!/bin/sh

cd migrations

echo " Running DB migrations with Tern..."
tern migrate 

cd ..

echo " Starting API server..."
./main

