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
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (userInfo: UserInfo): Promise<void> => {
    const res = await axios.post("http://localhost:8080/auth/login", userInfo, {
      withCredentials: true,
    });
    console.log(res);
    getUsername();
  };
  const logout = async () => {
    await axios.post("http://localhost:8080/auth/logout", null, {
      withCredentials: true,
    });
    setUser(null);
  };
  const getUsername = async () => {
    try {
      const res = await axios.get("http://localhost:8080/user/getUsername", {
        withCredentials: true,
      });
      const username: string = res.data;
      setUser({ username });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
