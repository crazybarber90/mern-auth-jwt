import express from 'express'

import {
  upload,
  getBilbordsByUserId,
  uploadBilbordImage,
  getBilbordByUserAndBilbordId,
} from '../controllers/uploadImgControler.js'

import { protect } from '../middleware/authMiddleware.js' //  zaštita rute

const router = express.Router()

// Ruta za preuzimanje bilborda po userId
router.get('/:userId', protect, getBilbordsByUserId)

// Ruta za upload slike za bilbord
router.post('/:id', protect, upload.single('image'), uploadBilbordImage)

// Ruta za preuzimanje bilborda po userId i bilbordId
router.get('/:userId/:bilbordId', getBilbordByUserAndBilbordId)

export default router
