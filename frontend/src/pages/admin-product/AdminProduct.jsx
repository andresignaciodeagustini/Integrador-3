import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import './AdminProduct.css';
import { formatTimestampToInputDate } from "../../services/utils/formatDate";
import Header from '../../layout/header/Header';
import Overview from '../overview/Overview'; 
import { useUser } from "../../context/UserContext";
import Pagination from "../../components/pagination/Pagination";
import useApi from "../../services/interceptor/Interceptor";

export default function AdminProduct() {
  const {

    
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const api =useApi();
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const { token } = useUser();

  // para paginación
  const [totalItems, setTotalItems] = useState(0);
  const [pageItems, setPageItems] = useState(2);

  useEffect(() => {
    getProducts({ page: 0 });
    getCategories();
  }, [pageItems]);

  async function getCategories() {
    try {
      const response = await api.get(`/categories`);
      const categoriesDB = response.data.categories;
      setCategories(categoriesDB);
    } catch (error) {
      console.log("Error al obtener categorías", error);
    }
  }

  async function getProducts({ page = 0 }) {
    try {
      const response = await api.get(`/products?limit=${pageItems}&page=${page}`);
      const { products, total } = response.data;
      setProducts(products);
      setTotalItems(total);
      console.log("Productos obtenidos:", products);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  }

  async function onSubmit(data) {
    try {
      console.log("data", data);
      const formData = new FormData();
      if (data.id) {
        formData.append("id", data.id);
      }
      formData.append("name", data.name);
      formData.append("price", +data.price); 
      formData.append("image", data.image.length ?  data.image[0] : undefined);
      formData.append("createdAt", new Date(data.createdAt).toISOString()); 
      formData.append("category", data.category);
      formData.append("description", data.description);
      console.log(data);
      if (data.id) {
        updateProduct(formData);
      } else {
        createProduct(formData);
      }
  
      reset(); // Reinicia el formulario después de enviar los datos
      setIsEditing(false); 
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  }

  async function createProduct(product) {
    try {
      const newProduct = await api.post(`/products/`, 
        product, 
        {
          headers: {
            Authorization: token
          }
        }
      );
      console.log("Nuevo producto creado:", newProduct.data);
      reset();
      setProducts([...products, newProduct.data]);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  }

  async function deleteProduct(id) {
    try {
      
      await api.delete(`products/${id}`);
      setProducts(products.filter(product => product.id !== id));
      getProducts({ page: 0 });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }

  async function updateProduct(productFormData) {
    try {
      const id = productFormData.get("id");
      console.log(id);
      
      
      console.log("Product Data being sent:", Object.fromEntries(productFormData.entries()));

      if (!id) {
        throw new Error("ID del producto no válido");
      }

      // Guarda la respuesta en una variable
      const response = await api.put(`/products/${id}`, productFormData);
        
      // Accede a response.data
      console.log("Response from server:", response.data);

      getProducts({ page: 0 });
      setIsEditing(false);
      reset();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);

      if (error.response) {
        // Error de respuesta del servidor
        console.error("Error del servidor:", error.response.data);
        console.error("Estado del servidor:", error.response.status);
        console.error("Encabezados del servidor:", error.response.headers);
      } else if (error.request) {
        // Error de solicitud (no se recibió respuesta)
        console.error("Error en la solicitud:", error.request);
      } else {
        // Otros errores
        console.error("Error:", error.message);
      }
    }
  }

  function handleEditProduct(producto) {
    if (!producto || !producto._id) {
      console.error("Producto no válido para editar:", producto);
      return;
    }
    console.log("Editar producto", producto);
    setIsEditing(true);
    
    setValue("id", producto._id);
    setValue("name", producto.name);
    setValue("price", producto.price);
    setValue("category", producto.category._id);
    setValue("description", producto.description);
    setValue("createdAt", formatTimestampToInputDate(producto.createdAt));
    // setIsOpen(true);
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
      reverseButtons: true,
      key: id.toString(),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id);
        Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
      }
    });
  }

  return (
    <>
      <Header />
      <div className="admin-dashboard">
        <div className="admin-form-container">
          <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register("id")} />
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                {...register("name", {
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
              {errors.name && <span className="input-error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                {...register("price", {
                  required: "Este campo es requerido",
                  min: {
                    value: 0,
                    message: "El precio debe ser mayor o igual a 0"
                  }
                })}
              />
              {errors.price && <span className="input-error">{errors.price.message}</span>}
            </div>

            <div className="form-group">
              <label>Imagen (URL):</label>
              <input
                type="file" accept="image/*"
                {...register("image", {
                  required: "Ingresa una URL válida de imagen"
                })}
              />
              {errors.image && <span className="input-error">{errors.image.message}</span>}
            </div>

            <div className="form-group">
              <label>Categoría:</label>
              <select {...register("category", { required: "Selecciona una categoría" })}>
                {categories.map(category => (
                  <option value={category._id} key={category._id}>{category.viewValue}</option>
                ))}
              </select>
              {errors.category && <span className="input-error">{errors.category.message}</span>}
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <input type="text" {...register("description")} />
            </div>

            <div className="form-group">
              <label>Fecha de creación:</label>
              <input
                type="date"
                {...register("createdAt", {
                  required: "Este campo es requerido"
                })}
              />
              {errors.createdAt && <span className="input-error">{errors.createdAt.message}</span>}
            </div>

            <button type="submit">{isEditing ? 'Actualizar' : 'Agregar'}</button>
          </form>
        </div>

        <div className="admin-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>FOTO DEL PRODUCTO</th>
              <th>NOMBRE DEL PRODUCTO</th>
              <th>DESCRIPCIÓN</th>
              <th>FECHA DE INGRESO</th>
              <th>PRECIO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td><img src={`http://localhost:3000/images/products/${product.image}`} alt={product.name} /></td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                <td>${product.price}</td>
                <td>
                  <div className="buttons-container">
                    <button className="edit-button" onClick={() => handleEditProduct(product)}>EDITAR</button>
                    <button className="delete-button" onClick={() => handleDeleteClick(product._id)}>ELIMINAR</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          <Pagination 
            totalItems={totalItems}
            loadPage={getProducts}
            pageItems={pageItems}
          />

        <select defaultValue={pageItems} onChange={(e) => setPageItems(e.target.value)}>
            <option value="2">2 Items</option>
            <option value="3">3 Items</option>
            <option value="5">5 Items</option>

        </select>
          
        </div>
      </div>
    </>
  );
}
