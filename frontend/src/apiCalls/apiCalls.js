// import axios from 'axios'
import api from './apiConfig'

// Funkcija za logovanje korisnika po ID
export const loginUserApi = (data) => {
  console.log('USAO U login API')
  return api.post('/users/auth', data).then((response) => response.data)
}

// Funkcija za regstrovanje korisnika
export const registerUserApi = (data) => {
  return api.post('/users', data).then((response) => response.data)
}

// Funkcija za logout korisnika
export const logoutUserApi = () => {
  return api.post('/users/logout').then((response) => response.data)
}

// Funkcija za update korisnika
export const updateUserApi = (data) => {
  return api.put('/users/profile', data).then((response) => response.data)
}

// Funkcija za upload slika za bilbord
export const uploadBilbordApi = (id, formData) => {
  for (let pair of formData.entries()) {
    console.log(`FormData content: ${pair[0]} = ${pair[1]}`)
  }
  return api
    .post(`/bilbord/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data)
}

// Funkcija za klijenta - preuzimanje bilborda po userId
export const getClientBilbordsApi = ({ userId, page }) => {
  return api
    .get(`/bilbord/${userId}?page=${page}`)
    .then((response) => response.data)
}

// Funkcija za PRIKAZ bilborda po userId / bilbordId
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

// FUNKCIJA ZA ADMINA I SUPERADMINA ZA PREUZIMANJE SVIH BILBORDA KLIJENTA
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
