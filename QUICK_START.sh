#!/bin/bash

echo "🚀 Starting RideShare Servers..."
echo ""

# Check if backend is already running
if lsof -ti:5001 > /dev/null 2>&1; then
    echo "⚠️  Backend is already running on port 5001"
    echo "   Kill it first: lsof -ti:5001 | xargs kill"
    echo ""
else
    echo "✅ Port 5001 is free"
fi

# Check if frontend is already running
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "⚠️  Frontend is already running on port 3001"
    echo "   Kill it first: lsof -ti:3001 | xargs kill"
    echo ""
else
    echo "✅ Port 3001 is free"
fi

echo "📋 To start servers, run these commands in separate terminals:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd server"
echo "  PORT=5001 npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd \"/Users/macbookpro/Desktop/RideShare MJP2\""
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3001"
echo ""

