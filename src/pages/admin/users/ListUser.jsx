import { useQuery } from "@tanstack/react-query";
import { Skeleton, Table, Tag } from "antd";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const ListUser = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/users`);
      // Trả về dữ liệu với key là id
      return response.data.map((user) => ({
        ...user,
        key: user.id, // Sử dụng id làm key
      }));
    },
  });

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },

    {
      title: "Username",
      dataIndex: "username",
      render: (text) => (
        <p className="text-base font-medium text-red-500">{text}</p>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (item) => {
        return item === "user" ? (
          <Tag color="blue">{item}</Tag>
        ) : (
          <Tag color="red">{item}</Tag>
        );
      },
    },
    {
      title: "Available",
      dataIndex: "available",
      render: (item) => {
        return item ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="red">Ngưng hoạt động</Tag>
        );
      },
    },
    {
      title: "Action",
      render: (_, item) => (
        <>
          <Link to={`/admin/users/${item.id}/update`}>
            <button className="bg-green-500 hover:bg-green-700 text-white  py-1 px-3.5 rounded mr-1">
              Update
            </button>
          </Link>
        </>
      ),
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <h2 className="uppercase font-bold text-xl text-gray-800">List users</h2>
      <hr className="border-t-4 border-yellow-500 mt-4 mb-6" />
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default ListUser;
