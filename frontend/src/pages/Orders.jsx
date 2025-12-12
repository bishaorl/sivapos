import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrders, removeOrder } from "../features/order/orderSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import ScaleLoader from "react-spinners/ScaleLoader";

const Orders = () => {
  const { orders, loading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch, refreshFlag]);

  const handleDelete = (orderId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta orden?")) {
      dispatch(removeOrder(orderId)).then(() => {
        // Forzar una actualización del componente
        setRefreshFlag(prev => !prev);
      });
    }
  };

  const handleEdit = (order) => {
    // Para órdenes, podríamos implementar edición en el futuro
    console.log("Editar orden:", order);
    alert("Funcionalidad de edición de órdenes próximamente");
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
        <h2>Tabla de Órdenes</h2>
        <button 
          className="close-button-3d" 
          onClick={() => window.history.back()}
          title="Cerrar"
        >
          ✕
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>ID</th>
            <th style={{ width: '15%' }}>Usuario</th>
            <th style={{ width: '25%' }}>Productos</th>
            <th style={{ width: '10%' }}>Total</th>
            <th style={{ width: '15%' }}>Fecha</th>
            <th style={{ width: '20%' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={{ width: '15%' }}>{order.id}</td>
              <td style={{ width: '15%' }}>{order.customer || "N/A"}</td>
              <td style={{ width: '25%' }}>
                {order.cartItems?.map((item, index) => (
                  <div key={index}>
                    {item.name} (x{item.quantity})
                  </div>
                )) || "N/A"}
              </td>
              <td style={{ width: '10%' }}>${order.totalAmount || 0}</td>
              <td style={{ width: '15%' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
              {user?.isAdmin && (
                <td className="actions-cell" style={{ width: '20%' }}>
                  <button className="btn-edit-3d" onClick={() => handleEdit(order)} title="Editar">
                    <FaEdit />
                  </button>
                  <button
                    className="btn-delete-3d"
                    onClick={() => handleDelete(order.id)}
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
  );
};

export default Orders;
