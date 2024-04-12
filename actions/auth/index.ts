import { z } from "zod";
import firebase from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { SignInSchema, SignUpSchema } from "@/schemas/auth";
import { STATUS_RESPONSE } from "@/constants";

const auth = getAuth(firebase);

const AuthAction = {
  signUp: async (values: z.infer<typeof SignUpSchema>) => {
    try {
      const validatedFields = SignUpSchema.safeParse(values);
      // Validate fields
      if (!validatedFields.success) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: "Invalid fields",
        };
      }
      // Destructure fields
      const { username, email, password } = validatedFields.data;
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Update user profile with username
      await updateProfile(userCredential.user, {
        displayName: username,
      });
      // Send email verification
      await sendEmailVerification(userCredential.user);
      // Return success message
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: "Email verification sent!",
      };
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: "Email is already in use",
        };
      }
      return {
        status: STATUS_RESPONSE.ERROR,
        message: "An error occurred while signing up: " + error.code,
      };
    }
  },

  signIn: async (values: z.infer<typeof SignInSchema>) => {
    try {
      const validatedFields = SignInSchema.safeParse(values);
      // Validate fields
      if (!validatedFields.success) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: "Invalid fields",
        };
      }
      // Destructure fields
      const { email, password } = validatedFields.data;
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: "Email is not verified",
        };
      }
      // Return success message
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: "Signed in successfully!",
      };
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: "Invalid credentials",
        };
      }
      return {
        status: STATUS_RESPONSE.ERROR,
        message: "An error occurred while signing in: " + error.code,
      };
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: "Signed out successfully!",
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: STATUS_RESPONSE.ERROR,
        message: error || "Signed out failed! - " + error.code,
      };
    }
  },
};

export default AuthAction;
