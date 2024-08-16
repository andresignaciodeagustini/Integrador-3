import { useState, useEffect } from "react";
import ProductCard from "../product-card/ProductCard";
import axios from "axios";
import "./ProductList.css";
import Pagination from "../pagination/Pagination";
import Swal from "sweetalert2";

const URL = import.meta.env.VITE_SERVER_URL;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [pageItems, setPageItems] = useState(2);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getProducts();
  }, [pageItems]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const response = await axios.get(`${URL}/categories`);
      const categoriesDB = response.data.categories;
      setCategories(categoriesDB);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "No se pudieron obtener las categorías");
    }
  }

  async function getProducts({ page = 0, category } = {}) {
    try {
      const categoryQuery = category ? `&category=${category}` : '';
      const response = await axios.get(`${URL}/products?page=${page}&limit=${pageItems}${categoryQuery}`);
      const { products, total } = response.data;
      setTotalItems(total);
      setProducts(products);
      setIsLoading(false);
      console.log("Productos obtenidos:", products);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h2 className="product-list-title">LISTA DE PRODUCTOS</h2>

      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="product-card-container">
          {products.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      )}

      <Pagination 
        totalItems={totalItems}
        loadPage={getProducts}
        pageItems={pageItems}
      />

      <select 
        value={pageItems}
        onChange={(e) => setPageItems(Number(e.target.value))}
      >
        <option value="2">2 Items</option>
        <option value="3">3 Items</option>
        <option value="5">5 Items</option>
      </select>
    </div>
  );
}
