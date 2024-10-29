import {
  Card,
  Divider,
  Form,
  Input,
  List,
  Avatar,
  Typography,
  Button,
  message,
  Select,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateOrder = () => {
  const [order, setOrder] = useState(null);
  const [allProduct, setAllProduct] = useState([]);
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [formReceiver] = Form.useForm(); // Khai báo form cho thông tin người nhận
  const [formStatus] = Form.useForm(); // Khai báo form cho trạng thái đơn hàng
  const nav = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/orders/${id}`);
        setOrder(response.data);
        // Cập nhật giá trị form khi order được lấy thành công
        formReceiver.setFieldsValue({
          fullName: response.data.fullName,
          email: response.data.email,
          address: response.data.address,
          phoneNumber: response.data.phoneNumber,
        });
        formStatus.setFieldsValue({
          status: response.data.status, // Cập nhật trạng thái
        });
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
    fetchOrder();
  }, [id, formReceiver, formStatus]);

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

  const onFinishStatusUpdate = async (values) => {
    try {
      // Lấy thông tin hiện tại của đơn hàng
      const response = await axios.get(`http://localhost:3000/orders/${id}`);
      const currentOrder = response.data;

      // Tạo payload chỉ với thông tin cần cập nhật
      const updatedOrder = {
        ...currentOrder, // Giữ lại tất cả thông tin cũ
        status: values.status, // Cập nhật trạng thái mới
      };

      await axios.put(`http://localhost:3000/orders/${id}`, updatedOrder);
      messageApi.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const onFinishReceiverUpdate = async (values) => {
    try {
      // Lấy thông tin hiện tại của đơn hàng
      const response = await axios.get(`http://localhost:3000/orders/${id}`);
      const currentOrder = response.data;

      // Tạo payload chỉ với thông tin cần cập nhật
      const updatedOrder = {
        ...currentOrder, // Giữ lại tất cả thông tin cũ
        fullName: values.fullName, // Cập nhật tên người nhận
        email: values.email, // Cập nhật email
        address: values.address, // Cập nhật địa chỉ
        phoneNumber: values.phoneNumber, // Cập nhật số điện thoại
      };

      await axios.put(`http://localhost:3000/orders/${id}`, updatedOrder);
      messageApi.success("Cập nhật thông tin người nhận thành công!");
    } catch (error) {
      console.error("Error updating receiver info:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const getAvailableStatusOptions = (currentStatus) => {
    const statusOptions = {
      "Chờ xác nhận": ["Đã xác nhận", "Đang giao hàng", "Đã hủy"],
      "Đã xác nhận": ["Đang giao hàng", "Đã hủy"],
      "Đang giao hàng": [],
      "Đã nhận hàng": [],
      "Đã hủy": [],
    };

    return statusOptions[currentStatus] || [];
  };

  const availableStatusOptions = getAvailableStatusOptions(order?.status);

  return (
    <>
      {contextHolder}
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
        <div className="mt-4 p-4">
          <div className="flex items-center justify-between">
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
        </div>
      </Card>

      {/* Giao diện cập nhật thông tin người nhận */}
      <Card className="shadow-lg rounded-lg mb-4">
        <Divider
          orientation="left"
          className="font-semibold text-lg text-gray-800"
        >
          Cập nhật thông tin người nhận
        </Divider>
        <Form
          form={formReceiver}
          name="receiverInfo"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinishReceiverUpdate}
        >
          <Form.Item
            label="Tên người nhận"
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập tên người nhận!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Giao diện cập nhật trạng thái đơn hàng */}
      <Card className="shadow-lg rounded-lg mb-4">
        <Divider
          orientation="left"
          className="font-semibold text-lg text-gray-800"
        >
          Cập nhật trạng thái đơn hàng
        </Divider>
        <Form
          form={formStatus}
          name="orderStatus"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinishStatusUpdate}
        >
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái" allowClear>
              {availableStatusOptions.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default UpdateOrder;
