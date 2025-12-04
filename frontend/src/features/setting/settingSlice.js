import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import settingService from './settingService'
import { toast } from 'react-toastify'

const initialState = {
    setting: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

// Get setting
export const getSetting = createAsyncThunk('setting/getSetting', async (_, thunkAPI) => {
    try {
        return await settingService.getSetting()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Save setting
export const saveSetting = createAsyncThunk('setting/saveSetting', async (settingData, thunkAPI) => {
    try {
        return await settingService.saveSetting(settingData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSetting.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getSetting.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.setting = action.payload
            })
            .addCase(getSetting.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(saveSetting.pending, (state) => {
                state.isLoading = true
            })
            .addCase(saveSetting.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.setting = action.payload
                toast.success('Configuración guardada exitosamente')
            })
            .addCase(saveSetting.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                toast.error(action.payload)
            })
    }
})

export const { reset } = settingSlice.actions
export default settingSlice.reducer