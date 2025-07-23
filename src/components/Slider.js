import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

function Slider(props) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const images = props.images;
  var imageWithPath = [];
  for (var i = 0; i < images.length; i++) {
    imageWithPath[i] = `http://localhost:5000/uploads/${images[i]}`;
}

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} className="w-100">
        {imageWithPath.map((url, idx) => (
            <Carousel.Item key={idx}>
        <img
          className="d-block w-100"
          src={url}
        />
      </Carousel.Item>
        ))}
    </Carousel>
  );
}

export default Slider;
