import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm, Skeleton, Table, message } from "antd";
import axios from "axios";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

const ListCategory = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  // Fetch categories and products
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const [categoryResponse, productResponse] = await Promise.all([
        axios.get(`http://localhost:3000/categories`),
        axios.get(`http://localhost:3000/products`),
      ]);

      const products = productResponse.data;
      const categoriesWithQuantity = categoryResponse.data.map((category) => {
        const quantityProduct = products.filter(
          (product) => product.category === category.id
        ).length;

        return {
          ...category,
          key: category.id, // Sử dụng id làm key
          quantityProduct, // Tổng số lượng sản phẩm thuộc danh mục này
        };
      });

      return categoriesWithQuantity;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/categories/${id}`);
    },
    onSuccess() {
      messageApi.success("Xóa danh mục thành công!");
      // Invalidating queries to refetch categories and products
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title", // Hiển thị tên danh mục
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Quantity product",
      dataIndex: "quantityProduct", // Hiển thị số lượng sản phẩm thuộc danh mục
    },

    {
      title: "Action",
      render: (_, item) => (
        <>
          <Link to={`/admin/categories/${item.id}/update`}>
            <button className="bg-green-500 hover:bg-green-700 text-white py-1 px-3.5 rounded mr-1">
              Update
            </button>
          </Link>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
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
      <h2 className="uppercase font-bold text-xl text-gray-800">
        List category
      </h2>
      <hr className="border-t-4 border-yellow-500 mt-4 mb-6" />
      <Link to={"/admin/categories/add"}>
        <Button color="primary" variant="solid" className="mb-2">
          Add new category
        </Button>
      </Link>
      <Table columns={columns} dataSource={categories} />
    </>
  );
};

export default ListCategory;
