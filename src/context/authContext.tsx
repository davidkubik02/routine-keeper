import { createContext, useEffect, useState } from "react";
import axios from "axios";
import React from "react";
interface User {
  username: string;
}

interface UserInfo {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (UserInfo: UserInfo) => void;
  logout: () => void;
  authUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  authUser: async () => {},
});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (userInfo: UserInfo): Promise<void> => {
    await axios.post("/auth/login", userInfo, {
      withCredentials: true,
    });
    authUser();
  };
  const logout = async () => {
    await axios.post("/auth/logout", null, {
      withCredentials: true,
    });
    setUser(null);
  };
  const authUser = async () => {
    try {
      const res = await axios.get("/user/getUsername", {
        withCredentials: true,
      });
      const username: string = res.data;
      setUser({ username });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    authUser();
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, authUser }}>{children}</AuthContext.Provider>;
};
