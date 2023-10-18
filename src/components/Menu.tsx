import React, { useContext } from "react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function Menu({ active }: { active: boolean }) {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className={`menu ${active ? "menu-active" : undefined}`}>
      {user?.username ? (
        <>
          <h2>{user.username}</h2>
          <Link className="menu-button" to="/reoutine-keeper">
            Úkoly
          </Link>
          <Link className="menu-button" to="/new">
            Vytvořit nový
          </Link>
          <a onClick={logout}>Log out</a>
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
