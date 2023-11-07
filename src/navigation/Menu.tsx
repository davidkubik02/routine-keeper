import React, { useContext } from "react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { routes } from "./routes";
function Menu({ active }: { active: boolean }) {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className={`menu ${active ? "menu-active" : undefined}`}>
      {user?.username ? (
        <>
          <h2>{user.username}</h2>
          {routes.map((route) => {
            if (route.isMenu) {
              return (
                <Link key={route.name} className="menu-button" to={route.path}>
                  {route.name}
                </Link>
              );
            } else return null;
          })}
          <button onClick={logout}>Log out</button>
        </>
      ) : (
        <>
          <Link className="menu-button" to="/login">
            Přihlásit se
          </Link>
          <Link className="menu-button" to="/register">
            Zaregistrovat se
          </Link>
        </>
      )}
    </nav>
  );
}

export default Menu;
