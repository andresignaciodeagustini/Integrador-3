import './Register.css'; // Importa tu archivo CSS para Register si lo tienes separado
import registerImage from '../../assets/images/register/register.jpg';

export default function Register() {
  return (
    <section className="registro">
      <div className="container">
        <h2>CREAR UNA CUENTA</h2>

        <form action="procesar_registro.php" method="post">
          {/* Campos del formulario */}
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" pattern="[A-Za-z]+" minLength="2" maxLength="50" required />

          <label htmlFor="apellido">Apellido:</label>
          <input type="text" id="apellido" name="apellido" pattern="[A-Za-z]+" minLength="2" maxLength="50" required />

          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
          <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" required />

          {/* Nuevos campos */}
          <label htmlFor="pais">País:</label>
          <input type="text" id="pais" name="pais" pattern="[A-Za-z]+" minLength="2" maxLength="50" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="confirmar_email">Confirmar Email:</label>
          <input type="email" id="confirmar_email" name="confirmar_email" required />

          <label htmlFor="contrasena">Contraseña:</label>
          <input type="password" id="contrasena" name="contrasena" minLength="6" maxLength="20" required />

          <label htmlFor="confirmar_contrasena">Confirmar Contraseña:</label>
          <input type="password" id="confirmar_contrasena" name="confirmar_contrasena" minLength="6" maxLength="20" required />

          <label htmlFor="telefono">Teléfono:</label>
          <input type="tel" id="telefono" name="telefono" minLength="9" maxLength="15" required />

          <label>
            <input type="checkbox" name="consentimiento_versace" required />
            Doy mi consentimiento para actividades de promoción comercial relacionadas con Versace de acuerdo con nuestra Política de Privacidad.
          </label>

          <label>
            <input type="checkbox" name="consentimiento_valentino" required />
            Doy mi consentimiento para recibir ofertas y propuestas personalizadas basadas en mis preferencias de acuerdo con la Política de Privacidad de Valentino Ricci.
          </label>

          <button type="submit">REGISTRARSE</button>
        </form>
      </div>

      <div className="imagen-container">
        <img src={registerImage} alt="Descripción de la imagen" />
      </div>
    </section>
  );
}
