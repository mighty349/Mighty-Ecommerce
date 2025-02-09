// Ensure to import the CSS file
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";

function AdminLogin() {
  const [cred, setcred] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [message, setmessage] = useState("");

  function change(event) {
    const { name, value } = event.target;
    setcred((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function click(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/admin-login",
        cred,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setmessage(response.data.message);
        // Navigate to the admin dashboard on successful login
        navigate("/admin-dashboard");
      }
    } catch (error) {
      if (error.response) {
        setmessage(error.response.data.message);
      } else {
        setmessage("An error occurred, please try again.");
      }
    }

    // Optionally, clear the credentials after submission
    setcred({
      email: "",
      password: "",
    });
  }

  function user(event) {
    event.preventDefault();
    navigate("/");
  }

  return (
    <div className={styles["login-wrapper"]}>
      {/* Centering Wrapper */}
      <div className={styles["login-container"]}>
        <h1 className={styles.logo}>Mighty-Ecommerce</h1>
        <form className={styles["login-form"]} onSubmit={click}>
          <h2>Login As Admin</h2>
          <div className={styles["form-group"]}>
            <i className="fa-regular fa-envelope" style={{ color: "black" }}></i>
            <input
              type="text"
              name="email"
              value={cred.email}
              placeholder="Email Address"
              required
              onChange={change}
              autoComplete="off"
            />
          </div>
          <div className={styles["form-group"]}>
            <i className="fa-solid fa-lock" style={{ color: "black" }}></i>
            <input
              type="password"
              name="password"
              value={cred.password}
              placeholder="Password"
              required
              onChange={change}
              autoComplete="off"
            />
          </div>
          <div className={styles["form-group-button"]}>
            <button type="submit">Login</button>
          </div>
          {message && <p style={{ color: "black" }}>{message}</p>}
          <div className={styles["form-group-button"]}>
            <h2>or</h2>
            <button className={styles.registerBtn} onClick={user}>
              Login As User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
