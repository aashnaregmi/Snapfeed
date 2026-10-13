import { Link, useNavigate } from "react-router-dom";

function FeedNavbar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "";
  const initial = username.trim().charAt(0).toUpperCase() || "?";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");

    navigate("/login", { replace: true });
  };

  return (
    <nav className="feed-navbar">
      <Link to="/feed" className="feed-logo">
        <span className="logo-icon">✳</span>
        <span>snapfeed.</span>
      </Link>

      <div className="feed-navbar-actions">
        <Link to="/profile" className="profile-avatar" title="My profile">
          {initial}
        </Link>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}

export default FeedNavbar;
