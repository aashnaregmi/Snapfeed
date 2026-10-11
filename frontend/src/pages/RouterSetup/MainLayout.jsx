import { Outlet } from "react-router-dom";
import FeedNavbar from "../Feed/FeedComponent/FeedNavbar";
function MainLayout() {
  return (
    <>
      <div className="navbar-shell">
        <FeedNavbar />
      </div>

      <Outlet />
    </>
  );
}

export default MainLayout;
