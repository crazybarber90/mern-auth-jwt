import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeModal: {
    adminModal: false,
  },
}

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal: (state, action) => {
      state.activeModal[action.payload] = true
    },
    hideModal: (state, action) => {
      state.activeModal[action.payload] = false
    },
    closeAllModals: (state) => {
      state.activeModal = {
        adminModal: false,
      }
    },
    toggleAdminModal: (state, action) => {
      state.activeModal[action.payload] = !state.activeModal[action.payload]
    },
  },
})

export const { showModal, hideModal, closeAllModals, toggleAdminModal } =
  modalsSlice.actions

export default modalsSlice.reducer
