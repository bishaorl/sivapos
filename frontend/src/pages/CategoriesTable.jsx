import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCategories, removeCategory, setEditCategory, clearValues } from "../features/category/categorySlice";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ScaleLoader from "react-spinners/ScaleLoader";
import AddCategory from "./AddCategory";

const CategoriesTable = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const { user } = useSelector((state) => state.auth);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleDelete = (categoryId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      dispatch(removeCategory(categoryId));
    }
  };

  const handleEdit = (category) => {
    dispatch(setEditCategory(category));
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    dispatch(clearValues());
    setShowEditModal(true);
  };

  const closeForm = () => {
    setShowEditModal(false);
    dispatch(getCategories());
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
          <h2>Tabla de Categorías</h2>
          {user?.isAdmin && (
            <button 
              className="btn-edit-3d" 
              onClick={handleAddNew}
              style={{ padding: '10px 20px', fontSize: '16px' }}
            >
              <FaPlus /> Agregar
            </button>
          )}
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>ID</th>
              <th style={{ width: '30%' }}>Categoría</th>
              <th style={{ width: '20%' }}>Imagen</th>
              <th style={{ width: '30%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id || category.id || category._id}>
                <td style={{ width: '20%' }}>{category._id || category.id}</td>
                <td style={{ width: '30%' }}>{category.category}</td>
                <td style={{ width: '20%' }}>
                  <img src={category.image} alt={category.category} style={{ width: "50px", height: "50px" }} />
                </td>
                <td className="actions-cell" style={{ width: '30%' }}>
                  {user?.isAdmin && (
                    <button className="btn-edit-3d" onClick={() => handleEdit(category)} title="Editar">
                      <FaEdit />
                    </button>
                  )}
                  {user?.isAdmin && (
                    <button
                      className="btn-delete-3d"
                      onClick={() => handleDelete(category._id || category.id)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddCategory closeModal={closeForm} />
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesTable;
