import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";

const AccountInfor = () => {
  const idUser = Cookies.get("id");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", idUser],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/users/${idUser}`);
      return response.data;
    },
  });
  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <div>
      <div className="max-w-4xl mx-auto mt-10">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-semibold text-center mb-4">
          Tài khoản của bạn
        </h1>
        {/* Gạch dưới tiêu đề */}
        <div className="w-16 h-1 bg-black mx-auto mb-6"></div>

        {/* Thông tin tài khoản */}
        <div className="border-t border-gray-300 pt-6">
          <h2 className="text-lg font-semibold uppercase tracking-wider mb-4">
            Thông tin tài khoản
          </h2>

          {/* Tên người dùng */}
          <p className="text-lg font-medium mb-2">{data.username}</p>

          {/* Email */}
          <p className="text-gray-600 mb-2">{data.email}</p>

          <p className="text-gray-600 mb-4">{data.birthday}</p>

          {/* Đường dẫn xem địa chỉ */}
          {/* <Link to="/account/address" className="text-blue-500 hover:underline">
            Xem địa chỉ
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default AccountInfor;
