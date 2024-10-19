import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

// Component PrivateRoute
const PrivateRoute = () => {
  // Lấy token từ cookie
  const token = Cookies.get("token");
  const role = Cookies.get("role");

  // Nếu có token thì render component (tức là cho phép truy cập)
  // Nếu không có token, điều hướng tới trang đăng nhập
  if (!token) {
    return <Navigate to={"/account/signin"} />;
  } else {
    if (role === "admin") {
      return <Outlet />;
    } else {
      return <Navigate to={"/"} />;
    }
  }
};

export default PrivateRoute;
