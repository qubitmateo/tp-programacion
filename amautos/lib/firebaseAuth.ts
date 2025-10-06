// lib/firebaseAuth.ts
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import db from "./firestore";
import { doc, setDoc } from "firebase/firestore";

export async function register(
  email: string,
  password: string,
  username: string, // <-- nuevo parámetro
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  // Crear documento en Usuarios con username
  await setDoc(doc(db, "Usuarios", userCredential.user.uid), {
    uid: userCredential.user.uid,
    esAdmin: false,
    username: username, // <-- guardamos username
    email: email, // opcional, por si querés mostrarlo después
  });

  return userCredential;
}

export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}
