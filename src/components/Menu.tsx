import React, { useState } from "react";
import { Link } from "react-router-dom";

function Menu() {
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
      {menuActive && <div className="menu-outline" onClick={closeMenu} />}
      <nav className={`menu ${menuActive && "menu-active"}`}>
        <i
          onClick={closeMenu}
          className="menu-close-button fa-solid fa-xmark"
        />
        <Link className="menu-button" to="/routine-keeper">
          Úkoly
        </Link>
        <Link className="menu-button" to="/new">
          Vytvořit nový
        </Link>
        <Link className="menu-button" to="/login">
          Přihlásit se
        </Link>
        <Link className="menu-button" to="/register">
          Zaregistrovat se
        </Link>
      </nav>
    </>
  );
}

export default Menu;
