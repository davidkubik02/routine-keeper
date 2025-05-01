import React from "react";
import NewTaskForm from "../pages/NewTaskForm/NewTaskForm";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Rewards from "../pages/Rewards/Rewards";

interface Route {
  path: string;
  name: string;
  element: JSX.Element;
  isMenu: boolean;
  isPrivate: boolean;
}

export const routes: Route[] = [
  {
    path: "/routine-keeper",
    name: "Úkoly",
    element: <Home />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/new",
    name: "Vytvořit nový",
    element: <NewTaskForm />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/new/:id",
    name: "Upravit",
    element: <NewTaskForm />,
    isMenu: false,
    isPrivate: true,
  },
  {
    path: "/rewards",
    name: "Odměny",
    element: <Rewards />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/login",
    name: "Přihlásit se",
    element: <Login />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/Register",
    name: "Zaregistrovat se",
    element: <Register />,
    isMenu: false,
    isPrivate: false,
  },
];
