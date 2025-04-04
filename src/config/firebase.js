// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAujY6PzLfo4asLdA7GPlg_z_Q778stPAg",
  authDomain: "ultra-stream-36901.firebaseapp.com",
  projectId: "ultra-stream-36901",
  storageBucket: "ultra-stream-36901.firebasestorage.app",
  messagingSenderId: "244569584099",
  appId: "1:244569584099:web:8c7237da9a3c7f0a4e30d6",
  measurementId: "G-F1VH1R8EXG"
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
