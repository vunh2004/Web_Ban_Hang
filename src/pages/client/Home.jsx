import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/products`);
      return response.data;
    },
  });

  const formatPriceToVND = () => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <div className="flex flex-wrap justify-center gap-6 p-6">
        {data.map((product, index) => (
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
              <button class="relative px-7 rounded mt-3 py-2 overflow-hidden group bg-gradient-to-r from-blue-600 to-green-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 text-white transition-all ease-out duration-300">
                <span class="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-20 -skew-x-12 group-hover:-translate-x-36 ease"></span>
                <span class="relative text-lg font-semibold">Mua ngay</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
