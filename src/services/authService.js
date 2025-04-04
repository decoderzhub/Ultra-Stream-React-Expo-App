import { 
  auth, 
  firestore 
} from '../config/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// User registration
export const registerUser = async (email, password, displayName) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    await setDoc(doc(firestore, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName,
      createdAt: new Date().toISOString(),
      photoURL: null,
      isVpnActive: false
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

// User login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// User logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Password reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Setup MFA with phone
export const setupMFA = async (phoneNumber, verificationCode) => {
  try {
    const user = auth.currentUser;
    
    // Get multi-factor session
    const multiFactorSession = await multiFactor(user).getSession();
    
    // Specify phone auth provider
    const phoneAuthProvider = new PhoneAuthProvider(auth);
    
    // Get phone info options
    const phoneInfoOptions = {
      phoneNumber,
      session: multiFactorSession
    };
    
    // Send verification code
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions);
    
    // Create credential with verification ID and code
    const phoneAuthCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
    
    // Enroll as second factor
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
    await multiFactor(user).enroll(multiFactorAssertion, "Phone Number");
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (uid, data) => {
  try {
    await updateDoc(doc(firestore, 'users', uid), {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    // If display name is being updated, also update auth profile
    if (data.displayName) {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
    }
    
    // If photo URL is being updated, also update auth profile
    if (data.photoURL) {
      await updateProfile(auth.currentUser, { photoURL: data.photoURL });
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};
