import express from 'express'

import {
  upload,
  getBilbordsByUserId,
  uploadBilbordImage,
} from '../controllers/uploadImgControler.js'

import { protect } from '../middleware/authMiddleware.js' //  zaštita rute

const router = express.Router()

// Ruta za preuzimanje bilborda po userId
router.get('/:userId', protect, getBilbordsByUserId)

// Ruta za upload slike za bilbord
router.post('/:id', protect, upload.single('image'), uploadBilbordImage)

export default router
