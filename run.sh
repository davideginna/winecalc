#!/bin/bash

# WineCalc Development Server

echo "Starting WineCalc development server..."
echo ""
echo "Local access: http://localhost:8000"
echo ""

# Get local IP for mobile testing
IP=$(hostname -I | awk '{print $1}')
if [ -n "$IP" ]; then
    echo "Mobile testing: http://$IP:8000"
    echo ""
fi

echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

# Start Python server
python3 -m http.server 8000
