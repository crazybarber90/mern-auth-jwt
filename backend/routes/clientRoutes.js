import express from 'express'

import { adminGetAllClients } from '../controllers/clientController.js'

import { protect } from '../middleware/authMiddleware.js' //  zaštita rute

const router = express.Router()

// Ruta za preuzimanje svih klienta
router.get('/all-clients', protect, adminGetAllClients)

export default router
