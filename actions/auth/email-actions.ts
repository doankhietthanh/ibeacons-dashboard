import { applyActionCode, getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";

const auth = getAuth(firebase);

export const emailActions = async (
  mode: string,
  actionCode: string,
  continueUrl: string | null,
) => {
  switch (mode) {
    case "verifyEmail":
      try {
        console.log(actionCode);
        await applyActionCode(auth, actionCode);
        return {
          success: "Email verified successfully",
        };
      } catch (error: any) {
        console.log(error);
        return {
          error: "An error occurred while verifying email: " + error.code,
        };
      }
    default:
      return {
        error: "Invalid mode",
      };
  }
};
