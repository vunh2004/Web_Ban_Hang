import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const nav = useNavigate();
  const idUser = Cookies.get("id"); // Lấy idUser từ cookies

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/carts");
        const userCartItems = response.data.filter(
          (cartItem) => cartItem.idUser === idUser
        );
        setCartItems(userCartItems);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu cart:", error);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        const allProducts = response.data;
        const productDetails = cartItems.map((cartItem) =>
          allProducts.find((product) => product.id === cartItem.idProduct)
        );
        setProducts(productDetails);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    if (cartItems.length > 0) {
      fetchProducts();
    }
  }, [cartItems]);

  const onDecrementQuantity = async (cartItemId) => {
    setCartItems((cart) =>
      cart.map((item) => {
        if (item.id === cartItemId && item.quantity > 0) {
          const updatedQuantity = item.quantity - 1;

          // Cập nhật vào cơ sở dữ liệu
          axios
            .patch(`http://localhost:3000/carts/${cartItemId}`, {
              quantity: updatedQuantity,
            })
            .catch((error) => {
              console.error("Lỗi khi cập nhật số lượng:", error);
            });

          return { ...item, quantity: updatedQuantity };
        }
        return item;
      })
    );
  };

  const onIncrementQuantity = async (cartItemId) => {
    setCartItems((cart) =>
      cart.map((item) => {
        if (item.id === cartItemId) {
          const updatedQuantity = item.quantity + 1;

          axios
            .patch(`http://localhost:3000/carts/${cartItemId}`, {
              quantity: updatedQuantity,
            })
            .catch((error) => {
              console.error("Lỗi khi cập nhật số lượng:", error);
            });

          return { ...item, quantity: updatedQuantity };
        }
        return item;
      })
    );
  };

  const totalAmount = cartItems.reduce((total, cartItem) => {
    const product = products.find((p) => p.id === cartItem.idProduct);
    return total + (product ? product.discount_price * cartItem.quantity : 0);
  }, 0);

  const onRemoveCart = async (idCart) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      await axios.delete(`http://localhost:3000/carts/${idCart}`);
      setCartItems(
        (cartItem) =>
          (cartItem = cartItems.filter((cart) => cart.id !== idCart))
      );
    }
  };

  const onFinish = async (values) => {
    // Tạo payload chứa thông tin đơn hàng và giỏ hàng
    const payload = {
      ...values, // Các giá trị khác từ form
      idUser: idUser,
      orderDate: new Date().toISOString(), // Ngày đặt hàng hiện tại
      totalAmount: totalAmount, // Tổng số tiền
      status: "Chờ xác nhận", // Trạng thái đơn hàng ban đầu
      products: cartItems.map((item) => ({
        idProduct: item.idProduct, // ID sản phẩm
        quantity: item.quantity, // Số lượng sản phẩm
      })),
    };

    try {
      // Gửi request POST để tạo đơn hàng
      const response = await axios.post(
        "http://localhost:3000/orders",
        payload
      );

      // Sau khi đặt hàng thành công, xóa từng mục trong giỏ hàng
      await Promise.all(
        cartItems.map((item) =>
          axios.delete(`http://localhost:3000/carts/${item.id}`)
        )
      );

      alert("Đặt hàng thành công!");
      nav("/orders");
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Shopping Cart
        </h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-center text-xl font-medium mb-2">
                    Giỏ hàng của bạn đang trống!
                  </div>
                  <Link
                    to="/"
                    title=""
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    Continue Shopping
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </Link>
                </div>
              ) : (
                cartItems.map((cartItem) => {
                  const product = products.find(
                    (p) => p.id === cartItem.idProduct
                  );

                  if (!product) {
                    return (
                      <div key={cartItem.id}>
                        Không có sản phẩm nào trong giỏ hàng!
                      </div>
                    );
                  }

                  return (
                    <>
                      <div
                        key={cartItem.id}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                      >
                        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                          <Link to="#" className="shrink-0 md:order-1">
                            <img
                              className="h-auto w-20 dark:hidden"
                              src={product.image}
                              alt={product.title}
                            />
                            <img
                              className="hidden h-20 w-20 dark:block"
                              src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                              alt={product.title}
                            />
                          </Link>
                          <div className="flex items-center justify-between md:order-3 md:justify-end">
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => onDecrementQuantity(cartItem.id)}
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                              >
                                {/* Decrement Icon */}
                                <svg
                                  className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 2"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M1 1h16"
                                  />
                                </svg>
                              </button>
                              <input
                                type="text"
                                className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none"
                                value={cartItem.quantity}
                                readOnly
                              />
                              <button
                                type="button"
                                onClick={() => onIncrementQuantity(cartItem.id)}
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                              >
                                {/* Increment Icon */}
                                <svg
                                  className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 18"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 1v16M1 9h16"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="text-end ml-5 md:order-4 md:w-32">
                              <p className="text-base font-bold text-gray-900 dark:text-white">
                                {(
                                  product.discount_price * cartItem.quantity
                                ).toLocaleString()}{" "}
                                VND
                              </p>
                            </div>
                          </div>
                          <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                            <Link
                              to="#"
                              className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                            >
                              {product.title}
                            </Link>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => onRemoveCart(cartItem.id)}
                                type="button"
                                className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                              >
                                {/* Remove Button */}
                                <svg
                                  className="me-1.5 h-5 w-5"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={24}
                                  height={24}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                  />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              )}
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Summary
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-base text-gray-900 dark:text-white">
                  Total Amount:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {totalAmount.toLocaleString()} VND
                </span>
              </div>
            </div>
            {cartItems.length > 0 ? (
              <div className=" rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h5 className="text-base font-semibold mb-1 text-center">
                  Thông tin người nhận
                </h5>
                <hr className="border-2 w-3/4 mx-auto border-black mb-4" />

                <Form
                  className="space-y-3"
                  name="delivery"
                  layout="vertical"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    label="Họ và Tên"
                    name="fullName"
                    className="-mb-1"
                    rules={[
                      { required: true, message: "Họ và tên là bắt buộc!" },
                    ]}
                  >
                    <Input placeholder="Nhập họ tên người nhận" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập email của bạn!",
                      },
                      { type: "email", message: "Địa chỉ email không hợp lệ!" },
                    ]}
                  >
                    <Input placeholder="Nhập email người nhận" />
                  </Form.Item>
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                      { required: true, message: "Số điện thoại là bắt buộc!" },
                      {
                        pattern: /^[0-9]{10,}$/,
                        message: "Số điện thoại không hợp lệ!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      { required: true, message: "Địa chỉ là bắt buộc!" },
                    ]}
                  >
                    <Input placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã, Tổ dân phố/Thôn(Xóm)" />
                  </Form.Item>

                  <Form.Item label="Ghi chú" name="note">
                    <Input.TextArea placeholder="Nhập ghi chú (nếu có)" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit" // Đặt type thành submit
                      className="bg-blue-600 w-full mt-2 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Checkout
                    </Button>
                  </Form.Item>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {" "}
                      or{" "}
                    </span>
                    <Link
                      to="/"
                      title=""
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                    >
                      Continue Shopping
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 12H5m14 0-4 4m4-4-4-4"
                        />
                      </svg>
                    </Link>
                  </div>
                </Form>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
