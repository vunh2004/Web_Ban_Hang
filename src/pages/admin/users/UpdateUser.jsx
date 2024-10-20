import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Skeleton,
  Switch,
  message,
} from "antd";
import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
import moment from "moment";

const { Option } = Select;

const UpdateUser = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/users/${id}`);
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (user) => {
      console.log("Dữ liệu gửi lên server:", user);
      await axios.put(`http://localhost:3000/users/${id}`, user);
    },
    onSuccess() {
      messageApi.success("Cập nhật thông tin người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setTimeout(() => {
        nav("/admin/users/list");
      }, 1000);
    },
    onError: (error) => {
      messageApi.error(
        `Cập nhật thất bại: ${error.response?.data?.message || error.message}`
      );
    },
  });

  const onFinish = (values) => {
    console.log("Dữ liệu nhập vào:", values);

    if (values.birthday) {
      values.birthday = values.birthday.format("YYYY-MM-DD"); // Chuyển đổi ngày sinh về định dạng cần thiết
    }

    // Gửi yêu cầu cập nhật
    mutate({
      ...values,
      // Nếu bạn muốn cho phép người dùng cập nhật mật khẩu:
      password: data?.confirmPassword, // Lưu mật khẩu mới nếu nhập, nếu không thì giữ mật khẩu cũ
      confirmPassword: data?.confirmPassword,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Kiểm tra và chuyển đổi birthday sang định dạng hợp lệ
  const initialValues = data
    ? {
        ...data,
        birthday: data.birthday ? moment(data.birthday, "YYYY-MM-DD") : null, // Đảm bảo ngày có định dạng ISO
      }
    : {};

  if (isLoading) return <Skeleton active />;
  if (isError) {
    messageApi.error(`Lỗi: ${error.message}`);
    return null;
  }

  return (
    <>
      {contextHolder}
      <h2 className="uppercase font-bold text-xl text-gray-800">Update user</h2>
      <hr className="border-t-4 border-yellow-500 mt-4 mb-6" />
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Username không được bỏ trống" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="password" className="hidden">
          <Input />
        </Form.Item>
        <Form.Item name="confirmPassword" className="hidden">
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email không được bỏ trống" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Birthday" name="birthday">
          <DatePicker
            className="w-full"
            placeholder="DD-MM-YYYY"
            format="DD-MM-YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
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

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn role!" }]}
        >
          <Select
            placeholder="Select your role"
            size="large"
            className="w-full"
          >
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Available"
          name={"available"}
          valuePropName="checked" // Đảm bảo trạng thái được lưu đúng
          initialValue={data.available}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <button
            type="reset"
            className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3.5 rounded mr-1"
          >
            Reset
          </button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UpdateUser;
