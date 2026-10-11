import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
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
      {/* These pages do not show the navbar */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* These pages share one navbar */}
      <Route element={<MainLayout />}>
        <Route index element={<Feed />} />
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
