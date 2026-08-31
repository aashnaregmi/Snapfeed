import { useState } from "react";

function Register({ goToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      alert("Registration successful! Please login.");

      goToLogin();
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="auth-card">
        <h1>📸 SnapFeed</h1>

        <p>Create your account</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{loading ? "Creating..." : "Register"}</button>
        </form>

        <div className="auth-switch">
          <span>Already have an account?</span>

          <button type="button" onClick={goToLogin} className="text-button">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
