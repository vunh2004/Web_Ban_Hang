import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Skeleton,
  Switch,
  Typography,
  message,
} from "antd";
import axios from "axios";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const { Title } = Typography;

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const nav = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

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
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/products/${id}`);
    },
    onSuccess() {
      messageApi.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      setTimeout(() => {
        nav("/admin/products/list");
      }, 1000);
    },
  });

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      {contextHolder}

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Form.Item>
          <h2 className="uppercase  font-bold text-xl text-gray-800">
            {data.title}
          </h2>
          <hr className="border-t-4 border-yellow-500 mt-4 mb-6" />
        </Form.Item>
        <Form.Item label="Image">
          <Image
            src={data.image}
            alt={data.title}
            width={"200px"}
            className="rounded-md"
          />
        </Form.Item>
        <Form layout="vertical">
          <Form.Item label="Price: ">
            <InputNumber value={data.price} readOnly /> VND
          </Form.Item>
          <Form.Item label="Discount price: ">
            <InputNumber value={data.discount_price} readOnly /> VND
          </Form.Item>
          <Form.Item label="Quantity: ">
            <InputNumber value={data.quantity} readOnly />
          </Form.Item>
          <Form.Item label="Available: ">
            <Switch checked={data?.available} disabled />
          </Form.Item>

          <Form.Item label="Description: ">
            <Input.TextArea rows={4} value={data.description} readOnly />
          </Form.Item>

          <div className="flex">
            <Form.Item className="mr-5" label="Created At: " name={"createdAt"}>
              <DatePicker defaultValue={moment(data?.createdAt)} disabled />
            </Form.Item>
            <Form.Item label="Updated At: " name={"updatedAt"}>
              <DatePicker defaultValue={moment(data?.updatedAt)} disabled />
            </Form.Item>
          </div>

          <Form.Item label="Category: ">
            <Select value={data.category}>
              {categories.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Link to={`/admin/products/${id}/update`}>
              <button className="bg-green-500 hover:bg-green-700 text-white py-1 px-3.5 rounded mr-1">
                Update
              </button>
            </Link>
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có chắc chắn muốn xóa sản phẩm này?"
              onConfirm={() => mutate(id)}
            >
              <Button color="danger" variant="solid">
                Delete
              </Button>
            </Popconfirm>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ProductDetail;
