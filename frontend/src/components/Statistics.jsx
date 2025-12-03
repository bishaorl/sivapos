import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders } from "../features/order/orderSlice";
import { allUsers } from "../features/auth/authSlice";

const Statistics = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { products } = useSelector((state) => state.product);
  const { orders } = useSelector((state) => state.order);
  const { users, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getOrders());
    dispatch(allUsers());
  }, [dispatch]);

  return (
    <>
      <div className="statistic-layout">
        <Link to="/dashboard/orders-table" className="statistics-link">
          <div className="statistics">
            <span className="statistic-title">Pedidos</span>
            <div className="statistic-count">
              <div className="image">
                <img src={require("../images/order.png")} alt="..." />
              </div>
              <span>{orders.length}</span>
            </div>
          </div>
        </Link>

        {user?.isAdmin && (
          <Link to="/dashboard/users-table" className="statistics-link">
            <div className="statistics">
              <span className="statistic-title">Usuarios</span>
              <div className="statistic-count">
                <div className="image">
                  <img src={require("../images/users.png")} alt="..." />
                </div>
                <span>{users.length}</span>
              </div>
            </div>
          </Link>
        )}

        <Link to="/dashboard/products-table" className="statistics-link">
          <div className="statistics">
            <span className="statistic-title">Productos</span>
            <div className="statistic-count">
              <div className="image">
                <img src={require("../images/products.png")} alt="..." />
              </div>
              <span>{products.length}</span>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/categories-table" className="statistics-link">
          <div className="statistics">
            <span className="statistic-title">Categorias</span>
            <div className="statistic-count">
              <div className="image">
                <img src={require("../images/category.png")} alt="..." />
              </div>
              <span>{categories.length}</span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Statistics;
