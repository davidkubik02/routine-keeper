import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import NewTaskForm from "./pages/NewTaskForm";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/routine-keeper" element={<Home />} />
        <Route path="/new" element={<NewTaskForm />} />
        <Route path="/new/:id" element={<NewTaskForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
