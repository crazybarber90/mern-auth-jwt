import axios from 'axios'
import store from '../store'
import { logout } from '../slices/authSlice'
import { closeAllModals } from '../slices/modalsSlices'
import { toast } from 'react-toastify'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // baseURL: 'https://digitalizujse.rs/api',
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ovo omogućava slanje cookies sa svakim zahtevom
})

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    // console.log("error", error);
    if (error.response.status === 511) {
      localStorage.removeItem('token')
      await store.dispatch(logout())
      await store.dispatch(closeAllModals())

      toast.warning('Istekla vaša sesija, molimo da se ponovo prijavite')
    }
    return Promise.reject(error)
  }
)

export default api
