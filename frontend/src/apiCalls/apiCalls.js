// import axios from 'axios'
import api from './apiConfig'

export const loginUserApi = (data) => {
  console.log('USAO U login API')

  return api.post('/users/auth', data).then((response) => response.data)
}

export const registerUserApi = (data) => {
  return api.post('/users', data).then((response) => response.data)
}

export const logoutUserApi = () => {
  return api.post('/users/logout').then((response) => response.data)
}

export const updateUserApi = (data) => {
  return api.put('/users/profile', data).then((response) => response.data)
}

// Funkcija za upload slika za bilbord
export const uploadBilbordApi = (id, formData) => {
  console.log('Uploading image for id:', id)

  for (let pair of formData.entries()) {
    console.log(`FormData content: ${pair[0]} = ${pair[1]}`)
  }

  return api
    .post(`/bilbord/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ovo možete čak i izostaviti jer će Axios automatski postaviti
      },
    })
    .then((response) => response.data)
}

// Funkcija za preuzimanje bilborda po userId
export const getClientBilbordsApi = ({ userId, page }) => {
  return api
    .get(`/bilbord/${userId}?page=${page}`)
    .then((response) => response.data)
}

// Funkcija za preuzimanje bilborda po userId
export const getBilbordApi = ({ userId, bilbordId }) => {
  return api
    .get(`/bilbord/${userId}/${bilbordId}`)
    .then((response) => response.data)
}
// FUNKCIJA ZA ADMINA I SUPERADMINA ZA PREUZIMANJE SVIH KLIJENATA
export const getAllClientsApi = (page = 1) => {
  return api
    .get(`/clients/all-clients?page=${page}`)
    .then((response) => response.data)
}

export const getAllClientsBilbordsApi = ({ userId, page }) => {
  console.log('userId', userId, 'page', page)
  return api
    .get(`/bilbord/all-clients-bilbords/${userId}?page=${page}`)
    .then((response) => response.data)
}

// FUNKCIJA ZA ADMINA I SUPERADMINA ZA DODAVANJE BILBORDA KORISNIKU
export const adminCreateBilbordForUserApi = (userId) => {
  return api
    .post(`/bilbord/adminAddBilbord/${userId}`)
    .then((response) => response.data)
}
