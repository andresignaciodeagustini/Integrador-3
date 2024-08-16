import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import modelo1 from '../../assets/images/main/modelo1.jpg';
import modelo2 from '../../assets/images/main/modelo2.jpg';
import modelo3 from '../../assets/images/main/modelo3.jpg';

const slides = [modelo1, modelo2, modelo3];

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false, // Desactiva las flechas de control
  };

  return (
    <Slider {...settings}>
      {slides.map((slide, index) => (
        <div key={index}>
          <img src={slide} alt={`Slide ${index + 1}`} />
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
