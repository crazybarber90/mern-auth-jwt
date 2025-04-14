// Opis: Kontroler za upload slike za bilborde
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import ClientBilbord from '../models/clientBilbordModel.js'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import User from '../models/userModel.js' // Uvezivanje modela korisnika

const { Types } = mongoose

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    console.log(req)
    try {
      const user = await User.findById(req.user._id)
      if (!user) {
        return cb(new Error('User not found'), false)
      }

      const userFolder = path.join('uploads', user.name) // Kreiranje foldera sa korisničkim imenom
      const bilbordFolder = path.join(userFolder, req.params.id.toString()) // Kreiranje foldera za bilbord_id

      // Prvo proverava da li postoji `uploads` folder
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads', { recursive: true })
      }

      // Ako folder sa korisničkim imenom ne postoji, kreira ga
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true })
      }

      // Ako folder za bilbord_id ne postoji, kreira ga
      if (!fs.existsSync(bilbordFolder)) {
        fs.mkdirSync(bilbordFolder, { recursive: true })
      }

      // Poziv callback funkciju sa ispravnim direktorijumom
      cb(null, bilbordFolder)
    } catch (error) {
      cb(error, false)
    }
  },
  filename: (req, file, cb) => {
    // Generiše random string za ime fajla
    const randomString = `${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`
    const ext = path.extname(file.originalname) // Ekstenzija fajla
    cb(null, `${randomString}${ext}`) // Fajl će biti nazvan sa random stringom i odgovarajućom ekstenzijom
  },
})

// Konfiguracija multer-a
const upload = multer({ storage })

// @desc    Upload image for a bilbord
// @route   POST /api/bilbord/upload/:bilbordId
// @access  Private
// Funkcija za upload slike
const uploadBilbordImage = asyncHandler(async (req, res) => {
  const { id } = req.params

  // Provera da li je id validan ObjectId
  if (!Types.ObjectId.isValid(id)) {
    res.status(400)
    throw new Error('Invalid bilbord ID')
  }

  // Provera da li je slika uspešno uploadovana
  if (!req.file) {
    res.status(400)
    throw new Error('No file uploaded')
  }

  // Pronalazi bilbord u bazi
  const bilbord = await ClientBilbord.findById(id)
  if (!bilbord) {
    res.status(404)
    throw new Error('Bilbord not found')
  }

  // Ako već postoji stara slika, obriše je
  if (bilbord.imageUrl) {
    // Kreiranje pune putanje do stare slike (skini vodeći "/")
    const oldImagePath = bilbord.imageUrl.replace(/^\//, '')

    fs.access(oldImagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('Stara slika ne postoji:', oldImagePath)
      } else {
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Greška prilikom brisanja stare slike:', err)
          } else {
            console.log('Stara slika uspešno obrisana.')
          }
        })
      }
    })
  }

  // Kreiranje URL-a za novu sliku
  const imageUrl = `/uploads/${req.user.name}/${id}/${req.file.filename}`

  // Ažurira bilbord sa novim URL-om slike
  bilbord.imageUrl = imageUrl
  await bilbord.save()

  // Slanje odgovora sa URL-om slike (punim URL-om)
  res.json({
    message: 'Slika uspešno uploadovana',
    imageUrl: `${req.protocol}://${req.get('host')}${imageUrl}`, // Vraća pun URL
  })
})

// @desc    Get bilbords by userId
// @route   GET /api/clientbilbords/:userId
// @access  Private
const getBilbordsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const page = Number(req.query.page) || 1 // Trenutna stranica, podrazumevano 1
  const limit = 10 // Broj bilborda po stranici
  const skip = (page - 1) * limit // Broj dokumenata koji treba preskočiti

  // Preuzimanje bilborda sa paginacijom
  const bilbords = await ClientBilbord.find({ userId }).skip(skip).limit(limit)

  console.log('BILBORDIIIII', bilbords)
  if (!bilbords || bilbords.length === 0) {
    res.status(404)
    throw new Error('Bilbords not found for this user')
  }

  // Ukupan broj bilborda za korisnika
  const totalBilbords = await ClientBilbord.countDocuments({ userId })

  // Dodavanje punog URL-a za imageUrl svakom bilbordu
  const bilbordsWithFullUrls = bilbords.map((bilbord) => {
    const fullImageUrl = `${req.protocol}://${req.get('host')}${
      bilbord.imageUrl
    }`
    return { ...bilbord.toObject(), imageUrl: fullImageUrl } // Vraćamo objekt sa punim URL-om
  })

  // Vraćanje paginiranih rezultata
  res.status(200).json({
    bilbords: bilbordsWithFullUrls,
    page,
    pages: Math.ceil(totalBilbords / limit), // Ukupan broj stranica
    totalBilbords,
  })
})

// @desc    Get specific bilbord by userId and bilbordId
// @route   GET /api/bilbords/:userId/:bilbordId
// @access  Public
// Ruta za preuzimanje bilborda po userId i bilbordId direktno za klijentov ekran

const getBilbordByUserAndBilbordId = asyncHandler(async (req, res) => {
  const { userId, bilbordId } = req.params

  // Proveri validnost ID-ova
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(bilbordId)) {
    res.status(400)
    throw new Error('Invalid userId or bilbordId')
  }

  // Pronađi bilbord na osnovu userId i bilbordId
  const bilbord = await ClientBilbord.findOne({
    userId,
    _id: bilbordId,
  })

  if (!bilbord) {
    res.status(404)
    throw new Error('Bilbord not found')
  }

  // Dodaj pun URL za imageUrl
  const fullImageUrl = `${req.protocol}://${req.get('host')}${bilbord.imageUrl}`
  const bilbordWithFullUrl = { ...bilbord.toObject(), imageUrl: fullImageUrl }

  // Vrati bilbord sa punim URL-om
  res.status(200).json(bilbordWithFullUrl)
})

// Admin Kreira novi bilbord za određenog korisnika
const createBilbordForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params

  const bilbord = await ClientBilbord.create({
    name: `Bilbord-${Date.now()}`, // Jedinstveno ime
    userId,
    image: '', // Početno prazno polje za sliku
    timestamp: Date.now(),
  })

  if (bilbord) {
    res.status(201).json(bilbord)
  } else {
    res.status(400)
    throw new Error('Greška prilikom kreiranja bilborda')
  }
})

// Admin Briše bilbord za određenog korisnika

const deleteBilbordOfUser = asyncHandler(async (req, res) => {
  const { bilbord_id } = req.params

  const bilbord = await ClientBilbord.findByIdAndDelete(bilbord_id)

  if (bilbord) {
    res.status(200).json({ message: 'Bilbord uspešno obrisan', bilbord })
  } else {
    res.status(404)
    throw new Error('Bilbord nije pronađen')
  }
})

const clientUpdateBilbordName = asyncHandler(async (req, res) => {
  const { id } = req.params

  const bilbord = await ClientBilbord.findById(id)
  const { name: newName } = req.body

  if (bilbord) {
    bilbord.name = newName // Promena imena
    await bilbord.save()
    res.status(200).json({ message: 'Bilbord uspešno obrisan', bilbord })
  } else {
    res.status(404)
    throw new Error('Bilbord nije pronađen')
  }
})

export {
  upload,
  uploadBilbordImage,
  getBilbordsByUserId,
  getBilbordByUserAndBilbordId,
  createBilbordForUser,
  deleteBilbordOfUser,
  clientUpdateBilbordName,
}
