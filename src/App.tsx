import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import NewTaskForm from "./pages/NewTaskForm";
import React, { useContext } from "react";
import { AuthContext } from "./context/authContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* {!user.username && <Route path="*" element={<Navigate to="/login" />} />} */}
        <Route path="/reoutine-keeper" element={<Home />} />
        <Route path="/new" element={<NewTaskForm />} />
        <Route path="/new/:id" element={<NewTaskForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<Navigate to="/reoutine-keeper" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
