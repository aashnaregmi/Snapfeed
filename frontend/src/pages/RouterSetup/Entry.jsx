import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import RootLayout from "./RootLayout";
import MainLayout from "./MainLayout";

import Feed from "../Feed/Feed";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Profile from "../Profile/Profile";
import Upload from "../Upload/Upload";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* Authentication pages */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* Pages sharing the main navbar */}
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="profile" element={<Profile />} />
        <Route path="upload" element={<Upload />} />
      </Route>
    </Route>,
  ),
);

function Entry() {
  return <RouterProvider router={router} />;
}

export default Entry;
