import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../features/category/categorySlice";
import {
  productCreate,
  handleChange,
  clearValues,
  editProduct,
  addProduct,
  searchProductByBarcode,
} from "../features/product/productSlice";
import { toast } from "react-toastify";

// Componente para mostrar código de barras como SVG
const BarcodeSVG = ({ value, width = 2, height = 60 }) => {
  if (!value) return null;
  
  // Generar patrón de barras Code128 básico
  const generateBars = (text) => {
    const bars = [];
    let x = 0;
    
    // Patrón de inicio Code128
    bars.push({ x, width: 2, isBar: true }); x += 2;
    bars.push({ x, width: 1, isBar: false }); x += 1;
    bars.push({ x, width: 1, isBar: true }); x += 1;
    
    // Convertir cada carácter en un patrón de barras
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charCode = char.charCodeAt(0);
      
      // Crear un patrón único para cada carácter
      const pattern = (charCode % 100).toString().padStart(2, '0');
      
      for (let j = 0; j < pattern.length; j++) {
        const digit = parseInt(pattern[j]);
        const barWidth = Math.max(1, digit);
        
        bars.push({ x, width: barWidth, isBar: true }); x += barWidth;
        bars.push({ x, width: 1, isBar: false }); x += 1;
      }
    }
    
    // Patrón de fin
    bars.push({ x, width: 2, isBar: true }); x += 2;
    bars.push({ x, width: 1, isBar: false }); x += 1;
    bars.push({ x, width: 1, isBar: true }); x += 1;
    
    return bars;
  };
  
  const bars = generateBars(value);
  const maxWidth = bars.length > 0 ? bars[bars.length - 1].x : 200;

  return (
    <div style={{ display: 'inline-block', background: 'white', padding: '10px' }}>
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
            fill={bar.isBar ? "#000" : "#fff"}
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

const AddProduct = ({ closeModal }) => {
  const {
    name,
    stock,
    image,
    price,
    category,
    barcode,
    isEditing,
    editProductId,
    loading,
  } = useSelector((store) => store.product);
  const { categories } = useSelector((store) => store.category);
  const { user: currentUser } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const barcodeInputRef = useRef(null);
  const [showBarcode, setShowBarcode] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Generar código de barras cuando el barcode cambie
  useEffect(() => {
    if (barcode && barcode.trim() !== '') {
      setShowBarcode(true);
    } else {
      setShowBarcode(false);
    }
  }, [barcode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(handleChange({ name: 'image', value: reader.result }));
        toast.success('Imagen seleccionada correctamente');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    dispatch(handleChange({ name, value }));
  };

  // Handle barcode search when user presses Enter
  const handleBarcodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (barcode && barcode.trim() !== '') {
        dispatch(searchProductByBarcode(barcode.trim()));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !stock || !price || !category) {
      toast.warning("Por favor, complete todos los campos requeridos");
      return;
    }

    if (isEditing) {
      dispatch(
        editProduct({
          product: {
            id: editProductId,
            name,
            stock: Number(stock),
            image,
            price: Number(price),
            category,
            barcode,
            userId: currentUser.id,
          },
        })
      ).then(() => {
        // Solo cerrar el modal después de que la actualización sea exitosa
        dispatch(clearValues());
        if (closeModal) closeModal();
      });
      return;
    }
    
    // Para creación de nuevos productos
    dispatch(productCreate({ name, stock, image, price, category, barcode }))
      .then((result) => {
        // Agregar el nuevo producto a la lista
        if (result.payload) {
          dispatch(addProduct(result.payload));
        }
        // Mostrar mensaje de éxito
        toast.success("Producto agregado exitosamente");
        // Cerrar el modal inmediatamente
        dispatch(clearValues());
        if (closeModal) closeModal();
      });
  };

  // Función para imprimir el código de barras
  const printBarcode = () => {
    if (!barcode) return;
    
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
    
    const barcodeSVG = generateBarcodeSVG(barcode);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Código de Barras - ${name || 'Producto'}</title>
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
            <div class="product-name">${name || 'Producto'}</div>
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

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <button type="button" className="exit" onClick={() => { dispatch(clearValues()); if (closeModal) closeModal(); }}>
          X
        </button>
        <div className="add-form">
          <h1 className="new-product">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h1>
        </div>

        <div className="form-input barcode-input-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              placeholder="Código de Barras"
              name="barcode"
              value={barcode}
              onChange={onChange}
              onKeyPress={handleBarcodeKeyPress}
              ref={barcodeInputRef}
              style={{ flex: 1 }}
            />
            <button 
              type="button" 
              className="btn-barcode-3d"
              onClick={() => {
                // Generar un código de barras aleatorio si está vacío
                if (!barcode || barcode.trim() === '') {
                  const randomBarcode = Math.floor(Math.random() * 100000000000).toString();
                  dispatch(handleChange({ name: 'barcode', value: randomBarcode }));
                }
              }}
              title="Generar Código de Barras"
            >
              📷
            </button>
          </div>
          
          {/* Mostrar código de barras generado */}
          {showBarcode && (
            <div className="barcode-display">
              <BarcodeSVG value={barcode} />
              <div style={{ marginTop: '15px' }}>
                <button 
                  type="button" 
                  className="btn-print-3d"
                  onClick={printBarcode}
                >
                  Imprimir Etiqueta
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-input">
          <input
            type="text"
            placeholder="Nombre del Producto"
            name="name"
            value={name}
            onChange={onChange}
          />
        </div>

        <div className="form-input">
          <input
            type="number"
            placeholder="Stock"
            name="stock"
            value={stock}
            onChange={onChange}
          />
        </div>

        <div className="form-input">
          <div className="image-upload-container">
            <input
              type="text"
              placeholder="Enlace de Imagen del Producto"
              name="image"
              value={image}
              onChange={onChange}
              style={{ paddingRight: '120px' }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button 
              type="button"
              className="browse-button-3d"
              onClick={triggerFileSelect}
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="form-input">
          <input
            type="number"
            placeholder="Precio"
            name="price"
            value={price}
            onChange={onChange}
          />
        </div>

        <div className="form-input">
          <select
            className="select-category"
            name="category"
            onChange={onChange}
          >
            <option value="">Seleccionar Categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-input">
          {isEditing ? (
            <button className="product-btn" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Producto"}
            </button>
          ) : (
            <button className="product-btn">Agregar Producto</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;