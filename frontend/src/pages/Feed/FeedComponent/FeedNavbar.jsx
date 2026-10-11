import { Link } from "react-router-dom";

function FeedNavbar() {
  const username = localStorage.getItem("username") || "";
  const initial = username.trim().charAt(0).toUpperCase() || "?";

  return (
    <nav className="feed-navbar">
      <Link to="/" className="feed-logo">
        <span className="logo-icon">✳</span>
        <span>snapfeed.</span>
      </Link>

      <Link to="/profile" className="profile-avatar" title="My profile">
        {initial}
      </Link>
    </nav>
  );
}

export default FeedNavbar;
