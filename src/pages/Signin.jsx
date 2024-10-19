import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import "antd/dist/reset.css";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const Signin = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const nav = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async (user) => {
      const response = await axios.post("http://localhost:3000/signin", user);
      return response.data;
    },
    onSuccess(data) {
      // console.log(data.user.role);
      Cookies.set("token", data.accessToken, { expires: 1 / 24, path: "/" });
      Cookies.set("role", data.user.role, { expires: 1 / 24, path: "/" });
      Cookies.set("username", data.user.username, {
        expires: 1 / 24,
        path: "/",
      });
      Cookies.set("id", data.user.id, { expires: 1 / 24, path: "/" });

      messageApi.success("Sign in successfully!");
      setTimeout(() => {
        nav("/");
      }, 1000);
    },
    onError(err) {
      messageApi.error(err.response.data);
    },
  });
  const onFinish = (values) => {
    mutate({ ...values, role: "user", available: true });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <div
        className="h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cdn.hpdecor.vn/wp-content/uploads/2021/08/thiet-ke-sieu-thi-dien-thoai-di-dong-mai-linh-mobile-120m2-tai-nam-dinh-3.jpg')",
        }}
      >
        <div className="flex items-center justify-center w-6/12 mx-auto h-full">
          <Card className="bg-white bg-opacity-90 p-5 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-1.5">
              Sign In
            </h2>
            <hr className="border-t-2 border-blue-600 mb-5 w-1/2 mx-auto" />

            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được bỏ trống!" },
                  { type: "email", message: "Email không hợp lệ!!" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  className="text-sm  px-3 py-2"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password không được bỏ trống!" },
                  { min: 6, message: "Password phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  className="text-sm  px-3 py-2"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-blue-600 ml-28 text-white font-semibold rounded-md py-2 px-10 transition-all duration-300 transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                >
                  Sign In
                </Button>
              </Form.Item>
              <div className="flex justify-end mt-4">
                <span className="text-gray-700">Create an account? </span>
                <Link
                  to={"/account/signup"}
                  className="text-red-400 hover:text-red-600 font-semibold hover:underline ml-2 transition duration-300 transform hover:scale-105"
                >
                  Sign Up Now
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Signin;
