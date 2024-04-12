import firebase from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { STATUS_RESPONSE } from "@/constants";

const auth = getAuth(firebase);

const SocialAuthAction = {
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      await signInWithPopup(auth, provider);
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: "User signed in by Google successfully",
      };
    } catch (error: any) {
      return {
        status: STATUS_RESPONSE.ERROR,
        message: "An error occurred while signing in: " + error.code,
      };
    }
  },
};

export default SocialAuthAction;
