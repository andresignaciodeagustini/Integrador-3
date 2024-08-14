import React, { useState, useEffect } from "react";
import { Slideshow, Slide } from "../slider";
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
  const [pageItems, setPageItems] = useState(3); // Mostrar 3 productos por página
  const [page, setPage] = useState(0);

  useEffect(() => {
    getProducts({ page });
  }, [page, pageItems]);

  async function getProducts({ page = 0 }) {
    try {
      const response = await axios.get(
        `${URL}/products?page=${page}&limit=${pageItems}`
      );
      const { products, total } = response.data;
      setTotalItems(total);
      setProducts(products);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h2 className="product-list-title">PRODUCTOS FAVORITOS</h2>

      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <Slideshow controles={true} velocidad="500" intervalo="5000">
          {products.map((product) => (
            <Slide key={product.id}>
              <ProductCard product={product} />
            </Slide>
          ))}
        </Slideshow>
      )}

      <Pagination
        totalItems={totalItems}
        loadPage={(params) => {
          setPage(params.page);
          getProducts(params);
        }}
        pageItems={pageItems}
        currentPage={page}
      />
      <select defaultValue={pageItems} onChange={(e) => setPageItems(e.target.value)}>
            <option value="2">2 Items</option>
            <option value="3">3 Items</option>
            <option value="5">5 Items</option>

        </select>
    </div>
  );
}
