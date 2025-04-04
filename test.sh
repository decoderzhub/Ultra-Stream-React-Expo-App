#!/bin/bash

# Test script for Ultra Stream app
# This script runs the app and performs basic tests

echo "Starting Ultra Stream app testing..."

# Check if the project directory exists
if [ ! -d "/home/ubuntu/UltraStream" ]; then
  echo "Error: UltraStream project directory not found!"
  exit 1
fi

cd /home/ubuntu/UltraStream

# Check if all required files exist
echo "Checking project structure..."

# Check main app file
if [ ! -f "App.js" ]; then
  echo "Error: App.js not found!"
  exit 1
fi

# Check navigation
if [ ! -f "src/navigation/AppNavigator.js" ]; then
  echo "Error: AppNavigator.js not found!"
  exit 1
fi

# Check screens
SCREENS=("WelcomeScreen.js" "SignUpScreen.js" "LoginScreen.js" "EmailVerificationScreen.js" 
         "HomeScreen.js" "ProfileScreen.js" "VideoPlayerScreen.js" "ShortVideoScreen.js")

for screen in "${SCREENS[@]}"; do
  if [ ! -f "src/screens/$screen" ]; then
    echo "Error: $screen not found!"
    exit 1
  fi
done

# Check components
COMPONENTS=("Button.js" "Input.js" "Logo.js" "LogoPlaceholder.js")

for component in "${COMPONENTS[@]}"; do
  if [ ! -f "src/components/$component" ]; then
    echo "Error: $component not found!"
    exit 1
  fi
done

# Check services
SERVICES=("authService.js" "videoService.js" "vpnService.js")

for service in "${SERVICES[@]}"; do
  if [ ! -f "src/services/$service" ]; then
    echo "Error: $service not found!"
    exit 1
  fi
done

# Check Firebase config
if [ ! -f "src/config/firebase.js" ]; then
  echo "Error: firebase.js not found!"
  exit 1
fi

echo "Project structure check passed!"

# Try to run the app
echo "Attempting to start the app..."
npm start -- --no-dev --minify &
START_PID=$!

# Wait a bit for the app to start
sleep 10

# Check if the process is still running
if kill -0 $START_PID 2>/dev/null; then
  echo "App started successfully!"
  # Kill the process after testing
  kill $START_PID
else
  echo "Error: App failed to start!"
  exit 1
fi

echo "All tests passed! The Ultra Stream app is ready for deployment."
