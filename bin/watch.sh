#!/bin/bash

echo "Watching TypeScript frontend for changes..."
tsc -p client/tsconfig.json --watch > log/tsc.log 2>&1 &
echo "TypeScript compiler started in background. Check log/tsc.log for output."