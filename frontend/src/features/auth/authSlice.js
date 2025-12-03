import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from '../auth/authService'
import { toast } from 'react-toastify'
import {addLocalStorageUser, getLocalStorageUser, deleteLocalStorageUser} from '../../utils/localStorage'

const user = getLocalStorageUser()

const initialState = {
    user: user ? user : '',
    users: [],
    error: false,
    loading: false,
    message: ''
}

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
      return await authService.login(user)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const logout = createAsyncThunk('auth/logout', (_, thunkAPI) => {
    try {
      return authService.logout()
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const allUsers = createAsyncThunk('auth/allUsers', (_, thunkAPI) => {
    try {
      return authService.allUsers()
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const updateUser = createAsyncThunk('auth/updateUser', async ({ userId, userData }, thunkAPI) => {
    try {
      console.log('Updating user:', { userId, userData });
      return await authService.updateUser(userId, userData)
    } catch (error) {
        console.error('Error in updateUser thunk:', error);
        // Verificar si hay respuesta del servidor
        if (error.response) {
            console.error('Server response:', error.response);
            return thunkAPI.rejectWithValue(error.response.data)
        } else if (error.request) {
            console.error('No response received:', error.request);
            return thunkAPI.rejectWithValue({ message: 'No se recibió respuesta del servidor' })
        } else {
            console.error('Error setting up request:', error.message);
            return thunkAPI.rejectWithValue({ message: 'Error al configurar la solicitud' })
        }
    }
})

export const removeUser = createAsyncThunk('auth/removeUser', async (userId, thunkAPI) => {
    try {
      return await authService.removeUser(userId)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false
            state.error = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.loading = true
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false
            // Actualizar la lista de usuarios
            state.users.push(action.payload);
            toast.success('Usuario registrado exitosamente')
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false
            state.error = true
            state.message = action.payload
            state.user = null
        })
        .addCase(login.pending, (state) => {
            state.loading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            addLocalStorageUser(action.payload)
            toast.success('Inicio de Sesión Exitoso')
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false
            state.error = true
            state.message = action.payload
            state.user = null
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null
            deleteLocalStorageUser()
            toast.success('Cerrando Sesion de Userio')
        })
        .addCase(allUsers.fulfilled, (state, action) => {
            state.users = action.payload
        })
        .addCase(updateUser.pending, (state) => {
            state.loading = true
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false
            // update users state
            let updatedUsers = state.users.map(user =>
                user._id === action.payload._id ? action.payload : user
            )
            state.users = updatedUsers
            toast.success('Usuario actualizado correctamente')
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.loading = false
            state.error = true
        })
        .addCase(removeUser.pending, (state) => {
            state.loading = true
        })
        .addCase(removeUser.fulfilled, (state, action) => {
            state.loading = false
            // update users state
            let removeUser = state.users.filter(item => item._id !== action.payload._id)
            state.users = removeUser
            toast.success('Usuario eliminado correctamente')
        })
        .addCase(removeUser.rejected, (state, action) => {
            state.loading = false
            state.error = true
        })
    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer
