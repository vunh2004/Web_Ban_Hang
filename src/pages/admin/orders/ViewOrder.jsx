import {
  Card,
  Divider,
  Form,
  Input,
  List,
  Avatar,
  Typography,
  Tag,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewOrder = () => {
  const [order, setOrder] = useState(null);
  const [allProduct, setAllProduct] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (order && order.products.length > 0) {
          const idProducts = order.products.map((product) => product.idProduct);
          const productRequests = idProducts.map((id) =>
            axios.get(`http://localhost:3000/products/${id}`)
          );

          const productResponses = await Promise.all(productRequests);
          const productsOrder = productResponses.map((item) => item.data);
          setAllProduct(productsOrder);
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi lấy thông tin sản phẩm: " + error.message);
      }
    };

    fetchProducts();
  }, [order]);

  const onFinish = (values) => {
    // Handle form submission
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <h2 className="uppercase ml-44 font-bold text-xl text-gray-800">
        Đơn hàng #{order?.id}
      </h2>
      <hr className="border-t-4 border-yellow-500 mt-4 mb-6" />

      <Card className="mb-4">
        <Divider orientation="left">Thông tin sản phẩm</Divider>
        <List
          itemLayout="vertical"
          dataSource={allProduct}
          renderItem={(product) => (
            <List.Item>
              <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                <Avatar
                  src={product.image}
                  alt={product.title}
                  size={100}
                  className="border p-1.5 rounded-lg shadow-lg"
                />
                <div className="w-full flex flex-col bg-white shadow-lg rounded-lg p-4 border border-gray-200 space-y-2">
                  <Typography.Title
                    level={5}
                    className="text-gray-800 font-semibold"
                  >
                    {product.title}
                  </Typography.Title>

                  <div className="flex items-center justify-between">
                    <Typography.Text className="text-gray-600">
                      Đơn giá:
                    </Typography.Text>
                    <Typography.Text className="font-medium text-yellow-600">
                      {product.discount_price.toLocaleString()} VNĐ
                    </Typography.Text>
                  </div>

                  <div className="flex items-center justify-between">
                    <Typography.Text className="text-gray-600">
                      Số lượng:
                    </Typography.Text>
                    <Typography.Text className="font-medium">
                      {
                        order?.products.find((p) => p.idProduct === product.id)
                          ?.quantity
                      }
                    </Typography.Text>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-300 pt-2">
                    <Typography.Text className="text-gray-600 font-medium">
                      Tổng cộng:
                    </Typography.Text>
                    <Typography.Text className="text-red-600 font-semibold">
                      {(
                        order?.products.find((p) => p.idProduct === product.id)
                          ?.quantity * product.discount_price
                      ).toLocaleString()}{" "}
                      VNĐ
                    </Typography.Text>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />

        {/* Thông tin chung về đơn hàng */}
        <div className="mt-4 p-4  ">
          <div className="flex items-center justify-between  ">
            <Typography.Text className="text-gray-600 font-medium">
              Thành tiền:
            </Typography.Text>
            <Typography.Text className="text-red-600 font-semibold">
              {order?.totalAmount.toLocaleString()} VNĐ
            </Typography.Text>
          </div>

          <div className="flex items-center justify-between border-b border-gray-300 py-2">
            <Typography.Text className="text-gray-600">
              Ngày đặt:
            </Typography.Text>
            <Typography.Text className="font-medium text-gray-600">
              {order?.orderDate
                ? new Date(order.orderDate).toLocaleDateString()
                : "N/A"}
            </Typography.Text>
          </div>

          <div className="flex items-center justify-between py-2">
            <Typography.Text className="text-gray-600">
              Trạng thái:
            </Typography.Text>
            <Typography.Text className="font-medium text-blue-600">
              {order?.status === "Đã nhận hàng" ? (
                <Tag className="text-base p-1" color="yellow">
                  {order?.status}
                </Tag>
              ) : (
                <Tag className="text-base p-1" color="blue">
                  {order?.status}
                </Tag>
              )}
            </Typography.Text>
          </div>
        </div>
      </Card>

      <Card className="shadow-lg rounded-lg mb-4">
        <Divider
          orientation="left"
          className="font-semibold text-lg text-gray-800"
        >
          Thông tin người nhận
        </Divider>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-1">
            <Typography.Text className="font-medium text-gray-700">
              Tên người nhận:
            </Typography.Text>
            <Typography.Text className="text-gray-800">
              {order?.fullName || "N/A"}
            </Typography.Text>
          </div>
          <div className="flex justify-between mb-1">
            <Typography.Text className="font-medium text-gray-700">
              Email:
            </Typography.Text>
            <Typography.Text className="text-gray-800">
              {order?.email || "N/A"}
            </Typography.Text>
          </div>
          <div className="flex justify-between mb-1">
            <Typography.Text className="font-medium text-gray-700">
              Địa chỉ:
            </Typography.Text>
            <Typography.Text className="text-gray-800">
              {order?.address || "N/A"}
            </Typography.Text>
          </div>
          <div className="flex justify-between mb-1">
            <Typography.Text className="font-medium text-gray-700">
              Số điện thoại:
            </Typography.Text>
            <Typography.Text className="text-gray-800">
              {order?.phoneNumber || "N/A"}
            </Typography.Text>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ViewOrder;
