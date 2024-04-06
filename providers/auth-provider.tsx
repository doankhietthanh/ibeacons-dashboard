import React, { createContext, useContext, useEffect, useState } from "react";
import firebase from "@/lib/firebase";
import { getAuth, User } from "firebase/auth";

const auth = getAuth(firebase);

const AuthContext = createContext({ user: null as User | null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
