import React from "react";

import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
