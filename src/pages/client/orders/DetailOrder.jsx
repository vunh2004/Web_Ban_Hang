import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Đừng quên import axios

const OrderDetail = () => {
  const [orders, setOrders] = useState(null); // Khởi tạo với null
  const [allProducts, setAllProducts] = useState([]); // Đổi tên biến cho dễ hiểu
  const { id } = useParams(); // Lấy ID đơn hàng từ URL

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`http://localhost:3000/orders/${id}`);
        setOrders(response.data);
        console.log("Orders đã được lấy:", response.data); // Log orders
      } catch (error) {
        alert("Có lỗi xảy ra khi lấy dữ liệu: " + error.message);
      }
    })();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (orders && orders.products.length > 0) {
          const idProducts = orders.products.map(
            (product) => product.idProduct
          );
          console.log("ID sản phẩm:", idProducts); // Log danh sách ID sản phẩm

          const productRequests = idProducts.map((id) =>
            axios.get(`http://localhost:3000/products/${id}`)
          );

          const productResponses = await Promise.all(productRequests);
          console.log(productResponses);
          const fetchedProducts = productResponses.map((res) => res.data);
          const productsWithQuantities = fetchedProducts.map(
            (product, index) => ({
              ...product,
              quantity: orders.products[index].quantity, // Gán số lượng từ đơn hàng
            })
          );
          console.log(productsWithQuantities);
          setAllProducts(productsWithQuantities); // Sử dụng tên biến đã đặt
          console.log("Sản phẩm đã lấy:", productsWithQuantities); // Log thông tin sản phẩm
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi lấy thông tin sản phẩm: " + error.message);
      }
    };

    // Gọi fetchProducts bất kể orders đã có hay chưa,
    // nhưng sẽ không làm gì nếu không có đơn hàng
    fetchProducts();
  }, [orders]); // Thêm orders vào dependency array để tránh cảnh báo về hooks

  // Kiểm tra nếu orders chưa có dữ liệu
  if (!orders) {
    return <div>Đang tải dữ liệu...</div>; // Hiển thị thông báo đang tải
  }

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.image}
            alt={record.name}
            className="w-12 h-12 object-cover rounded-md border border-gray-200 mr-2"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "discount_price",
      render: (text) => `$${text.toLocaleString()}`, // Định dạng giá
    },
    {
      title: "Tổng",
      render: (text, record) =>
        `$${(record.discount_price * record.quantity).toLocaleString()}`,
    },
  ];

  // Tạo dataSource từ allProducts
  const dataSource = allProducts.map((product) => ({
    key: product.id,
    ...product,
  }));

  return (
    <div className="container mx-auto p-6 flex flex-col md:flex-row">
      {/* Bên trái: Danh sách sản phẩm */}
      <div className="flex-1 mr-4">
        <h2 className="text-2xl font-semibold mb-4">Sản phẩm trong đơn hàng</h2>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          className="shadow-lg"
        />
      </div>

      {/* Bên phải: Thông tin đơn hàng và thông tin người nhận */}
      <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Chi tiết đơn hàng #{id}
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Thông tin đơn hàng</h2>
        <p className="text-gray-600">
          <strong>Ngày đặt:</strong> {orders.orderDate}
        </p>
        <p className="text-gray-600">
          <strong>Tổng số tiền:</strong> {orders.totalAmount.toLocaleString()}{" "}
          VND
        </p>
        <p className="text-gray-600">
          <strong>Trạng thái:</strong>
          <Tag
            color={orders.status === "Pending" ? "gold" : "green"}
            className="ml-2"
          >
            {orders.status}
          </Tag>
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">
          Thông tin người nhận
        </h2>
        <p className="text-gray-600">
          <strong>Tên:</strong> {orders.fullName}
        </p>
        <p className="text-gray-600">
          <strong>Email:</strong> {orders.email}
        </p>
        <p className="text-gray-600">
          <strong>Địa chỉ:</strong> {orders.address}
        </p>
        <p className="text-gray-600">
          <strong>Số điện thoại:</strong> {orders.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
