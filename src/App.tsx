import "./App.css";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { routes } from "./navigation/routes";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        {!user?.username ? (
          <>
            {routes.map((route) => {
              if (!route.isPrivate) {
                return (
                  <Route
                    key={route.name}
                    path={route.path}
                    element={route.element}
                  />
                );
              } else return null;
            })}
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {routes.map((route) => {
              if (route.isPrivate) {
                return (
                  <Route
                    key={route.name}
                    path={route.path}
                    element={route.element}
                  />
                );
              } else return null;
            })}
            <Route path="/*" element={<Navigate to="/routine-keeper" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
