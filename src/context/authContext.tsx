import { createContext, useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export const AuthContext = createContext<{
  user: any;
  login: (userInfo: any) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState(
    // JSON.parse(localStorage.getItem("user") || "")
    "user"
  );

  //   todo typ u userInfo nesedí s bacendem
  const login = async (userInfo: any) => {
    const res = await axios.post("http://localhost:8800/api/login", userInfo);
    setUser(res.data);
  };
  const logout = async () => {
    await axios.post("http://localhost:8800/api/logout");
    setUser("null");
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
