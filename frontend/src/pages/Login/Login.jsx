import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });

    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new URLSearchParams();
    formData.append("username", loginData.username);
    formData.append("password", loginData.password);

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
        setError(data.detail || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LEFT BANNER */}
        <div className="login-banner">
          <div className="login-banner-content">
            <div className="login-banner-logo">✦</div>

            <div className="login-banner-bottom">
              <span className="login-banner-tag">Welcome Back</span>

              <h1>
                Your world.
                <br />
                Your perspective.
              </h1>

              <p>
                Pick up where you left off and keep sharing the moments that
                matter.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="login-form-section">
          <div className="login-form-header">
            <h2>Welcome back to SnapFeed</h2>
            <p>Log in to continue sharing your perspective.</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* USERNAME */}
            <div className="login-input-group">
              <label htmlFor="loginUsername">Username</label>

              <input
                id="loginUsername"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="login-input-group">
              <label htmlFor="loginPassword">Password</label>

              <div className="login-password-wrapper">
                <input
                  id="loginPassword"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>

              <button
                type="button"
                className="forgot-button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* ERROR AND SUCCESS MESSAGES */}
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          {/* REGISTER */}
          <p className="register-footer">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/register")}
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
