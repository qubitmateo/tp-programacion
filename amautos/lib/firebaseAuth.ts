// lib/firebaseAuth.ts
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export async function register(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}

