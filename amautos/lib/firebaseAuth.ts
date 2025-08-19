// lib/firebaseAuth.ts

import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import db from "./firestore";
import { doc, setDoc } from "firebase/firestore";

export async function register(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Crear documento en Usuarios
  await setDoc(doc(db, "Usuarios", userCredential.user.uid), {
    uid: userCredential.user.uid,
    esAdmin: false
  });
  return userCredential;
}

export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}

