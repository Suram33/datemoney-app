import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKAUrrL6Xk-IAsamM1_2JUTH-u4ITWnQ48",
  authDomain: "datemoney-app.firebaseapp.com",
  projectId: "datemoney-app",
  storageBucket: "datemoney-app.firebasestorage.app",
  messagingSenderId: "568208P3182",
  appId: "1:568208P3182:web:ecfc58af1d562120a2acaf",
  measurementId: "G-XHE204SHH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const addCompanion = async (companionData) => {
  try {
    const docRef = await addDoc(collection(db, 'companions'), companionData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding companion:', error);
    throw error;
  }
};

export const getCompanions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'companions'));
    const companions = [];
    querySnapshot.forEach((doc) => {
      companions.push({ id: doc.id, ...doc.data() });
    });
    return companions;
  } catch (error) {
    console.error('Error getting companions:', error);
    throw error;
  }
};

export const updateCompanion = async (id, data) => {
  try {
    const docRef = doc(db, 'companions', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating companion:', error);
    throw error;
  }
};

export const deleteCompanion = async (id) => {
  try {
    await deleteDoc(doc(db, 'companions', id));
  } catch (error) {
    console.error('Error deleting companion:', error);
    throw error;
  }
};

export default app;
