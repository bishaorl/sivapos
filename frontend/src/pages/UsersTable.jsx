import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allUsers, updateUser, removeUser } from "../features/auth/authSlice";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ScaleLoader from "react-spinners/ScaleLoader";
import AddUser from "./AddUser";
import EditUser from "./EditUser";

const UsersTable = () => {
  const dispatch = useDispatch();
  const { users, loading, user } = useSelector((state) => state.auth);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(allUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      dispatch(removeUser(userId));
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const override = {
    display: "block",
    margin: "0 auto",
  };

  if (loading) {
    return <ScaleLoader color="#ecc20e" cssOverride={override} />;
  }

  return (
    <div className="table-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Tabla de Usuarios</h2>
        {user?.isAdmin && (
          <button 
            className="btn-edit-3d" 
            onClick={() => setShowAddModal(true)}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            <FaPlus /> Agregar Nuevo Usuario
          </button>
        )}
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '25%' }}>ID</th>
            <th style={{ width: '25%' }}>Nombre</th>
            <th style={{ width: '25%' }}>Email</th>
            <th style={{ width: '10%' }}>Admin</th>
            <th style={{ width: '15%' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((userItem) => (
            <tr key={userItem._id}>
              <td style={{ width: '25%' }}>{userItem._id}</td>
              <td style={{ width: '25%' }}>{userItem.name}</td>
              <td style={{ width: '25%' }}>{userItem.email}</td>
              <td style={{ width: '10%' }}>{userItem.isAdmin ? "Sí" : "No"}</td>
              {user?.isAdmin && (
                <td className="actions-cell" style={{ width: '15%' }}>
                  <button className="btn-edit-3d" onClick={() => handleEdit(userItem)} title="Editar">
                    <FaEdit />
                  </button>
                  <button
                    className="btn-delete-3d"
                    onClick={() => handleDelete(userItem._id)}
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
      {showAddModal && (
        <div className="modal-overlay" style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000 
        }}>
          <div className="modal-content" style={{ 
            maxHeight: '90vh', 
            overflowY: 'auto',
            marginTop: '0'
          }}>
            <AddUser closeModal={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
      {showEditModal && selectedUser && (
        <div className="modal-overlay" style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000 
        }}>
          <div className="modal-content" style={{ 
            maxHeight: '90vh', 
            overflowY: 'auto',
            marginTop: '0'
          }}>
            <EditUser user={selectedUser} closeModal={() => setShowEditModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
