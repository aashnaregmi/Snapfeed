import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

// Read the backend URL from the frontend/.env file.
const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  // Allows navigation to another route, such as the login page.
  const navigate = useNavigate();

  // Store all registration form values in one object.
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    username: "",
    gender: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // Control whether each password field is visible or hidden.
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Store messages that will be displayed to the user.
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle changes in the input fields.
  const handleChange = (e) => {
    // Get the name and current value of the input that changed.
    const { name, value } = e.target;

    setFormData({
      ...formData, // Preserve the other form values.
      [name]: value, // Update only the field that changed.
    });
  };

  // Handle form submission and communicate with the backend.
  const handleSubmit = async (e) => {
    // Prevent the browser from reloading the page on submission.
    e.preventDefault();

    // Clear messages from a previous submission.
    setError("");
    setSuccess("");

    // Check that both password fields match before sending the request.
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return; // Stop submission if the passwords do not match.
    }

    try {
      // Send the registration data to the FastAPI backend.
      const response = await fetch(`${API_URL}/register`, {
        method: "POST", // POST sends data to create a new account.
        headers: {
          "Content-Type": "application/json", // Tell the backend the body is JSON.
        },
        body: JSON.stringify(formData), // Convert the JavaScript object to JSON.
      });

      // Convert the server's JSON response into a JavaScript object.
      const data = await response.json();

      // Handle unsuccessful HTTP responses.
      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      // Display the success message returned by the backend.
      setSuccess(data.message || "Registration successful!");

      // Log the response for development debugging.
      console.log("Registration successful:", data);

      // Redirect the user to the login page after one second.
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      // Handle network errors and errors thrown in the try block.
      console.error("Registration error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {/* LEFT BANNER: Branding and introductory text */}
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

        {/* RIGHT FORM: Registration fields and submission */}
        <div className="register-form-section">
          <div className="form-header">
            <h2>Create your SnapFeed account</h2>
            <p>Join SnapFeed and start sharing your perspective.</p>
          </div>

          {/* Call handleSubmit when the user submits the form. */}
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

                  {/* Toggle the password between visible and hidden. */}
                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
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

                  {/* Toggle confirmation-password visibility. */}
                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit the registration form. */}
            <button type="submit" className="register-button">
              Create Account
            </button>

            {/* Show the error message only when an error exists. */}
            {error && <p className="form-error">{error}</p>}

            {/* Show the success message only when registration succeeds. */}
            {success && <p className="form-success">{success}</p>}
          </form>

          {/* LOGIN FOOTER: Navigate to login for existing users. */}
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
