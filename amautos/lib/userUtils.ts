// lib/userUtils.ts

import db from "./firestore";
import { doc, getDoc } from "firebase/firestore";

export interface UserData {
  uid: string;
  username: string;
  esAdmin: boolean;
  createdAt: Date;
}

// -----------------------------
// Obtener si es admin
// -----------------------------
export async function getUserAdmin(uid: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, "Usuarios", uid));
  if (userDoc.exists()) {
    return !!userDoc.data().esAdmin;
  }
  return false;
}

// -----------------------------
// Obtener datos completos del usuario
// -----------------------------
export async function getUserData(uid: string): Promise<UserData | null> {
  const userDoc = await getDoc(doc(db, "Usuarios", uid));
  if (!userDoc.exists()) return null;

  const data = userDoc.data() as any;

  return {
    uid: data.uid,
    username: data.username || "Usuario",
    esAdmin: !!data.esAdmin,
    createdAt: data.createdAt?.toDate?.() || new Date(),
  };
}
