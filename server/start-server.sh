#!/bin/bash

# Kill any existing server processes
lsof -ti:5000 | xargs kill -9 2>/dev/null
lsof -ti:5001 | xargs kill -9 2>/dev/null

# Start the server on port 5001
cd "$(dirname "$0")"
PORT=5001 npm run dev

