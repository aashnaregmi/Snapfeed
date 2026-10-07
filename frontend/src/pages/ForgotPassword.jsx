import { useState } from "react";

function ForgotPassword({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      alert(data.message);
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="auth-card">
        <h1>📸 SnapFeed</h1>

        <p>Forgot your password?</p>

        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <button type="button" onClick={goToLogin} className="text-button">
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
