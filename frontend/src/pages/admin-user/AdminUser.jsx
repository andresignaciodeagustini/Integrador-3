import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import './AdminUser.css'; // Importa tu archivo CSS para AdminUser si lo tienes separado
import Header from '../../layout/header/Header'; // Importa el componente Header

export default function AdminUser() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const URL = "https://665e5e8e1e9017dc16efd098.mockapi.io/users";
      const response = await axios.get(URL);
      const usuarios = response.data;
      setUsers(usuarios);
      console.log(response);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  }

  async function onSubmit(data) {
    if (isEditing) {
      await updateUser(data);
    } else {
      await createUser(data);
    }
    reset();
    setIsEditing(false);
  }

  async function createUser(data) {
    try {
      const URL = "https://665e5e8e1e9017dc16efd098.mockapi.io/users";
      const newUser = await axios.post(URL, data);
      console.log("Nuevo usuario creado:", newUser.data);
      reset();

      setUsers([...users, newUser.data]);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  }

  async function deleteUser(id) {
    try {
      const URL = `https://665e5e8e1e9017dc16efd098.mockapi.io/users/${id}`;
      await axios.delete(URL);
      setUsers(users.filter(user => user.id !== id));
      getUsers();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  }

  async function updateUser(user) {
    try {
      const URL = `https://665e5e8e1e9017dc16efd098.mockapi.io/users/${user.id}`;
      await axios.put(URL, user);
      getUsers();
      setIsEditing(false);
      reset();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  }

  function handleEditUser(usuario) {
    console.log("Editar usuario", usuario);
    setIsEditing(true);
    setValue("id", usuario.id);
    setValue("fullName", usuario.fullName || ''); 
    setValue("email", usuario.email);
    setValue("image", usuario.image || ''); 
    setValue("bornDate", usuario.bornDate || ''); 
    setValue("location", usuario.location || ''); 
  }

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
      }
    });
  }

  return (
    <>
      <Header /> {/* Incluye el Header */}
      <div className="admin-dashboard">
        <div className="admin-form-container">
          <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register("id")} />
            <div className="form-group">
              <label>Nombre completo:</label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Este campo es requerido",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres"
                  },
                  maxLength: {
                    value: 100,
                    message: "El nombre no puede tener más de 100 caracteres"
                  }
                })}
              />
              {errors.fullName && <span className="input-error">{errors.fullName.message}</span>}
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                {...register("email", {
                  required: "Este campo es requerido"
                })}
              />
              {errors.email && <span className="input-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Imagen (URL):</label>
              <input
                type="url"
                {...register("image", {
                  required: "Ingresa una URL válida de imagen"
                })}
              />
              {errors.image && <span className="input-error">{errors.image.message}</span>}
            </div>

            <div className="form-group">
              <label>Fecha de nacimiento:</label>
              <input
                type="number"
                {...register("bornDate", {
                  required: "Este campo es requerido"
                })}
              />
              {errors.bornDate && <span className="input-error">{errors.bornDate.message}</span>}
            </div>

            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                {...register("password", {
                  required: "Este campo es requerido",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres"
                  }
                })}
              />
              {errors.password && <span className="input-error">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label>Ubicación:</label>
              <input
                type="text"
                {...register("location")}
              />
            </div>

            <div className="form-group">
              <label>Rol:</label>
              <select {...register("role", { required: "Selecciona un rol" })}>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
              {errors.role && <span className="input-error">{errors.role.message}</span>}
            </div>

            <button type="submit" className="add-button">{isEditing ? 'Actualizar' : 'Crear'}</button>
          </form>
        </div>

        <h2 className="add-button-header">LISTA DE USUARIOS</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>NOMBRE COMPLETO</th>
              <th>EMAIL</th>
              <th>ROL</th>
              <th>ACTIVO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? 'Sí' : 'No'}</td>
                <td>
                  <div className="buttons-container">
                    <button className="edit-button" onClick={() => handleEditUser(user)}>EDITAR</button>
                    <button className="delete-button" onClick={() => handleDeleteClick(user.id)}>BORRAR</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
