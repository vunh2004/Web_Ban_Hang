import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div class="bg-gray-100 -mt-40 flex items-center justify-center h-screen">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-gray-300">404</h1>
        <p class="text-2xl font-semibold text-gray-700 mt-4">
          Không tìm thấy trang
        </p>
        <p class="text-gray-500 mt-2">
          Trang bạn đang tìm kiếm có thể đã bị xóa, chuyển đi, thay đổi link
          hoặc chưa bao giờ tồn tại.
        </p>
        <br />
        <Link
          to={"/"}
          class="mt-6 bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-400"
        >
          TRỞ VỀ TRANG CHỦ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
