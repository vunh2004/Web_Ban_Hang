import React, { useEffect, useState } from "react";
import { Table, Tag, Pagination, Button } from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";

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
  const idUser = Cookies.get("id");

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`http://localhost:3000/orders`);
        const userOrder = response.data.filter(
          (order) => order.idUser === idUser
        );
        setOrders(userOrder);
      } catch (error) {
        alert(error);
      }
    })();
  }, [idUser]);

  // Chỉ ánh xạ khi orders có dữ liệu
  const data = orders.map((order, index) => ({
    key: order.id || index,
    stt: index + 1,
    orderDate: formatDate(order.orderDate), // Sử dụng hàm formatDate để chuyển đổi
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
        const orderId = order.key; // Sử dụng order.key làm orderId
        return (
          <Link to={`/orders/${orderId}`}>
            <Button type="primary" variant="solid">
              View
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
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
  );
};

export default Orders;
