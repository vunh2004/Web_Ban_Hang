import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
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
import { useNavigate } from "react-router-dom";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ProductAdd = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [image, setImage] = useState();

  const { data, isLoading, isError } = useQuery({
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
      await axios.post(`http://localhost:3000/products`, product);
    },
    onSuccess() {
      messageApi.success("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setTimeout(() => {
        nav("/admin/products/list");
      }, 1000);
    },
    onError() {
      messageApi.error("Có lỗi xảy ra khi thêm sản phẩm!");
    },
  });

  const onUploadChange = (img) => {
    if (img.file.status === "done") {
      setImage(img.file.response.secure_url);
    }
  };

  const onFinish = (values) => {
    mutate({ ...values, image, createdAt: new Date().toISOString() });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (isLoading) return <Skeleton active />;

  return (
    <>
      {contextHolder}
      <h2 className="uppercase ml-44 font-bold text-xl text-gray-800">
        Add new products
      </h2>
      <hr className="border-t-4 border-yellow-500 mt-4 mb-6" />
      <Form
        form={form} // Sử dụng form để quản lý giá trị
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
        initialValues={{
          remember: true,
        }}
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
          label="Discount price"
          name="discount_price"
          rules={[
            {
              type: "number",
              min: 0,
              message: "Discount price phải >= 0",
            },
            {
              validator: (_, value) => {
                const price = form.getFieldValue("price");
                console.log("Price: ", price, " Discount Price: ", value);
                if (value !== undefined && value > price) {
                  return Promise.reject(
                    new Error("Discount price phải nhỏ hơn price!")
                  );
                }
                return Promise.resolve();
              },
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

        <Form.Item label="Available" name="available">
          <Switch />
        </Form.Item>

        <Form.Item
          label="Category"
          name={"category"}
          rules={[{ required: true, message: "Hãy chọn danh mục sản phẩm" }]}
        >
          <Select>
            {data.map((cate) => (
              <Select.Option value={cate?.id} key={cate?.id}>
                {cate?.title}
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

export default ProductAdd;
