import { Carousel } from "antd";
import React from "react";

const contentStyle = {
  height: "300px", // Updated height
  color: "#fff",
  lineHeight: "200px", // Updated line height to center content
  textAlign: "center",
  background: "#FFFFFF",
};

const SlideShow = () => (
  <Carousel autoplay>
    <div>
      <h3 style={contentStyle}>
        <img
          src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/77/93/77930414438b19cc568d835a6bcd2abc.png"
          style={{ width: "100%", height: "100%", objectFit: "contain" }} // Ensure the image fits within the height
        />
      </h3>
    </div>
    <div>
      <h3 style={{ height: "300px", overflow: "hidden" }}>
        {" "}
        {/* Set height and hide overflow */}
        <img
          src="https://cdnv2.tgdd.vn/mwg-static/dmx/Banner/e2/68/e268b25c841969667e81f82da5e0a7d7.png"
          style={{ width: "100%", height: "100%", objectFit: "cover" }} // Make the image cover the entire slide
        />
      </h3>
    </div>
    <div>
      <h3 style={contentStyle}>
        <img
          src="https://cdnv2.tgdd.vn/mwg-static/topzone/Banner/30/51/30512b9286aa60273933891bcfc2fb2d.jpg"
          style={{ width: "100%", height: "100%", objectFit: "contain" }} // Ensure the image fits within the height
        />
      </h3>
    </div>
    <div>
      <h3 style={contentStyle}>
        <img
          src="https://cdnv2.tgdd.vn/mwg-static/topzone/Banner/87/31/8731e0f352ab9ab88e42ba114387a0d5.jpg"
          style={{ width: "100%", height: "100%", objectFit: "contain" }} // Ensure the image fits within the height
        />
      </h3>
    </div>
  </Carousel>
);

export default SlideShow;
