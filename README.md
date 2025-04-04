# Ultra Stream App - Deployment Guide

## Project Overview
Ultra Stream is a mobile streaming application built with React Native Expo and Firebase. The app allows users to create accounts, stream videos, manage profiles, and use VPN functionality for secure streaming.

## Features
- User authentication with MFA support
- Video streaming (regular and short-form videos)
- User profile management
- VPN connection for secure streaming
- Social features (likes, comments, follows)

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account with the provided configuration

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd UltraStream
```

2. Install dependencies:
```bash
npm install
```

3. Firebase Configuration:
   - The Firebase configuration is already set up in `src/config/firebase.js`
   - Make sure your Firebase project has Authentication, Firestore, and Storage enabled

## Running the App

### Development Mode
```bash
npm start
```
This will start the Expo development server. You can run the app on:
- iOS simulator (macOS only): Press `i`
- Android emulator: Press `a`
- Physical device: Scan the QR code with the Expo Go app

### Production Build

#### For Android
```bash
expo build:android
```

#### For iOS
```bash
expo build:ios
```

## Project Structure

```
UltraStream/
├── App.js                  # Main application entry point
├── app.json                # Expo configuration
├── package.json            # Dependencies and scripts
├── src/
│   ├── assets/             # Images and other static assets
│   ├── components/         # Reusable UI components
│   │   ├── Button.js       # Custom button component
│   │   ├── Input.js        # Custom input component
│   │   ├── Logo.js         # Logo component
│   │   └── ...
│   ├── config/
│   │   └── firebase.js     # Firebase configuration
│   ├── navigation/
│   │   └── AppNavigator.js # Navigation setup
│   ├── screens/            # App screens
│   │   ├── WelcomeScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── VideoPlayerScreen.js
│   │   ├── ShortVideoScreen.js
│   │   └── ...
│   ├── services/           # Firebase services
│   │   ├── authService.js  # Authentication functions
│   │   ├── videoService.js # Video management functions
│   │   ├── vpnService.js   # VPN connection functions
│   │   └── ...
│   └── tests/              # Test scripts
└── test.sh                 # Test shell script
```

## Firebase Services

### Authentication
- Email/password authentication
- Multi-factor authentication support
- Password reset functionality

### Firestore Database
- User profiles
- Video metadata
- Comments and likes

### Storage
- Video content storage
- User profile images

## VPN Integration
The app includes VPN functionality that can be toggled from the profile screen. When active, the VPN status is displayed on video screens.

## Testing
Run the test script to verify the app structure and functionality:
```bash
chmod +x test.sh
./test.sh
```

## Customization
- Colors and theme can be modified in the component style definitions
- Firebase configuration can be updated in `src/config/firebase.js`

## Troubleshooting
- If you encounter package compatibility issues, try running `expo doctor` to identify and fix them
- For Firebase connection issues, verify your Firebase configuration and make sure all required services are enabled

## Support
For any questions or issues, please contact the development team.
