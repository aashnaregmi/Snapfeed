import { Link } from "react-router-dom";

function FeedNavbar() {
  return (
    <nav className="feed-navbar">
      <Link to="/" className="feed-logo">
        <span className="logo-icon">✳</span>
        <span>snapfeed.</span>
      </Link>

      <Link to="/profile" className="profile-avatar" title="My profile">
        S
      </Link>
    </nav>
  );
}

export default FeedNavbar;
