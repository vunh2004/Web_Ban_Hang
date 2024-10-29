import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Skeleton, Table, Tag, message } from "antd";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const ListOrders = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/orders`);
      return response.data.map((order) => ({
        ...order,
        key: order.id, // Sử dụng id làm key
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/orders/${id}`);
    },
    onSuccess() {
      messageApi.success("Xóa đơn hàng thành công!");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError() {
      messageApi.error("Xóa đơn hàng thất bại!");
    },
  });

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },

    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      render: (id) => {
        return <>#{id}</>;
      },
    },
    {
      title: "Người nhận",
      dataIndex: "fullName",
    },
    {
      title: "Tổng",
      dataIndex: "totalAmount",
      render: (total) => {
        return (
          <span className="font-semibold">{total.toLocaleString()} VND</span>
        );
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      render: (date) => format(new Date(date), "dd-MM-yyyy"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "Đã xác nhận":
            color = "gold";
            break;
          case "Đang vận chuyển":
            color = "green";
            break;
          case "Đã nhận hàng":
            color = "yellow";
            break;
          case "Đã hủy":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      render: (_, item) => (
        <>
          <Link to={`/admin/orders/${item.id}/update`}>
            <button className="bg-green-500 hover:bg-green-700 text-white  py-1 px-3.5 rounded mr-1">
              Update
            </button>
          </Link>
          <Popconfirm
            title="Xóa đơn hàng"
            description="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => mutate(item.id)}
          >
            <button className="bg-red-500 hover:bg-red-700 text-white  py-1 px-3.5 rounded mr-1">
              Delete
            </button>
          </Popconfirm>
          <div className="mt-1 ml-12">
            <Link to={`/admin/orders/${item.id}`}>
              <button className="bg-yellow-500 hover:bg-yellow-700 text-white  py-1 px-3.5 rounded mr-1">
                View
              </button>
            </Link>
          </div>
        </>
      ),
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      {contextHolder}
      <h2 className="uppercase font-bold text-xl text-gray-800">List Orders</h2>
      <hr className="border-t-4 border-yellow-500 mt-4 mb-6" />
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default ListOrders;
