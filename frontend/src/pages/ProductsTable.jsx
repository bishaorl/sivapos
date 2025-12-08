import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, removeProduct, setEditProduct, clearValues, searchProductByBarcode } from "../features/product/productSlice";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import ScaleLoader from "react-spinners/ScaleLoader";
import AddProduct from "./AddProduct";

// Componente para generar código de barras SVG
const BarcodeGenerator = ({ value, width = 2, height = 60 }) => {
  if (!value) return null;
  
  // Generar patrón de barras
  const generateBars = () => {
    const bars = [];
    let x = 0;
    
    // Patrón de inicio
    bars.push({ x, width: 2, isBlack: true }); x += 2;
    bars.push({ x, width: 1, isBlack: false }); x += 1;
    bars.push({ x, width: 1, isBlack: true }); x += 1;
    
    // Convertir cada carácter en un patrón de barras
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      const charCode = char.charCodeAt(0);
      
      // Crear un patrón único para cada carácter
      const pattern = (charCode % 100).toString().padStart(2, '0');
      
      for (let j = 0; j < pattern.length; j++) {
        const digit = parseInt(pattern[j]);
        const barWidth = Math.max(1, digit);
        
        bars.push({ x, width: barWidth, isBlack: true }); x += barWidth;
        bars.push({ x, width: 1, isBlack: false }); x += 1;
      }
    }
    
    // Patrón de fin
    bars.push({ x, width: 2, isBlack: true }); x += 2;
    bars.push({ x, width: 1, isBlack: false }); x += 1;
    bars.push({ x, width: 1, isBlack: true }); x += 1;
    
    return bars;
  };
  
  const bars = generateBars();
  const maxWidth = bars.length > 0 ? bars[bars.length - 1].x : 200;

  return (
    <div style={{ 
      display: 'inline-block', 
      background: 'white', 
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    }}>
      <svg 
        width={maxWidth + 20} 
        height={height + 30}
        viewBox={`0 0 ${maxWidth + 20} ${height + 30}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo blanco */}
        <rect x="0" y="0" width={maxWidth + 20} height={height + 30} fill="white" />
        
        {/* Barras */}
        {bars.map((bar, index) => (
          <rect
            key={index}
            x={bar.x + 10}
            y="10"
            width={bar.width}
            height={height}
            fill={bar.isBlack ? "#000" : "#fff"}
          />
        ))}
        
        {/* Texto del código */}
        <text
          x={(maxWidth + 20) / 2}
          y={height + 25}
          textAnchor="middle"
          fontSize="12"
          fill="#000"
          fontFamily="monospace"
        >
          {value}
        </text>
      </svg>
    </div>
  );
};

const ProductsTable = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printProduct, setPrintProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar productos basados en el término de búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm) ||
    (product.barcode && product.barcode.toString().includes(searchTerm))
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

  // Handle barcode search when user presses Enter in the main search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm && searchTerm.trim() !== '') {
        // Check if the search term looks like a barcode (numeric or alphanumeric)
        if (/^[a-zA-Z0-9]+$/.test(searchTerm.trim())) {
          dispatch(searchProductByBarcode(searchTerm.trim()))
            .then((result) => {
              if (result.meta.requestStatus === 'fulfilled') {
                setShowEditModal(true);
              }
            });
        }
      }
    }
  };

  const closeForm = () => {
    setShowEditModal(false);
    // Recargar productos para asegurar que la lista esté actualizada
    dispatch(getProducts());
  };

  // Función de prueba para verificar que el evento onClick funciona
  const testButton = (product) => {
    console.log('Botón de prueba clickeado para el producto:', product);
    alert(`Botón de prueba clickeado para el producto: ${product.name} (${product.barcode})`);
  };

  // Función para mostrar la etiqueta de impresión en un modal
  const showPrintLabel = (product) => {
    // Verificar que el producto tenga código de barras
    if (!product || !product.barcode) {
      alert('Este producto no tiene código de barras');
      return;
    }
    
    console.log('Mostrando etiqueta de impresión para el producto:', product);
    setPrintProduct(product);
    setShowPrintModal(true);
  };

  // Función para imprimir la etiqueta
  const printLabel = () => {
    window.print();
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
                  placeholder="Buscar productos o código de barras..." 
                  className="header__input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
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
              <th style={{ width: '15%' }}>Nombre</th>
              <th style={{ width: '10%' }}>Código de Barras</th>
              <th style={{ width: '10%' }}>Stock</th>
              <th style={{ width: '10%' }}>Precio</th>
              <th style={{ width: '15%' }}>Categoría</th>
              <th style={{ width: '15%' }}>Imagen</th>
              <th style={{ width: '20%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td style={{ width: '5%' }}>{product.id}</td>
                <td style={{ width: '15%' }}>{product.name}</td>
                <td style={{ width: '10%' }}>
                  {product.barcode || 'N/A'}
                  {product.barcode && (
                    <div style={{ marginTop: '5px' }}>
                      {/* Botón de prueba temporal
                      <button 
                        className="btn-barcode-small-3d"
                        onClick={() => testButton(product)}
                        title="Botón de prueba"
                        style={{ 
                          marginLeft: '5px', 
                          padding: '2px 6px', 
                          fontSize: '12px',
                          marginRight: '5px'
                        }}
                      >
                        Test
                      </button> */}
                      <button 
                        className="btn-barcode-small-3d"
                        onClick={() => showPrintLabel(product)}
                        title="Ver e imprimir código de barras"
                        style={{ 
                          marginLeft: '5px', 
                          padding: '2px 6px', 
                          fontSize: '25px', 
                          marginRight: '5px'
                        }}
                      >
                        🖨️
                      </button>
                    </div>
                  )}
                </td>
                <td style={{ width: '10%' }}>{product.stock}</td>
                <td style={{ width: '10%' }}>${product.price}</td>
                <td style={{ width: '15%' }}>{product.category}</td>
                <td style={{ width: '15%' }}>
                  <img src={product.image} alt={product.name} style={{ width: "50px", height: "50px" }} />
                </td>
                {user?.isAdmin && (
                  <td className="actions-cell" style={{ width: '20%' }}>
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
      
      {/* Modal de impresión */}
      {showPrintModal && printProduct && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '30px' }}>
            <div id="print-area" style={{ 
              textAlign: 'center', 
              padding: '20px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>{printProduct.name}</h2>
              {printProduct.price && (
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '20px' }}>
                  Precio: ${parseFloat(printProduct.price).toFixed(2)}
                </p>
              )}
              
              {/* Código de barras visual */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                margin: '20px 0',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px'
              }}>
                <BarcodeGenerator value={printProduct.barcode} />
              </div>
              
              {/* Código de barras numérico */}
              <div style={{ 
                fontFamily: 'monospace', 
                fontSize: '18px', 
                letterSpacing: '2px', 
                padding: '10px', 
                border: '1px dashed #999',
                margin: '10px 0',
                backgroundColor: '#f9f9f9'
              }}>
                {printProduct.barcode}
              </div>
              
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Escanea este código para obtener información del producto
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '20px',
              gap: '10px'
            }}>
              <button 
                className="btn-print-3d"
                onClick={printLabel}
                style={{ flex: 1, padding: '12px' }}
              >
                Imprimir Etiqueta
              </button>
              <button 
                className="btn-edit-3d"
                onClick={() => setShowPrintModal(false)}
                style={{ flex: 1, padding: '12px' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      
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