//Form
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  Skeleton,
  Switch,
  Upload,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const ProductUpdate = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [image, setImage] = useState();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/products/${id}`);
      return response.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/categories`);
      return response.data.map((category) => ({
        ...category,
        key: category.id,
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (product) => {
      await axios.put(`http://localhost:3000/products/${id}`, product);
    },
    onSuccess() {
      messageApi.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      setTimeout(() => {
        nav("/admin/products/list");
      }, 1000);
    },
  });
  const onUploadChange = (img) => {
    if (img.file.status === "done") {
      setImage(img.file.response.secure_url);
    }
  };
  const onFinish = (values) => {
    const productImage = image || data.image;
    mutate({
      ...values,
      image: productImage,
      createdAt: data.createdAt,
      updatedAt: new Date().toISOString(),
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (isLoading) return <Skeleton active />;
  return (
    <>
      {contextHolder}
      <h2 className="uppercase font-bold text-xl text-gray-800">
        Update product
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
              message: "Title là không được bỏ trống",
            },
            {
              min: 5,
              message: "Title phải có ít nhất 5 ký tự",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Price không được bỏ trống",
            },
            {
              type: "number",
              min: 0,
              message: "Price phải >= 0",
            },
          ]}
        >
          <InputNumber type="number" />
        </Form.Item>

        <Form.Item
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            action="https://api.cloudinary.com/v1_1/dajbfnrau/image/upload"
            listType="picture-card"
            data={{ upload_preset: "web_ban_hang" }}
            onChange={onUploadChange}
          >
            <button
              style={{
                border: 0,
                background: "none",
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </button>
          </Upload>
        </Form.Item>

        {data.image ? (
          <Form.Item label="Image">
            <Image
              src={data.image}
              alt={data.title}
              className="rounded-md"
              width={200}
            />
          </Form.Item>
        ) : (
          ""
        )}

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            {
              required: true,
              message: "Quantity không được bỏ trống",
            },
            {
              type: "number",
              min: 0,
              message: "Quantity phải >= 0",
            },
          ]}
        >
          <InputNumber type="number" />
        </Form.Item>

        <Form.Item label="Description: " name={"description"}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Available"
          name="available"
          initialValue={data.available}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Category"
          name={"category"}
          rules={[{ required: true, message: "Hãy chọn danh mục sản phẩm" }]}
        >
          <Select value={data.category}>
            {categories.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
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
export default ProductUpdate;
