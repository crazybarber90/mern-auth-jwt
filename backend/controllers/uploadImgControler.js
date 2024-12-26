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

  // Preuzimanje bilborda za korisnika sa userId
  const bilbords = await ClientBilbord.find({ userId })

  if (!bilbords || bilbords.length === 0) {
    res.status(404)
    throw new Error('Bilbords not found for this user')
  }

  // Dodavanje punog URL-a za imageUrl svakom bilbordu
  const bilbordsWithFullUrls = bilbords.map((bilbord) => {
    const fullImageUrl = `${req.protocol}://${req.get('host')}${
      bilbord.imageUrl
    }`
    return { ...bilbord.toObject(), imageUrl: fullImageUrl } // Vraćamo objekt sa punim URL-om
  })

  res.status(200).json(bilbordsWithFullUrls)
})

export { upload, uploadBilbordImage, getBilbordsByUserId }
