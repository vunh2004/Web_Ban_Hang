import { useQuery } from "@tanstack/react-query";
import { Popconfirm, Skeleton, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import SlideShow from "./SlideShow";
import Cookies from "js-cookie";

const LayoutClient = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const nav = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/categories`);
      return response.data;
    },
  });

  const token = Cookies.get("token");
  const username = Cookies.get("username");
  const role = Cookies.get("role");

  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("token"));

  const Logout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("role");
    Cookies.remove("id");
    setIsLoggedIn(false);
    messageApi.success("Đã đăng xuất!");
    setTimeout(() => {
      nav("/");
    }, 0);
  };

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("token"));
  }, []);

  // Sử dụng useLocation để lấy đường dẫn hiện tại
  const location = useLocation();

  return (
    <>
      {contextHolder}
      <React.Fragment>
        <header className="bg-white">
          <div className=" py-3 px-6">
            <div className="flex justify-between">
              <Link to={"/"} className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                <span className="ml-2 font-semibold text-[#252C32]">
                  My Website
                </span>
              </Link>

              <div className="ml-6 flex flex-1 gap-x-3">
                <div className="flex cursor-pointer select-none items-center gap-x-2 rounded-md border bg-[#4094F7] py-2 px-4 text-white hover:bg-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <span className="text-sm font-medium">Categories</span>
                </div>

                <input
                  type="text"
                  className="w-full rounded-md border border-[#DDE2E4] px-3 py-2 text-sm"
                  placeholder="Tìm kiếm..."
                />
              </div>

              <div className="ml-2 flex">
                <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path
                      fillRule="evenodd"
                      d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Orders</span>
                </div>

                <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Favorites</span>
                </div>

                <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 hover:bg-gray-100">
                  <Link to={"/carts"} className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </Link>
                  <span className="text-sm font-medium">Cart</span>
                </div>

                {token ? (
                  <div className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border border-transparent bg-gradient-to-r from-green-400 to-blue-500 p-[1px] hover:from-green-500 hover:to-blue-600">
                    <div className="flex items-center justify-center w-full h-full rounded-md bg-white hover:bg-transparent transition-colors duration-300 ease-in-out">
                      <Popconfirm
                        title="Đăng xuất"
                        description="Bạn có chắc chắn muốn đăng xuất?"
                        onConfirm={Logout}
                      >
                        <button className="text-sm px-3 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 hover:text-white transition-all duration-300 ease-in-out">
                          Log Out
                        </button>
                      </Popconfirm>
                    </div>

                    <h3 className="text-lg text-white font-medium flex mx-1.5">
                      Hi, <span>{username}</span>
                    </h3>
                  </div>
                ) : (
                  <div className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border border-transparent bg-gradient-to-r from-green-400 to-blue-500 p-[1px] hover:from-green-500 hover:to-blue-600">
                    <Link
                      to="/account/signin"
                      className="flex items-center justify-center w-full h-full rounded-md bg-white hover:bg-transparent transition-colors duration-300 ease-in-out"
                    >
                      <button className="text-sm px-3 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 hover:text-white transition-all duration-300 ease-in-out">
                        Sign In
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-x-8 mx-auto">
                {data?.length === 0 ? (
                  <span className="text-gray-500">Không có danh mục nào</span>
                ) : (
                  data?.map((cate) => (
                    <span
                      className="cursor-pointer rounded-sm py-1 px-2 text-sm font-medium hover:bg-gray-100"
                      key={cate.id}
                    >
                      {cate.title}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hiển thị SlideShow chỉ khi đường dẫn là '/' */}
        {location.pathname === "/" && <SlideShow />}

        <main className="my-6 mx-3">
          {isLoading ? (
            <Skeleton active />
          ) : isError ? (
            <p>{error.message}</p>
          ) : (
            <Outlet />
          )}
        </main>

        <footer className="py-3 text-center text-gray-500">
          <p>© 2024 My Website. All rights reserved.</p>
        </footer>
      </React.Fragment>
    </>
  );
};

export default LayoutClient;
