#!/bin/bash

echo "Starting development server..."
node server.ts > log/server.log 2>&1 &
echo "Server started in background. Check log/server.log for output."