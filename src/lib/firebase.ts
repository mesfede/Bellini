import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const isCustomProject = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "bellini-odontalgia";

const firebaseConfig = {
  projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:172524051130:web:b7d760a0d1a53184418083",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAkp-XkvJv5gh1dXR3vLa0V6S6yi-4aDSE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bellini-odontalgia.firebaseapp.com",
  firestoreDatabaseId: isCustomProject 
    ? (import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "") 
    : "", // Uses default Firestore database for the custom project
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bellini-odontalgia.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "172524051130",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7WHH61SVMF"
};

const app = initializeApp(firebaseConfig);
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId) 
  : getFirestore(app); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard and customized configurations for authentication pop-ups
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth Helpers
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error in Google Sign In:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Error Handling exactly as instructed in SKILL.md
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection is tested dynamically on demand, no immediate forced startup check is needed

