// Ensure to import the CSS file
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";

function Login() {
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
            const response = await axios.post("http://localhost:3000/login", cred, {
                withCredentials: true,
            });
            if (response.status === 200) {
                setmessage(response.data.message);
                navigate("/home");
            }
        } catch (error) {
            if (error.response) {
                setmessage(error.response.data.message);
            } else {
                setmessage("An error occurred, please try again.");
            }
        }

        setcred({
            email: "",
            password: "",
        });
    }

    function register(event) {
        event.preventDefault();
        navigate("/register");
    }

    // Function to handle admin login navigation
    function adminLogin(event) {
        event.preventDefault();
        navigate("/admin-login");
    }

    return (
        <>
            {/* Admin Login Button */}
            <button className={styles["admin-login-btn"]} onClick={adminLogin}>
                Login as admin
            </button>

            <div className={styles["login-wrapper"]}> {/* Centering Wrapper */}
                <div className={styles["login-container"]}>
                    <h1 className={styles.logo}>Mighty-Ecommerce</h1>
                    <form className={styles["login-form"]} onSubmit={click}>
                        <h2>Login</h2>
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
                            <button className={styles.registerBtn} onClick={register}>
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
