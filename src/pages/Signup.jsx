import React from "react";
import { Form, Input, Button, Card, DatePicker, Select, message } from "antd";
import "antd/dist/reset.css";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const { Option } = Select;

const Signup = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const nav = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async (user) => {
      await axios.post("http://localhost:3000/signup", user);
    },
    onSuccess() {
      messageApi.success("Sign up successfully!");
      setTimeout(() => {
        nav("/signin");
      }, 1000);
    },
    onError(err) {
      messageApi.error(err.response.data);
    },
  });
  const onFinish = (values) => {
    mutate({ ...values, role: "user" });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <div
        className="w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cdn.hpdecor.vn/wp-content/uploads/2021/08/thiet-ke-sieu-thi-dien-thoai-di-dong-mai-linh-mobile-120m2-tai-nam-dinh-3.jpg')",
          minHeight: "100vh", // Ensures it covers the full viewport height
        }}
      >
        <div className="flex items-center justify-center w-full mx-auto py-10">
          {" "}
          {/* Added padding to center the card */}
          <Card className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-semibold text-center text-blue-600 mb-2">
              Sign Up
            </h2>
            <hr className="border-t-2 border-blue-600 mb-6 w-1/2 mx-auto" />

            <Form
              name="signup"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item label="Username" name="username">
                <Input
                  size="large"
                  placeholder="Enter your username"
                  className="text-sm px-3 py-2"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email cannot be empty!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  className="text-sm px-3 py-2"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password cannot be empty!" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  className="text-sm px-3 py-2"
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Confirm password không trúng khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Confirm your password"
                  className="text-sm px-3 py-2"
                />
              </Form.Item>

              <Form.Item label="Birthday" name="birthday">
                <DatePicker
                  className="w-full"
                  placeholder="Select your birthday"
                  style={{ borderRadius: "4px" }}
                />
              </Form.Item>

              <Form.Item
                label="Gender"
                name="gender"
                rules={[
                  { required: true, message: "Please select your gender!" },
                ]}
              >
                <Select
                  placeholder="Select your gender"
                  size="large"
                  className="w-full"
                >
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-blue-600 text-white font-semibold rounded-md mt-4 py-2 px-10 transition-all duration-300 transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg w-full"
                >
                  Sign Up
                </Button>
              </Form.Item>

              <div className="flex justify-end mt-4">
                <span className="text-gray-700">Already have an account? </span>
                <Link
                  to={"/signin"}
                  className="text-red-400 hover:text-red-600 font-semibold hover:underline ml-2 transition duration-300 transform hover:scale-105"
                >
                  Sign In Now
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Signup;
