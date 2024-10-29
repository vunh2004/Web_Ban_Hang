import React, { useEffect, useState } from "react";
import { Table, Tag, Pagination, Popconfirm, message, Skeleton } from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hàm chuyển đổi định dạng ngày
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Trả về định dạng DD-MM-YYYY
};

const Orders = () => {
  const [orders, setOrders] = useState([]); // Khởi tạo với mảng rỗng
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const idUser = Cookies.get("id");

  const {
    data: allOrders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/orders`);
      return response.data;
    },
  });

  useEffect(() => {
    if (allOrders) {
      const userOrders = allOrders.filter((order) => order.idUser === idUser);
      setOrders(userOrders);
    }
  }, [allOrders, idUser]);

  const { mutate: cancelOrder } = useMutation({
    mutationFn: async (id) => {
      const response = await axios.get(`http://localhost:3000/orders/${id}`);
      const currentOrder = response.data;

      const updatedOrder = {
        ...currentOrder,
        status: "Đã hủy",
      };

      await axios.put(`http://localhost:3000/orders/${id}`, updatedOrder);
      return updatedOrder; // Trả về đơn hàng đã cập nhật
    },
    onSuccess(updatedOrder) {
      messageApi.success("Hủy đơn hàng thành công!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    },
    onError() {
      messageApi.error("Hủy đơn hàng thất bại!");
    },
  });

  const { mutate: receivedOrder } = useMutation({
    mutationFn: async (id) => {
      const response = await axios.get(`http://localhost:3000/orders/${id}`);
      const currentOrder = response.data;

      const updatedOrder = {
        ...currentOrder,
        status: "Đã nhận hàng",
      };

      await axios.put(`http://localhost:3000/orders/${id}`, updatedOrder);
      return updatedOrder; // Trả về đơn hàng đã cập nhật
    },
    onSuccess(updatedOrder) {
      messageApi.success("Nhận hàng thành công");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    },
    onError() {
      messageApi.error("Nhận hàng thất bại!");
    },
  });

  // Chỉ ánh xạ khi orders có dữ liệu
  const data = orders.map((order, index) => ({
    key: order.id || index,
    stt: index + 1,
    orderDate: formatDate(order.orderDate),
    address: order.address,
    totalAmount: order.totalAmount,
    status: order.status,
  }));

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
    },
    {
      title: "Tổng",
      dataIndex: "totalAmount",
      render: (total) => <span>{total.toLocaleString()} VND</span>,
    },
    {
      title: "Địa chỉ nhận hàng",
      dataIndex: "address",
    },
    {
      title: "Trạng thái",
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
      title: "",
      render: (_, order) => {
        const orderId = order.key;
        return (
          <>
            <Link to={`/orders/${orderId}`}>
              <button className="bg-blue-500 text-white hover:bg-blue-600 rounded px-3 py-1 transition duration-200">
                View
              </button>
            </Link>{" "}
            {order?.status === "Đang giao hàng" ? (
              <Popconfirm
                title="Đã nhận hàng"
                description="Bạn có chắc chắn đã nhận hàng?"
                onConfirm={() => receivedOrder(orderId)}
              >
                <button className="bg-green-500 text-white hover:bg-green-600 rounded px-3 py-1 transition duration-200">
                  Đã nhận hàng
                </button>
              </Popconfirm>
            ) : (
              ""
            )}{" "}
            {order?.status === "Chờ xác nhận" ||
            order?.status === "Đã xác nhận" ? (
              <Popconfirm
                title="Hủy đơn hàng"
                description="Bạn có chắc chắn muốn hủy đơn hàng này?"
                onConfirm={() => cancelOrder(orderId)}
              >
                <button className="bg-red-500 text-white hover:bg-red-600 rounded px-3 py-1 transition duration-200">
                  Hủy
                </button>
              </Popconfirm>
            ) : (
              ""
            )}{" "}
          </>
        );
      },
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <>
      {contextHolder}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Order History
        </h1>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          className="shadow-lg rounded-lg"
        />
        <Pagination
          className="mt-4"
          defaultCurrent={1}
          total={data.length}
          pageSize={1}
        />
      </div>
    </>
  );
};

export default Orders;
