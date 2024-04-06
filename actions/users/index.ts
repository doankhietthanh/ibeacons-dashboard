import firebase from "@/lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const firestore = getFirestore(firebase);

export const getUserByEmail = async (email: string) => {
  const docRef = doc(firestore, "users");
  const user = await getDoc(docRef);
  if (user.exists()) {
    return user.data();
  }

  return null;
};
