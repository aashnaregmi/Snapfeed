import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./RootLayout";
import Feed from "../Feed/Feed";
import Login from "../Login/Login";
import Register from "../Register/Register";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Feed />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>,
  ),
);

function Entry() {
  return <RouterProvider router={router} />;
}

export default Entry;
