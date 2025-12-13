import { React, useEffect, useState, useRef } from "react";
import { FaHome, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
  clearCart,
  increase,
  decrease,
  productSubTotal,
  productTotalAmount,
  productTax,
  removeCartItem,
} from "../features/cart/cartSlice";
import { orderCreate } from "../features/order/orderSlice";
import { useSelector, useDispatch } from "react-redux";
import { deleteLocalStorageCart } from "../utils/localStorage";

const Cart = () => {
  const { cartItems, subTotal, totalAmount, tax } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(productSubTotal());
    dispatch(productTax());
    dispatch(productTotalAmount());
  }, [dispatch, cartItems]);

  const [customer, setCustomer] = useState("");
  const [country, setCountry] = useState("Venezuela");
  const [province, setProvince] = useState("Address 1");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("Cash");
  const orderButtonRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (customer === "" || zipcode === "" || phone === "") {
      toast.warning("Por favor complete los campos requeridos");
      return; // No continuar si hay campos vacíos
    }

    // Prevenir múltiples envíos
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Activar la animación del botón
    if (orderButtonRef.current) {
      orderButtonRef.current.classList.add('animate');
    }

    const newOrder = {
      customer,
      country,
      province,
      zipcode,
      phone,
      cartItems,
      subTotal,
      totalAmount,
      tax,
      payment,
      user: user._id,
    };

    // Esperar a que termine la animación (10 segundos) antes de procesar el pedido
    setTimeout(() => {
      dispatch(orderCreate(newOrder));
      dispatch(clearCart());
      deleteLocalStorageCart();
      
      // Resetear el estado de envío y la animación
      setIsSubmitting(false);
      if (orderButtonRef.current) {
        orderButtonRef.current.classList.remove('animate');
      }
      
      navigate("/dashboard/orders");
    }, 10000); // 10 segundos para que se complete la animación
  };

  if (cartItems.length === 0) {
    return (
      <div className="info-details">
        <div className="icon-info">
          <div className="icon">
            <Link to="/dashboard">
              <FaHome className="icon-cart" />
            </Link>
          </div>
          <span>Volver a la página principal y añadir productos al carrito.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <header className="cart-header">
          <a href="/dashboard" className="logo">
          <img src={require("../images/logo.png")}
          width="48"
          height="48"
          alt="logo"
          />
          </a>
          <div className="logo-3d">SiVa</div>
          <h1>Carro de Compras</h1>
          <ul className="navigation">
            <li className="cart-items">Artículos en Carrito: {cartItems.length}</li>
          </ul>
        </header>
      </div>

      <div id="shop-container">
        <section id="cart">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <td></td>
                  <td>Imagen</td>
                  <td>Producto</td>
                  <td>Precio</td>
                  <td>Cantidad</td>
                  <td>Subtotal</td>
                </tr>
              </thead>
              <tbody>
                {cartItems ? (
                  cartItems.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(removeCartItem(product.id));
                          }}
                        >
                          <FaTimes />
                        </button>
                      </td>
                      <td>
                        {product.image ? (
                          <img
                            className="product-image"
                            src={product.image}
                            alt="..."
                          />
                        ) : (
                          <img
                            className="default-image"
                            src={require("../images/product.png")}
                            alt="..."
                          />
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>$ {product.price.toFixed(2)}</td>
                      <td>
                        <div className="count">
                          <button
                            className="increment-btn"
                            type="button"
                            onClick={() => {
                              dispatch(increase(product.id));
                            }}
                          >
                            +
                          </button>
                          <span className="amount">{product.quantity}</span>
                          <button
                            className="decrement-btn"
                            type="button"
                            onClick={() => {
                              dispatch(decrease(product.id));
                            }}
                          >
                            -
                          </button>
                        </div>
                      </td>
                      <td>$ {(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <div>Products Loading...</div>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="cart-summary styled">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <div className="customer">
                <input
                  className="customer-name"
                  name="customer"
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Nombre Cliente"
                />
                <button>Cliente</button>
              </div>
              <div className="shipping-rate collapse">
                <div className="has-child expand">
                  <h3>INFORMACION DEL CLIENTE</h3>
                  <div className="content">
                    <div className="countries">
                      <div>
                        <label htmlFor="country">Pais</label>
                        <select
                          name="country"
                          id="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          <option defaultValue="Venezuela">Venezuela</option>
                          <option defaultValue="Others">Others</option>
                        </select>
                      </div>
                    </div>
                    <div className="states">
                      <div>
                        <label htmlFor="province">Estado / Provincia</label>
                        <select
                          name="province"
                          id="province"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                        >
                          <option defaultValue="Address 1.">Vargas</option>
                          <option defaultValue="Address 2.">Caracas</option>
                          <option defaultValue="Others">Otros</option>
                        </select>
                      </div>
                    </div>
                    <div className="states">
                      <div>
                        <label htmlFor="payment">Metodo de Pagao</label>
                        <select
                          name="payment"
                          id="payment"
                          value={payment}
                          onChange={(e) => setPayment(e.target.value)}
                        >
                          <option defaultValue="efectivo">Efectivo</option>
                          <option defaultValue="pago movil">Pago Movil</option>
                          <option defaultValue="Divisa">Divisa</option>
                        </select>
                      </div>
                    </div>
                    <div className="postal-code">
                      <div>
                        <label htmlFor="zipcode">Codigo Postal</label>
                        <input
                          type="number"
                          name="zipcode"
                          id="zipcode"
                          value={zipcode}
                          onChange={(e) => setZipcode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="postal-code">
                      <div>
                        <label htmlFor="phone">Numero de Telefono</label>
                        <input
                          type="number"
                          name="phone"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cart-total-table">
                <table>
                  <tbody>
                    <tr>
                      <th>SubTotal:</th>
                      <td>$ {subTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>IVA: 16%</th>
                      <td>$ {tax.toFixed(2)}</td>
                    </tr>
                    <tr className="grand-total">
                      <th>TOTAL:</th>
                      <td>
                        <strong>$ {totalAmount.toFixed(2)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="secondary-button">
                  <button ref={orderButtonRef} className="order" type="submit">
                    <span className="default">Complete Order</span>
                    <span className="success">Order Placed
                      <svg viewBox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                      </svg>
                    </span>
                    <div className="box"></div>
                    <div className="truck">
                      <div className="back"></div>
                      <div className="front">
                        <div className="window"></div>
                      </div>
                      <div className="light top"></div>
                      <div className="light bottom"></div>
                    </div>
                    {/* <div className="lines"></div>
                    Crear Orden Animado */}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;