import React from "react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const [alert, setAlert] = useState<string>("");

  const { login } = useContext(AuthContext);

  const updateUserInfo = (e: any): void => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await login(userInfo);
      // navigate("/");
    } catch (err: any) {
      setAlert(err);
    }
  };

  return (
    <>
      <div className="page-container">
        <header className="header">
          <Menu />
        </header>
        <form className="auth-form">
          <h2>Přihlásit se</h2>
          <input
            placeholder="Uživatelské jméno"
            name="username"
            type="text"
            onChange={updateUserInfo}
          />
          <input
            placeholder="Heslo"
            name="password"
            type="password"
            onChange={updateUserInfo}
          />
          <button onClick={handleSubmit}>Přihlásit se</button>
          {/* {alert && <p className="alert">{alert}</p>} */}
        </form>
      </div>
    </>
  );
};

export default Login;
