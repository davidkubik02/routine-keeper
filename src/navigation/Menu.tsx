import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { routes } from "./routes";
function Menu() {
  const { user, logout } = useContext(AuthContext);

  const [menuActive, setMenuActive] = useState<boolean>(false);

  const openMenu = () => {
    setMenuActive(true);
  };
  const closeMenu = () => {
    setMenuActive(false);
  };
  return (
    <>
      <i onClick={openMenu} className="menu-open-button fa-solid fa-bars" />
      {menuActive && <div className="overlay" onClick={closeMenu} />}
      <nav className={`menu ${menuActive && "menu-active"}`}>
        <i
          onClick={closeMenu}
          className="menu-close-button fa-solid fa-xmark"
        />
        {user?.username ? (
          <>
            <h2>{user.username}</h2>
            {routes.map((route) => {
              if (route.isMenu) {
                return (
                  <Link
                    key={route.name}
                    className="menu-button"
                    to={route.path}
                  >
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
    </>
  );
}

export default Menu;
