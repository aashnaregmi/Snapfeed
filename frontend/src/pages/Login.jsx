import { useState } from "react";

function Login({ onLogin, goToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      onLogin(data.access_token);
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="auth-card">
        <h1>📸 SnapFeed</h1>

        <p>Login to your account</p>

        <form onSubmit={handleLogin}>
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

          <button type="submit">{loading ? "Logging in..." : "Login"}</button>
        </form>

        <div className="auth-switch">
          <span>Don't have an account?</span>

          <button type="button" onClick={goToRegister} className="text-button">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
