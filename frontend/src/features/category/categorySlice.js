import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import categoryService from '../category/categoryService'
import { toast } from 'react-toastify'

const initialState = {
    categories: [],
    category: '',
    image: '',
    error: false,
    loading: false,
    isEditing: false,
    editCategoryId: null,
}

export const categoryCreate = createAsyncThunk('category/categoryCreate', async (category, thunkAPI) => {
    try {
       return await categoryService.categoryCreate(category)
    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const getCategories = createAsyncThunk('category/getCategories', async (_, thunkAPI) => {
    try {
       return await categoryService.getCategories()
    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const updateCategory = createAsyncThunk('category/updateCategory', async ({ categoryId, categoryData }, thunkAPI) => {
    try {
        console.log('Updating category with ID:', categoryId);
        console.log('Category data:', categoryData);
        return await categoryService.updateCategory(categoryId, categoryData)
    } catch (error) {
         console.error('Error updating category:', error);
         return thunkAPI.rejectWithValue(error.response?.data || { message: 'Error updating category' })
    }
})

export const removeCategory = createAsyncThunk('category/removeCategory', async (categoryId, thunkAPI) => {
    try {
        return await categoryService.removeCategory(categoryId)
    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
     handleChange: (state, { payload: { name, value } }) => {
        state[name] = value
    },
    clearValues: () => {
      return {
        ...initialState,
      }
    },
    setEditCategory: (state, action) => {
      state.isEditing = true;
      state.editCategoryId = action.payload._id || action.payload.id;
      state.category = action.payload.category;
      state.image = action.payload.image;
    }
    },
    extraReducers: (builder) => {
        builder
        .addCase(categoryCreate.pending, (state) => {
            state.loading = true
        })
        .addCase(categoryCreate.fulfilled, (state, action) => {
            state.loading = false
            toast.success('category added')
        })
        .addCase(categoryCreate.rejected, (state, action) => {
            state.loading = false
            state.error = true
            //toast.error('category error')
        })
        .addCase(getCategories.pending, (state) => {
            state.loading = true
        })
        .addCase(getCategories.fulfilled, (state, action) => {
            state.loading = false
            state.categories = action.payload
        })
        .addCase(getCategories.rejected, (state, action) => {
            state.loading = false
            state.error = true
        })
        .addCase(updateCategory.pending, (state) => {
            state.loading = true
        })
        .addCase(updateCategory.fulfilled, (state, action) => {
            state.loading = false
            // update categories state
            let updatedCategories = state.categories.map(category =>
                (category._id === action.payload._id || category.id === action.payload.id) ? action.payload : category
            )
            state.categories = updatedCategories
            toast.success('category successfully updated')
        })
        .addCase(updateCategory.rejected, (state, action) => {
            state.loading = false
            state.error = true
        })
        .addCase(removeCategory.pending, (state) => {
            state.loading = true
        })
        .addCase(removeCategory.fulfilled, (state, action) => {
            state.loading = false
            // Crear una nueva referencia del array de categorías excluyendo la categoría eliminada
            const updatedCategories = state.categories.filter(item => (item._id !== action.payload._id && item.id !== action.payload.id))
            state.categories = updatedCategories
            toast.success('category successfully deleted')
        })
        .addCase(removeCategory.rejected, (state, action) => {
            state.loading = false
            state.error = true
        })
    }
})

export const { handleChange, clearValues, setEditCategory } = categorySlice.actions;
export default categorySlice.reducer