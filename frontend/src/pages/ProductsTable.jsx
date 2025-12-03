import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, removeProduct, setEditProduct, clearValues } from "../features/product/productSlice";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import ScaleLoader from "react-spinners/ScaleLoader";
import AddProduct from "./AddProduct";

const ProductsTable = () => {
  const dispatch = useDispatch();
  const { products, loading, isEditing } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar productos basados en el término de búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm)
  );

  // Efecto para cargar productos al montar el componente
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = (productId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      dispatch(removeProduct(productId));
    }
  };

  const handleEdit = (product) => {
    dispatch(setEditProduct(product));
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    dispatch(clearValues());
    setShowEditModal(true);
  };

  const closeForm = () => {
    setShowEditModal(false);
    // Recargar productos para asegurar que la lista esté actualizada
    dispatch(getProducts());
  };

  const override = {
    display: "block",
    margin: "0 auto",
  };

  if (loading) {
    return <ScaleLoader color="#ecc20e" cssOverride={override} />;
  }

  return (
    <>
      <div className="table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Tabla de Productos</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="header__search" style={{ margin: 0, padding: '0.40rem 0.75rem' }}>
              <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="search" 
                  placeholder="Buscar productos..." 
                  className="header__input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '200px' }}
                />
                <button type="submit" className="header__icon-button">
                  <FaSearch className="header__icon" />
                </button>
              </form>
            </div>
            {user?.isAdmin && (
              <button 
                className="btn-edit-3d" 
                onClick={handleAddNew}
                style={{ padding: '10px 20px', fontSize: '16px' }}
              >
                + Agregar Nuevo Producto
              </button>
            )}
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>ID</th>
              <th style={{ width: '20%' }}>Nombre</th>
              <th style={{ width: '10%' }}>Stock</th>
              <th style={{ width: '10%' }}>Precio</th>
              <th style={{ width: '15%' }}>Categoría</th>
              <th style={{ width: '15%' }}>Imagen</th>
              <th style={{ width: '25%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td style={{ width: '5%' }}>{product.id}</td>
                <td style={{ width: '20%' }}>{product.name}</td>
                <td style={{ width: '10%' }}>{product.stock}</td>
                <td style={{ width: '10%' }}>${product.price}</td>
                <td style={{ width: '15%' }}>{product.category}</td>
                <td style={{ width: '15%' }}>
                  <img src={product.image} alt={product.name} style={{ width: "50px", height: "50px" }} />
                </td>
                {user?.isAdmin && (
                  <td className="actions-cell" style={{ width: '25%' }}>
                    <button className="btn-edit-3d" onClick={() => handleEdit(product)} title="Editar">
                      <FaEdit />
                    </button>
                    <button
                      className="btn-delete-3d"
                      onClick={() => handleDelete(product.id)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddProduct closeModal={closeForm} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsTable;
