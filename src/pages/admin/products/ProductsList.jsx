import React from "react";
import {
  Button,
  Image,
  Popconfirm,
  Skeleton,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductsList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const quyryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/products`);
      // Trả về dữ liệu với key là id
      return response.data.map((product) => ({
        ...product,
        key: product.id, // Sử dụng id làm key
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/products/${id}`);
    },
    onSuccess() {
      messageApi.success("Xóa thành công!");
      quyryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image", // Hiển thị hình ảnh sản phẩm
      render: (image) => (
        <Image src={image} alt="product" width={100} className="rounded-md" />
      ),
    },
    {
      title: "Title",
      dataIndex: "title", // Hiển thị tên sản phẩm
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Price",
      dataIndex: "price", // Hiển thị giá sản phẩm
      render: (price) => `${price.toLocaleString()} VND`, // Định dạng giá
    },
    {
      title: "Quantity",
      dataIndex: "quantity", // Hiển thị số lượng
    },
    {
      title: "Available",
      dataIndex: "available",
      render: (item) => {
        return item ? (
          <Tag color="blue">CÒN HÀNG</Tag>
        ) : (
          <Tag color="red">HẾT HÀNG</Tag>
        );
      },
    },
    {
      title: "Action",
      render: (_, item) => (
        <>
          <Link to={`/admin/products/${item.id}`}>
            <button className="bg-yellow-500 hover:bg-yellow-700 text-white  py-1 px-3.5 rounded mr-1">
              View
            </button>
          </Link>
          <Link to={`/admin/products/${item.id}/update`}>
            <button className="bg-green-500 hover:bg-green-700 text-white  py-1 px-3.5 rounded mr-1">
              Update
            </button>
          </Link>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => mutate(item.id)}
          >
            <Button color="danger" variant="solid">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      {contextHolder}
      <Link to={"/admin/products/add"}>
        <Button color="primary" variant="solid" className="mb-2">
          Add new product
        </Button>
      </Link>
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default ProductsList;
