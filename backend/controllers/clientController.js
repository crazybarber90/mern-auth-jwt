import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// @desc    Get all clients sorted alphabetically with pagination
// @route   GET /api/users/all-clients
// @access  Private
const adminGetAllClients = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1 // Trenutna stranica, podrazumevano 1
  const limit = 7 // Broj korisnika po stranici
  const skip = (page - 1) * limit // Broj preskočenih dokumenata

  try {
    // Sortiramo po imenu klijenta (pretpostavljamo da postoji polje "name")
    const clients = await User.find({ role: 'client' })
      .sort({ name: 1 }) // Sortira abecedno, rastuće (A-Z)
      .skip(skip)
      .limit(limit)

    const totalClients = await User.countDocuments({ role: 'client' })

    res.status(200).json({
      clients,
      page,
      pages: Math.ceil(totalClients / limit), // Ukupan broj stranica
      totalClients,
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch clients', error: error.message })
  }
})

export { adminGetAllClients }
