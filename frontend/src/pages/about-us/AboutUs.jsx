import './about-us.css';
import aboutUsImage from '../../assets/images/about-us/about_us.jpg';



export default function AboutUs() {
  return (
    <>
      <section className="about-us">
        <div className="about-us-container">
          <div className="about-us-text">
            <h2>NUESTRA HISTORIA</h2>
            <p>
              Con una propuesta innovadora y original, esta marca argentina se ha posicionado como una de las más prestigiosas y competitivas del mercado. Su fundador, Valentino Ricci, es un joven diseñador que se inspira en la cultura, el arte y la naturaleza de su país. Sus colecciones combinan el estilo clásico con el moderno, el minimalismo con el color, y la sofisticación con la comodidad. Además, utiliza materiales ecológicos y reciclados, respeta los derechos laborales de sus trabajadores y colabora con organizaciones benéficas. <br /><br />
              La distinción de la marca se extiende más allá de su vestimenta, abarcando una selecta gama de joyería y perfumes. Cada pieza de joyería, forjada con metales preciosos y gemas selectas, refleja un compromiso con la artesanía de calidad. Las fragancias, por otro lado, son elixires delicadamente compuestos que encapsulan la sutileza y el encanto de Argentina, ofreciendo una experiencia olfativa única.
            </p>
          </div>
          <div className="image-about-us">
            <img src={aboutUsImage} alt="about-us" />
          </div>
        </div>

        <div className="about-me">
          <h2>¿Quiénes Somos?</h2>
          <p>
            En colaboración con Valentino Ricci, he creado una página web para una empresa de moda y diseño innovadora y original. Aquí, podrás explorar sus diversas colecciones y productos, así como sumergirte en la esencia de la marca. La página web adopta un estilo minimalista que refleja la sofisticación y la originalidad de la firma, utilizando una paleta de colores neutros, tipografías elegantes y espacios blancos estratégicos.
          </p>
          
        </div>
      </section>
     
    </>
  );
}
