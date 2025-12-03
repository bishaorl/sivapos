import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../features/product/productSlice";
import ProductItem from "./ProductItem";
import ClipLoader from "react-spinners/ClipLoader";

const ProductSearch = ({ searchTerm }) => {
  const { loading, products } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Si no hay productos cargados, los obtenemos
    if (products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    // Filtrar productos basados en el término de búsqueda
    if (searchTerm && searchTerm.trim() !== "") {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const override = {
    display: "block",
    margin: "0 auto",
  };

  // Si no hay término de búsqueda, no mostramos nada
  if (!searchTerm || searchTerm.trim() === "") {
    return null;
  }

  // Si está cargando, mostramos el spinner
  if (loading) {
    return <ClipLoader size={60} color="#ecc20e" cssOverride={override} />;
  }

  // Si no hay productos filtrados, mostramos un mensaje
  if (filteredProducts.length === 0) {
    return (
      <div className="info-details">
        <div className="info">No se encontraron productos que coincidan con "{searchTerm}"</div>
      </div>
    );
  }

  // Mostramos los productos filtrados
  return (
    <div className="product-content">
      <h2>Resultados de búsqueda para "{searchTerm}"</h2>
      <div className="search-results-info">      
        Se encontraron {filteredProducts.length} productos
      </div>
      {filteredProducts.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductSearch;