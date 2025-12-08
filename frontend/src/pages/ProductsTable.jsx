import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, removeProduct, setEditProduct, clearValues, searchProductByBarcode } from "../features/product/productSlice";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import ScaleLoader from "react-spinners/ScaleLoader";
import AddProduct from "./AddProduct";

const ProductsTable = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [showEditModal, setShowEditModal] = useState(false);
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

  // Función para imprimir el código de barras de un producto
  const printProductBarcode = (product) => {
    if (!product.barcode) return;
    
    // Crear SVG del código de barras
    const generateBarcodeSVG = (text) => {
      if (!text) return '';
      
      let bars = '';
      let x = 10;
      
      // Patrón de inicio
      bars += `<rect x="${x}" y="10" width="2" height="50" fill="#000" />`; x += 2;
      bars += `<rect x="${x}" y="10" width="1" height="50" fill="#fff" />`; x += 1;
      bars += `<rect x="${x}" y="10" width="1" height="50" fill="#000" />`; x += 1;
      
      // Convertir texto a barras
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charCode = char.charCodeAt(0);
        const pattern = (charCode % 100).toString().padStart(2, '0');
        
        for (let j = 0; j < pattern.length; j++) {
          const digit = parseInt(pattern[j]);
          const barWidth = Math.max(1, digit);
          
          bars += `<rect x="${x}" y="10" width="${barWidth}" height="50" fill="#000" />`; x += barWidth;
          bars += `<rect x="${x}" y="10" width="1" height="50" fill="#fff" />`; x += 1;
        }
      }
      
      // Patrón de fin
      bars += `<rect x="${x}" y="10" width="2" height="50" fill="#000" />`; x += 2;
      bars += `<rect x="${x}" y="10" width="1" height="50" fill="#fff" />`; x += 1;
      bars += `<rect x="${x}" y="10" width="1" height="50" fill="#000" />`; x += 1;
      
      return `
        <svg width="${x + 10}" height="80" viewBox="0 0 ${x + 10} 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="${x + 10}" height="80" fill="white" />
          ${bars}
          <text x="${(x + 10) / 2}" y="75" text-anchor="middle" font-family="monospace" font-size="12" fill="#000">${text}</text>
        </svg>
      `;
    };
    
    const barcodeSVG = generateBarcodeSVG(product.barcode);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Código de Barras - ${product.name}</title>
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              margin: 0; 
              background: white;
              font-family: Arial, sans-serif;
            }
            .barcode-container {
              text-align: center;
              padding: 30px;
              border: 2px solid #eee;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background: white;
            }
            .product-name {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #333;
            }
            .product-price {
              font-size: 18px;
              margin-bottom: 20px;
              color: #e74c3c;
              font-weight: bold;
            }
            .barcode-wrapper {
              padding: 15px;
              background: white;
              display: inline-block;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .print-btn {
              margin-top: 25px;
              padding: 12px 24px;
              background: linear-gradient(145deg, #007bff, #0056b3);
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              box-shadow: 0 4px 8px rgba(0,123,255,0.3);
              transition: all 0.2s ease;
            }
            .print-btn:hover {
              background: linear-gradient(145deg, #0056b3, #007bff);
              transform: translateY(-2px);
              box-shadow: 0 6px 12px rgba(0,123,255,0.4);
            }
            .print-btn:active {
              transform: translateY(0);
              box-shadow: 0 2px 4px rgba(0,123,255,0.3);
            }
            @media print {
              .print-btn {
                display: none;
              }
              body {
                background: white;
              }
              .barcode-container {
                border: none;
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            <div class="product-name">${product.name}</div>
            ${product.price ? `<div class="product-price">$${product.price.toFixed(2)}</div>` : ''}
            <div class="barcode-wrapper">
              ${barcodeSVG}
            </div>
            <button class="print-btn" onclick="window.print()">Imprimir Etiqueta</button>
          </div>
          <script>
            // Auto-imprimir cuando se carga la página (opcional)
            // window.onload = function() {
            //   window.print();
            // }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
                      <button 
                        className="btn-barcode-small-3d"
                        onClick={() => printProductBarcode(product)}
                        title="Ver e imprimir código de barras"
                        style={{ 
                          marginLeft: '5px', 
                          padding: '2px 6px', 
                          fontSize: '12px' 
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