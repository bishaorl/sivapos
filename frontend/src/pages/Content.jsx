import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Categories from "./Categories";
import Products from "./Products";
import Statistics from "../components/Statistics";
import { searchProductByBarcode } from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";

const Content = () => {
  const dispatch = useDispatch();
  const [barcode, setBarcode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const barcodeInputRef = useRef(null);

  const handleBarcodeSearch = async (e) => {
    e.preventDefault();
    
    if (!barcode.trim()) {
      toast.error("Por favor ingrese un código de barras");
      return;
    }

    setIsSearching(true);
    
    try {
      // Buscar el producto por código de barras
      const resultAction = await dispatch(searchProductByBarcode(barcode));
      
      if (searchProductByBarcode.fulfilled.match(resultAction)) {
        const product = resultAction.payload;
        
        // Verificar que el producto tenga todos los datos requeridos
        if (product && product.id && product.name && product.price) {
          // Agregar el producto al carrito
          dispatch(addToCart(product));
          toast.success(`Producto "${product.name}" agregado al carrito`);
          setBarcode(""); // Limpiar el campo de búsqueda
          
          // Devolver el foco al campo de búsqueda después de un breve retraso
          setTimeout(() => {
            if (barcodeInputRef.current) {
              barcodeInputRef.current.focus();
            }
          }, 100);
        } else {
          toast.error("El producto encontrado no tiene la información completa requerida");
        }
      } else {
        // Manejar errores de búsqueda
        const errorMessage = resultAction.payload?.message || "Producto no encontrado";
        toast.error(errorMessage);
        
        // Devolver el foco al campo de búsqueda incluso si hay error
        setTimeout(() => {
          if (barcodeInputRef.current) {
            barcodeInputRef.current.focus();
          }
        }, 100);
      }
    } catch (error) {
      toast.error("Error al buscar el producto");
      console.error("Error al buscar producto por código de barras:", error);
      
      // Devolver el foco al campo de búsqueda incluso si hay error
      setTimeout(() => {
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus();
        }
      }, 100);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <Statistics />

      <div className="products-title">
        <h1 className="products">Categorias</h1>
      </div>

      <Categories />

      <div className="products-title">
        <h1 className="products">Todos los Productos</h1>
      </div>

      {/* Formulario de búsqueda por código de barras */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: '20px',
        marginTop: '10px'
      }}>
        <form 
          onSubmit={handleBarcodeSearch}
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            maxWidth: '500px'
          }}
        >
          <input
            ref={barcodeInputRef}
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Ingrese código de barras..."
            style={{
              flex: 1,
              padding: '10px 15px',
              borderRadius: '8px',
              border: '2px solid #e1e5eb',
              fontSize: '16px',
              fontFamily: 'var(--font-family2)'
            }}
            disabled={isSearching}
            autoFocus
          />
          <button 
            type="submit"
            className="btn-barcode-3d"
            disabled={isSearching}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              fontSize: '16px'
            }}
          >
            {isSearching ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="spinner" style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderWidth: '2px',
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderTopColor: 'white'
                }}></span>
                Buscando...
              </span>
            ) : (
              "🔍 Buscar"
            )}
          </button>
        </form>
      </div>

      <Products />
    </>
  );
};

export default Content;