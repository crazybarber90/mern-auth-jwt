import express from 'express'

import {
  upload,
  getBilbordsByUserId,
  uploadBilbordImage,
  getBilbordByUserAndBilbordId,
  createBilbordForUser,
} from '../controllers/uploadImgControler.js'

import { protect } from '../middleware/authMiddleware.js' //  zaštita rute

const router = express.Router()

// Ruta za preuzimanje bilborda po userId
router.get('/all-clients-bilbords/:userId', protect, getBilbordsByUserId)
router.get('/:userId', protect, getBilbordsByUserId)
// Ruta za preuzimanje bilborda po userId i bilbordId direktno za klijentov ekran
router.get('/:userId/:bilbordId', getBilbordByUserAndBilbordId)

// Ruta za upload slike za bilbord
router.post('/:id', protect, upload.single('image'), uploadBilbordImage)
// Ruta za admin-kreiranje novog bilborda za korisnika
router.post('/adminAddBilbord/:userId', protect, createBilbordForUser)

export default router
