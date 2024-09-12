import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección
import './Register.css'; // Importa tu archivo CSS para Register si lo tienes separado
import registerImage from '../../assets/images/register/register.jpg';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Lee la variable de entorno VITE_SERVER_URL
const API_URL = import.meta.env.VITE_SERVER_URL;

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate(); // Hook para redirección

  const onSubmit = async (data) => {
    try {
      // Crear FormData y agregar los datos
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("bornDate", data.bornDate);
      
      // Verificar el archivo
      if (data.image.length > 0) {
        console.log("Archivo seleccionado:", data.image[0]);
        formData.append("image", data.image[0]);
      } else {
        console.log("No se seleccionó ningún archivo.");
      }
      
      // Mostrar el contenido del FormData
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      // Enviar el FormData a tu backend
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      // Iniciar sesión automáticamente
      const loginResponse = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      if (!loginResponse.ok) {
        throw new Error(`Error ${loginResponse.status}: ${loginResponse.statusText}`);
      }

      const loginResult = await loginResponse.json();
      console.log("Resultado del inicio de sesión:", loginResult);

      // Guardar el token o información de sesión en localStorage
      localStorage.setItem('authToken', loginResult.token);

      // Mostrar el SweetAlert en caso de éxito
      Swal.fire({
        title: 'Registro Exitoso!',
        text: 'Tu cuenta ha sido creada exitosamente y has iniciado sesión.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirigir al usuario al home
        navigate('/');
      });

    } catch (error) {
      console.error("Error al enviar el formulario:", error);

      // Mostrar el SweetAlert en caso de error
      Swal.fire({
        title: 'Error!',
        text: 'Hubo un problema al crear tu cuenta. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <section className="registro">
      <div className="container">
        <h2>CREAR UNA CUENTA</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campos del formulario */}
          <label htmlFor="fullname">Nombre completo:</label>
          <input
            type="text"
            id="fullname"
            {...register("fullname", {
              required: "El nombre completo es obligatorio",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres"
              },
              maxLength: {
                value: 50,
                message: "El nombre no puede tener más de 50 caracteres"
              }
            })}
          />
          {errors.fullname && <span className="input-error">{errors.fullname.message}</span>}

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "El email no es válido"
              }
            })}
          />
          {errors.email && <span className="input-error">{errors.email.message}</span>}

          <label htmlFor="confirm_email">Confirmar Email:</label>
          <input
            type="email"
            id="confirm_email"
            {...register("confirm_email", {
              required: "Por favor confirme su email",
              validate: (value) => value === watch('email') || "Los emails no coinciden"
            })}
          />
          {errors.confirm_email && <span className="input-error">{errors.confirm_email.message}</span>}

          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 4,
                message: "La contraseña debe tener al menos 6 caracteres"
              },
              maxLength: {
                value: 20,
                message: "La contraseña no puede tener más de 20 caracteres"
              }
            })}
          />
          {errors.password && <span className="input-error">{errors.password.message}</span>}

          <label htmlFor="confirm_password">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirm_password"
            {...register("confirm_password", {
              required: "Por favor confirme su contraseña",
              validate: (value) => value === watch('password') || "Las contraseñas no coinciden"
            })}
          />
          {errors.confirm_password && <span className="input-error">{errors.confirm_password.message}</span>}

          <label htmlFor="bornDate">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="bornDate"
            {...register("bornDate", {
              required: "La fecha de nacimiento es obligatoria"
            })}
          />
          {errors.bornDate && <span className="input-error">{errors.bornDate.message}</span>}

          <label htmlFor="image">Imagen:</label>
          <input
            type="file"
            id="image"
            {...register("image")}
          />

          <button type="submit">REGISTRARSE</button>
        </form>
      </div>

      <div className="imagen-container">
        <img src={registerImage} alt="Descripción de la imagen" />
      </div>
    </section>
  );
}
