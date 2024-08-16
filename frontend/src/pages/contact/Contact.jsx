import './Contact.css';

export default function Contact() {
  return (
    <section className="contact-section">
      <div className="contact-container">
       

        <div className="form-container">
          <form action="procesar_formulario.php" method="post" className="contact-form">
            <h2>FORMULARIO DE CONTACTO</h2>
            <div className="form-group">
              <label htmlFor="nombreCompleto">NOMBRE COMPLETO:</label>
              <input type="text" id="nombreCompleto" name="nombreCompleto" required minLength="3" maxLength="50" />
            </div>
            <div className="form-group">
              <label htmlFor="email">EMAIL:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="mensaje">MENSAJE:</label>
              <textarea id="mensaje" name="mensaje" required minLength="10" maxLength="500"></textarea>
            </div>
            <button type="submit">ENVIAR</button>
          </form>
        </div>


        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31676.116577914622!2d-57.6037!3d-38.0184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959c8b3e8282e091%3A0xcca0e2256f8c295c!2sAcantilados%2C%20Mar%20del%20Plata%2C%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1647498774245!5m2!1sen!2sar"
            width="100%" height="300" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
        </div>
      </div>
    </section>
  );
}
