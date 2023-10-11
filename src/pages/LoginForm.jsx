import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user_auth_token")) {
      navigate("/todolist");
    }
  }, [navigate]);

  const loginHandler = () => {
    try {
      if (email === "") {
        return toast.warning("Please enter your email address.");
      }
      if (password === "") {
        return toast.warning("Please enter your password.");
      }

      axios
        .post("http://localhost:8000/users/login", { email, password })
        .then((response) => {
          if (response.data.success) {
            localStorage.setItem("user_auth_token", response.data.data);
            toast.success(response.data.message);
            navigate("/todolist");
          }
        })
        .catch((error) => {
          if (error.response && !error.response.data.success) {
            toast.error(error.response.data.message);
          } else {
            console.log(error);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-page">
      <div className="left-half">
        <div className="login-form">
          <h2>Login</h2>
          <div>
            <div className="input-group">
              <label>Email:</label>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    loginHandler();
                  }
                }}
              />
            </div>
            <button onClick={loginHandler}>Login</button>
          </div>
        </div>
      </div>
      <div className="right-half">
        {/* Add your interactive and professional image here */}
        {/* You can use an <img> tag or other components */}
      </div>
    </div>
  );
}

export default LoginPage;
