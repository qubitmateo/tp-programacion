import db from "./firestore";
import { doc, getDoc } from "firebase/firestore";

export async function getUserAdmin(uid: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, "Usuarios", uid));
  if (userDoc.exists()) {
    return !!userDoc.data().esAdmin;
  }
  return false;
}
