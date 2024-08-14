import { useForm } from "react-hook-form";
import useApi from "../../services/interceptor/Interceptor";
import { useUser } from "../../context/UserContext";
import Swal from "sweetalert2";
import registerImage from '../../assets/images/register/register.jpg';
import './Register.css';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const api = useApi();
  const { token } = useUser();

  async function onSubmit(data) {
    try {
      // Verifica si `data` contiene todas las propiedades esperadas
      if (!data.nombre || !data.apellido || !data.email || !data.contrasena) {
        throw new Error("Todos los campos son obligatorios");
      }

      // Crea un nuevo FormData
      const formData = new FormData();
      formData.append("fullname", `${data.nombre} ${data.apellido}`);
      formData.append("email", data.email);
      formData.append("password", data.contrasena);
      formData.append("bornDate", data.fecha_nacimiento);
      formData.append("role", "CLIENT_ROLE");

      // Llamada a la API para crear el usuario
      const response = await api.post(`/users`, formData, {
        headers: {
          Authorization: token
        }
      });

      console.log("Nuevo usuario creado:", response.data);
      reset();
      Swal.fire("Éxito", "Usuario creado con éxito", "success");
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      Swal.fire("Error", "Hubo un problema al crear el usuario", "error");
    }
  }

  return (
    <section className="registro">
      <div className="container">
        <h2>CREAR UNA CUENTA</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" {...register("nombre", { required: true })} />

          <label htmlFor="apellido">Apellido:</label>
          <input type="text" id="apellido" {...register("apellido", { required: true })} />

          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
          <input type="date" id="fecha_nacimiento" {...register("fecha_nacimiento", { required: true })} />

          <label htmlFor="pais">País:</label>
          <input type="text" id="pais" {...register("pais", { required: true })} />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" {...register("email", { required: true })} />

          <label htmlFor="confirmar_email">Confirmar Email:</label>
          <input type="email" id="confirmar_email" {...register("confirmar_email", { required: true })} />

          <label htmlFor="contrasena">Contraseña:</label>
          <input type="password" id="contrasena" {...register("contrasena", { required: true })} />

          <label htmlFor="confirmar_contrasena">Confirmar Contraseña:</label>
          <input type="password" id="confirmar_contrasena" {...register("confirmar_contrasena", { required: true })} />

          <label htmlFor="telefono">Teléfono:</label>
          <input type="tel" id="telefono" {...register("telefono", { required: true })} />

          <label>
            <input type="checkbox" {...register("consentimiento_versace", { required: true })} />
            Doy mi consentimiento para actividades de promoción comercial relacionadas con Versace de acuerdo con nuestra Política de Privacidad.
          </label>

          <label>
            <input type="checkbox" {...register("consentimiento_valentino", { required: true })} />
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
