import { z } from "zod";
import firebase from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { SignInSchema, SignUpSchema } from "@/schemas/auth";

const auth = getAuth(firebase);

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  try {
    const validatedFields = SignUpSchema.safeParse(values);
    // Validate fields
    if (!validatedFields.success) {
      return new Error("Invalid fields");
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
      message: "Email verification sent!",
    };
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use");
    }
    throw new Error("An error occurred while signing up: " + error.code);
  }
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  try {
    const validatedFields = SignInSchema.safeParse(values);
    // Validate fields
    if (!validatedFields.success) {
      return new Error("Invalid fields");
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
      return new Error("Email not verified");
    }
    // Return success message
    return {
      message: "Signed in successfully!",
    };
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      throw new Error("Invalid credentials");
    }
    throw new Error("An error occurred while signing in: " + error.code);
  }
};
