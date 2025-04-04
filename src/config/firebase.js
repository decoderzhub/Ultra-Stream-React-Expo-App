// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY ? 'Set' : 'Not Set',
  authDomain: process.env.REACT_APP_AUTHDOMAIN ? 'Set' : 'Not Set',
  projectId: process.env.REACT_APP_PROJECTID ? 'Set' : 'Not Set',
  storageBucket: process.env.REACT_APP_STORAGEBUCKET ? 'Set' : 'Not Set',
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID ? 'Set' : 'Not Set',
  appId: process.env.REACT_APP_APPID ? 'Set' : 'Not Set',
  measurementId: process.env.REACT_APP_MEASUREMENTID ? 'Set' : 'Not Set'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const firestore = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, firestore, storage, functions };
