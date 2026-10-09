import React from "react";
import { useState } from "react";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Property          // Value
    // e.target.name     "username"
    // e.target.value    "aashna123"

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(loginData);
  };
  return (
    <div>
      <p>Login</p>
      <form action="post" onSubmit={handleSubmit}>
        <label htmlFor="Login-user">Username:</label>
        <input
          name="username"
          type="text"
          value={loginData.username}
          placeholder="Enter your username"
          onChange={handleChange}
          required
        />
        <label htmlFor="Login-password">Password:</label>
        <input
          name="password"
          type="password"
          value={loginData.password}
          placeholder="Enter your password"
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
