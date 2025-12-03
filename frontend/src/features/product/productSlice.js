import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import productService from '../product/productService'
import { toast } from 'react-toastify'

const initialState = {
    products: [],
    filterProduct: [],
    name: '',
    stock: '',
    image: '',
    price: '',
    category: '',
    error: false,
    loading: false,
    isEditing: false,
    editProductId: '',
}

export const productCreate = createAsyncThunk('product/productCreate', async (product, thunkAPI) => {
    try {
       return await productService.productCreate(product)
    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const getProducts = createAsyncThunk('product/getProducts', async (_, thunkAPI) => {
    try {
       return await productService.getProducts()
    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const editProduct = createAsyncThunk('product/editProduct', async (product, thunkAPI) => {
    try {
       return await productService.editProduct(product)
    } catch (error) {
         console.error('Error al actualizar el producto:', error);
         return thunkAPI.rejectWithValue(error.response?.data || { message: 'Error al actualizar el producto' })
    }
})

export const categoryProductFilter = createAsyncThunk('product/categoryProductFilter', async (category, thunkAPI) => {
    try {
       return await productService.categoryProductFilter(category)
    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const updateProduct = createAsyncThunk('product/updateProduct', async ({ productId, productData }, thunkAPI) => {
    try {
        return await productService.updateProduct(productId, productData)
    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const removeProduct = createAsyncThunk('product/removeProduct', async (productId, thunkAPI) => {
    try {
        return await productService.removeProduct(productId)
    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
     handleChange: (state, { payload: { name, value } }) => {
        state[name] = value
        },
        setEditProduct: (state, action) => {
            return {...state, isEditing :true, editProductId: action.payload.id, ...action.payload}
        },
        clearValues: () => {
            return {
                ...initialState,
            }
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(productCreate.pending, (state) => {
            state.loading = true
        })
        .addCase(productCreate.fulfilled, (state, action) => {
            state.loading = false
            // Agregamos el nuevo producto a la lista de productos
            state.products.push(action.payload)
            toast.success('Producto agregado')
        })
        .addCase(productCreate.rejected, (state, action) => {
            state.loading = false
            state.error = true
        })
        .addCase(getProducts.pending, (state) => {
            state.loading = true
        })
        .addCase(getProducts.fulfilled, (state, action) => {
            state.loading = false
            state.products = action.payload
        })
        .addCase(getProducts.rejected, (state, action) => {
            state.loading = false
            state.error = true
        })
        .addCase(editProduct.pending, (state) => {
            state.loading = true
        })
        .addCase(editProduct.fulfilled, (state, action) => {
            state.loading = false
            state.isEditing = false
            // Update the product in the products array
            state.products = state.products.map(p => p.id === action.payload.id ? action.payload : p)
            toast.success('Producto actualizado exitosamente')
        })
        .addCase(editProduct.rejected, (state, action) => {
            state.loading = false
            state.error = true
            const errorMessage = action.payload?.message || 'Error al actualizar el producto';
            toast.error(errorMessage);
            console.error('Error en editProduct.rejected:', action.payload);
        })
        .addCase(categoryProductFilter.pending, (state) => {
            state.loading = true
        })
        .addCase(categoryProductFilter.fulfilled, (state, action) => {
            state.loading = false
            state.filterProduct = action.payload
        })
        .addCase(categoryProductFilter.rejected, (state, action) => {
            state.loading = false
            state.error = true
        }) 
        .addCase(removeProduct.pending, (state) => {
            state.loading = true
        })
        .addCase(removeProduct.fulfilled, (state, action) => {
            state.loading = false
            // update products state
            let removeProduct = state.products.filter(item => item.id !== action.payload.id)
            state.products = removeProduct
            toast.success('Producto eliminado exitosamente')
        })
        .addCase(removeProduct.rejected, (state, action) => {
            state.loading = false
            state.error = true
        }) 
    }
})

export const { handleChange, setEditProduct, clearValues, addProduct } = productSlice.actions;
export default productSlice.reducer

