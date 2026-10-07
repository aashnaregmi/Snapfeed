import { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    username: "",
    gender: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess(data.message);

      console.log("Registration successful:", data);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
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
            {/* NAME + USERNAME */}
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

            {/* DOB + GENDER */}
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

                <input
                  id="registerPassword"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>

                <input
                  id="confirmPassword"
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm your password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="register-button">
              Create Account
            </button>

            {error && <p className="form-error">{error}</p>}

            {success && <p className="form-success">{success}</p>}
          </form>

          <p className="login-footer">
            Already have an account?{" "}
            <button type="button" className="text-button">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
