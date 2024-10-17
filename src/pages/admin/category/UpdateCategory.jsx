import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Skeleton, message } from "antd";
import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCategory = () => {
  const nav = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/categories/${id}`
      );
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (category) => {
      await axios.put(`http://localhost:3000/categories/${id}`, category);
    },
    onSuccess() {
      messageApi.success("Cập nhật danh mục thành công!");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setTimeout(() => {
        nav("/admin/categories/list");
      }, 1000);
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (isLoading) return <Skeleton active />;
  return (
    <>
      {contextHolder}
      <h2 className="uppercase ml-44 font-bold text-xl text-gray-800">
        Update category
      </h2>
      <hr className="border-t-4 border-yellow-500 mt-4 mb-6" />
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={data}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Title không được bỏ trống!",
            },
            {
              min: 3,
              message: "Title phải có ít nhất 3 ký tự",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <button
            type="reset"
            className="bg-yellow-500 hover:bg-yellow-700 text-white  py-1 px-3.5 rounded mr-1"
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
export default UpdateCategory;
