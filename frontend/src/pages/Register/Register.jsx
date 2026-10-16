import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    username: "",
    gender: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Convert FastAPI errors into readable messages.
  const getErrorMessage = (detail) => {
    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          const field = Array.isArray(item.loc)
            ? item.loc[item.loc.length - 1]
            : "";

          const message = item.msg || "Invalid value";

          return field
            ? `${String(field).replaceAll("_", " ")}: ${message}`
            : message;
        })
        .join(". ");
    }

    if (detail && typeof detail === "object") {
      return detail.msg || detail.message || "Registration failed";
    }

    return "Registration failed. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(data.detail));
      }

      setSuccess(data.message || "Registration successful!");

      console.log("Registration successful:", data);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      if (error instanceof TypeError) {
        setError(
          "Unable to connect to the server. Please check your connection and try again.",
        );
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {/* LEFT BANNER */}
        <div className="register-banner">
          <div className="banner-content">
            <div className="banner-logo">✦</div>

            <div className="banner-bottom">
              <span className="banner-tag">Capture & Share</span>

              <h1>
                Connect with creativity.
                <br />
                Share your perspective.
              </h1>

              <p>Turn everyday moments into stories worth sharing.</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="register-form-section">
          <div className="form-header">
            <h2>Create your SnapFeed account</h2>
            <p>Join SnapFeed and start sharing your perspective.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* FULL NAME + USERNAME */}
            <div className="input-grid">
              <div className="input-group">
                <label htmlFor="registerName">Full Name</label>

                <input
                  id="registerName"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="registerUsername">Username</label>

                <input
                  id="registerUsername"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* DATE OF BIRTH + GENDER */}
            <div className="input-grid">
              <div className="input-group">
                <label htmlFor="registerDob">Date of Birth</label>

                <input
                  id="registerDob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="registerGender">Gender</label>

                <select
                  id="registerGender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* EMAIL */}
            <div className="input-group full-width">
              <label htmlFor="registerEmail">Email</label>

              <input
                id="registerEmail"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD + CONFIRM PASSWORD */}
            <div className="input-grid">
              <div className="input-group">
                <label htmlFor="registerPassword">Password</label>

                <div className="register-password-wrapper">
                  <input
                    id="registerPassword"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>

                <div className="register-password-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Confirm your password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>
            </div>

            {/* REGISTER BUTTON */}
            <button type="submit" className="register-button">
              Create Account
            </button>

            {/* ERROR */}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            {/* SUCCESS */}
            {success && (
              <p className="form-success" role="status">
                {success}
              </p>
            )}
          </form>

          {/* LOGIN FOOTER */}
          <p className="login-footer">
            Already have an account?{" "}
            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
