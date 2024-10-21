import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton, message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const nav = useNavigate();
  const idUser = Cookies.get("id");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/products`);
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (idProduct) => {
      // Lấy danh sách giỏ hàng hiện có
      const response = await axios.get(`http://localhost:3000/carts`);
      const carts = response.data;

      // Lấy thông tin sản phẩm để tính toán totalPrice
      const productResponse = await axios.get(
        `http://localhost:3000/products/${idProduct}`
      );
      const product = productResponse.data;

      // Tìm sản phẩm trong giỏ hàng dựa trên idUser và idProduct
      const checkProductCart = carts.find(
        (item) => item.idProduct === idProduct && item.idUser === idUser
      );

      if (checkProductCart) {
        // Nếu sản phẩm đã tồn tại, tăng quantity lên 1
        const updatedQuantity = checkProductCart.quantity + 1;
        const updatedTotalPrice = product.discount_price * updatedQuantity; // Cập nhật totalPrice

        // Cập nhật số lượng sản phẩm và totalPrice trong giỏ hàng
        await axios.put(`http://localhost:3000/carts/${checkProductCart.id}`, {
          ...checkProductCart,
          quantity: updatedQuantity,
          totalPrice: updatedTotalPrice,
        });
      } else {
        // Nếu không tồn tại, thêm sản phẩm mới vào giỏ hàng
        await axios.post(`http://localhost:3000/carts`, {
          idProduct,
          idUser, // Đảm bảo bạn đã định nghĩa idUser
          quantity: 1,
          totalPrice: product.discount_price, // Giá sản phẩm lần đầu tiên
        });
      }
    },
    onSuccess() {
      messageApi.success("Thêm sản phẩm vào giỏ hàng thành công");
      setTimeout(() => {
        nav("/carts");
      }, 10);
    },
    onError: (error) => {
      messageApi.error(`Lỗi: ${error.message}`);
    },
  });

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      {contextHolder}
      <div className="flex flex-wrap justify-center gap-6 p-6">
        {data.map((product) =>
          product.available ? (
            <div
              key={product.id}
              className="bg-gray-800 rounded-lg p-6 w-1/5 text-center text-white"
            >
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-4/5 mx-auto h-auto mb-5"
                />
              </Link>
              <p className="font-semibold mb-2">{product.title}</p>
              <p className="mb-1">
                <span className="text-lg font-bold">
                  {product.discount_price.toLocaleString()}đ
                </span>
                <br />
                <span className="line-through text-gray-400 ml-2">
                  {product.price.toLocaleString()}đ
                </span>
                <span className="text-yellow-500 ml-2">
                  {Math.round(
                    ((product.discount_price - product.price) /
                      product.discount_price) *
                      100
                  )}
                  %
                </span>
              </p>
              {Math.round(
                ((product.discount_price - product.price) /
                  product.discount_price) *
                  100
              ) < -10 ? (
                <p className="text-yellow-400">Online giá rẻ quá</p>
              ) : (
                ""
              )}
              <div>
                <button
                  onClick={() => mutate(product.id)}
                  className="relative px-7 rounded mt-3 py-2 overflow-hidden group bg-gradient-to-r from-blue-600 to-green-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 text-white transition-all ease-out duration-300"
                >
                  <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-20 -skew-x-12 group-hover:-translate-x-36 ease"></span>
                  <span className="relative text-lg font-semibold">
                    Mua ngay
                  </span>
                </button>
              </div>
            </div>
          ) : (
            ""
          )
        )}
      </div>
    </>
  );
};

export default Home;
