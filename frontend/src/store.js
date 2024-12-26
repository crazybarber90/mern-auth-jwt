import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { apiSlice } from './slices/apiSlice'
import modalsReducer from './slices/modalsSlices'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    modals: modalsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
})

export default store
