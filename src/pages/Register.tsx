import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menu from "../navigation/Menu";

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });

  const navigate = useNavigate();

  const [alert, setAlert] = useState("");
  const updateUserInfo = (e: any) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (userInfo.repeatPassword !== userInfo.password) {
      setAlert("Hesla musí být stejné");
      return;
    } else setAlert("");
    try {
      await axios.post("/auth/register", userInfo);
      navigate("/login");
    } catch (err: any) {
      setAlert(err.response.data);
    }
  };

  return (
    <>
      <div className="page-container">
        <header className="header">
          <Menu />
        </header>
        <form className="auth-form">
          <h2>Zaregistruj se</h2>
          <input placeholder="Uživatelské jméno" name="username" type="text" onChange={updateUserInfo} />
          <input placeholder="Heslo" name="password" type="password" onChange={updateUserInfo} />
          <input placeholder="Heslo znovu" name="repeatPassword" type="password" onChange={updateUserInfo} />
          <button onClick={handleSubmit}>Zaregistrovat se</button>
          {alert && <p className="alert">{alert}</p>}
        </form>
      </div>
    </>
  );
};

export default Register;
