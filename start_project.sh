#!/bin/bash

# Function to kill processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

echo "🚀 Starting LMS Project..."

# Start Backend
echo "📦 Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 5

# Start Frontend
echo "💻 Starting Frontend Server..."
cd ../frontend
python3 -m http.server 8000 &
FRONTEND_PID=$!

echo "✅ Project is running!"
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:8000"
echo "   Press Ctrl+C to stop both servers"

# Keep script running
wait
