// src/components/Carousel.jsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = ({ items = [], renderItem, slidesToShow = 1 }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow, // Usa la prop slidesToShow
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };

  if (!Array.isArray(items) || items.length === 0) {
    return <p>No items to display.</p>;
  }

  return (
    <Slider {...settings}>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item)}
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
