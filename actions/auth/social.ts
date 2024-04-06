import firebase from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";

const auth = getAuth(firebase);

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    await signInWithPopup(auth, provider);
    return {
      success: "User signed in successfully",
    };
  } catch (error: any) {
    return {
      error: "An error occurred while signing in: " + error.code,
    };
  }
};
