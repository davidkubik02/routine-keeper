import React from "react";
import { useRef } from "react";
import { TaskModel } from "../models/taskModel";
import Menu from "./Menu";

const Header = ({ setFiltredTasks, tasks, toggleMenu, menuActive }: any) => {
  const searchRef = useRef<HTMLInputElement>(null);

  const filterTaskHandle = (e: any) => {
    if (!e.target.value) {
      setFiltredTasks(tasks);
      return;
    }
    const filtredUsers = tasks.filter((task: TaskModel) => {
      return task.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFiltredTasks(filtredUsers);
  };

  const clearInput = (): void => {
    if (searchRef.current) {
      setFiltredTasks(tasks);
      searchRef.current.value = "";
      searchRef.current.focus();
    }
  };

  return (
    <header className="header">
      <div className="search">
        <div className="search-inputs">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            ref={searchRef}
            onChange={filterTaskHandle}
            className="search-input"
            type="text"
            placeholder="Hledat"
          />
          <i onClick={clearInput} className="fa-solid fa-circle-xmark" />
        </div>
      </div>
      <Menu />
    </header>
  );
};

export default Header;
