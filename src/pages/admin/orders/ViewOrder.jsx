import { Card, Divider, Form, Input, List } from "antd"; // Thêm List từ antd
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewOrder = () => {
  const [order, setOrder] = useState(null);
  const [allProduct, setAppProduct] = useState([]);
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
          setAppProduct(productsOrder);
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
          itemLayout="horizontal"
          dataSource={allProduct}
          renderItem={(product) => (
            <List.Item>
              <List.Item.Meta
                title={product.title} // Thay đổi theo tên thuộc tính trong sản phẩm
                description={
                  <>
                    <div>Giá: {product.price} VNĐ</div>
                    <div>
                      Số lượng:{" "}
                      {
                        order?.products.find((p) => p.idProduct === product.id)
                          ?.quantity
                      }
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card>
        <Divider orientation="left">Thông tin người nhận</Divider>
        <Form
          name="receiverInfo"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="Tên người nhận">
            <Input readOnly value={order?.fullName} />
          </Form.Item>
          <Form.Item label="Email">
            <Input readOnly value={order?.email} />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input readOnly value={order?.address} />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input value={order?.phoneNumber} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default ViewOrder;
