import { useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Upload from "./pages/Upload";

function App() {
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  const [page, setPage] = useState("login");

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (accessToken) => {
    localStorage.setItem("access_token", accessToken);

    setToken(accessToken);
    setPage("feed");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    setToken(null);
    setPage("login");
  };

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!token) {
    if (page === "register") {
      return <Register goToLogin={() => setPage("login")} />;
    }

    return (
      <Login onLogin={handleLogin} goToRegister={() => setPage("register")} />
    );
  }

  // =========================
  // LOGGED IN
  // =========================

  return (
    <div>
      <nav className="navbar">
        <h2>📸 SnapFeed</h2>

        <div>
          <button onClick={() => setPage("feed")}>Feed</button>

          <button onClick={() => setPage("upload")}>Upload</button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {page === "feed" && <Feed />}

      {page === "upload" && <Upload goToFeed={() => setPage("feed")} />}
    </div>
  );
}

export default App;
