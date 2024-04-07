import { User } from "firebase/auth";

export const getUserCreatedInfo = (user: User | undefined | null) => {
  if (!user) return;

  return {
    createdBy: user?.uid,
    createdAt: new Date(),
    updatedBy: user?.uid,
    updatedAt: new Date(),
  };
};

export const getUserUpdatedInfo = (user: User | undefined | null) => {
  if (!user) return;

  return {
    updatedBy: user?.uid,
    updatedAt: new Date(),
  };
};
