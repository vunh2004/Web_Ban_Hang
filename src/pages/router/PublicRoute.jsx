import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = () => {
  // Lấy token từ cookie
  const token = Cookies.get("token");
  const location = useLocation(); // Lấy thông tin về URL hiện tại

  // Nếu có token, điều hướng về trang /account (hoặc các trang có thể khác)
  if (token) {
    return <Navigate to="/account" />;
  }

  // Kiểm tra xem người dùng đang truy cập vào trang /account mà không có token
  if (!token && location.pathname === "/account") {
    return <Navigate to="/account/signin" />;
  }

  // Nếu không có token và người dùng đang truy cập vào các trang công khai, cho phép truy cập
  return <Outlet />;
};

export default PublicRoute;
