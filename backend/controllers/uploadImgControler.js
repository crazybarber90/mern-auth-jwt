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
    try {
      const bilbord = await ClientBilbord.findById(req.params.id)
      if (!bilbord) {
        return cb(new Error('Bilbord not found'), false)
      }

      const user = await User.findById(bilbord.userId)
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
// @route   POST /api/bilbord/:bilbordId
// @access  Private
// Funkcija za upload slike bilborda
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

  // Pronalazi korisnika kome pripada bilbord
  const user = await User.findById(bilbord.userId)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Briše postojeći image ili video fajl ako postoji

  const previousFiles = [bilbord.imageUrl, bilbord.videoUrl]
  previousFiles.forEach((fileUrl) => {
    if (fileUrl) {
      const oldFilePath = fileUrl.replace(/^\//, '')
      fs.access(oldFilePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error('Greška prilikom brisanja fajla:', err)
            } else {
              console.log('Stari fajl uspešno obrisan:', oldFilePath)
            }
          })
        }
      })
    }
  })

  // Kreiranje URL-a za novu sliku
  // const imageUrl = `/uploads/${req.user.name}/${id}/${req.file.filename}`
  const imageUrl = `/uploads/${user.name}/${id}/${req.file.filename}`

  // Ažurira bilbord sa novim URL-om slike
  bilbord.imageUrl = imageUrl
  bilbord.videoUrl = ''
  bilbord.mediaType = 'image'

  await bilbord.save()

  // Slanje odgovora sa URL-om slike (punim URL-om)
  res.json({
    message: 'Slika uspešno uploadovana',
    imageUrl: `${req.protocol}://${req.get('host')}${imageUrl}`, // Vraća pun URL
  })
})

// @desc    Upload video for a bilbord
// @route   POST /api/bilbord/video/:bilbordId
// @access  Private
// Funkcija za upload Videa bilborda
const uploadBilbordVideo = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!Types.ObjectId.isValid(id)) {
    res.status(400)
    throw new Error('Invalid bilbord ID')
  }

  if (!req.file) {
    res.status(400)
    throw new Error('No video uploaded')
  }

  const bilbord = await ClientBilbord.findById(id)
  if (!bilbord) {
    res.status(404)
    throw new Error('Bilbord not found')
  }

  const user = await User.findById(bilbord.userId)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Briše postojeći image ili video fajl ako postoji
  const previousFiles = [bilbord.imageUrl, bilbord.videoUrl]
  previousFiles.forEach((fileUrl) => {
    if (fileUrl) {
      const oldFilePath = fileUrl.replace(/^\//, '')
      fs.access(oldFilePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error('Greška prilikom brisanja fajla:', err)
            } else {
              console.log('Stari fajl uspešno obrisan:', oldFilePath)
            }
          })
        }
      })
    }
  })

  // Novi video URL
  const videoUrl = `/uploads/${user.name}/${id}/${req.file.filename}`
  bilbord.videoUrl = videoUrl
  bilbord.imageUrl = ''
  bilbord.mediaType = 'video'

  await bilbord.save()

  // Slanje odgovora sa URL-om videa (punim URL-om)
  res.json({
    message: 'Video uspešno uploadovan',
    videoUrl: `${req.protocol}://${req.get('host')}${videoUrl}`,
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

  // Ukupan broj bilborda za korisnika
  const totalBilbords = await ClientBilbord.countDocuments({ userId })

  // Dodavanje punog URL-a za imageUrl svakom bilbordu
  const bilbordsWithFullUrls = bilbords.map((bilbord) => {
    const fullImageUrl = bilbord.imageUrl
      ? `${req.protocol}://${req.get('host')}${bilbord.imageUrl}`
      : ''
    const fullVideoUrl = bilbord.videoUrl
      ? `${req.protocol}://${req.get('host')}${bilbord.videoUrl}`
      : ''

    return {
      ...bilbord.toObject(),
      imageUrl: bilbord.mediaType === 'image' ? fullImageUrl : '',
      videoUrl: bilbord.mediaType === 'video' ? fullVideoUrl : '',
    }
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

  // Kreiranje punog url-a za preview slike i videa gotovog bilborda
  const host = `${req.protocol}://${req.get('host')}`
  const bilbordWithFullUrls = {
    ...bilbord.toObject(),
    imageUrl: bilbord.imageUrl?.startsWith('http')
      ? bilbord.imageUrl
      : `${host}${bilbord.imageUrl || ''}`,
    videoUrl: bilbord.videoUrl?.startsWith('http')
      ? bilbord.videoUrl
      : `${host}${bilbord.videoUrl || ''}`,
  }
  // Vrati bilbord sa punim URL-om
  res.status(200).json(bilbordWithFullUrls)
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

  // Prvo nalazi bilbord ali bez brisanja, da bi izvukao userId i imageUrl
  const bilbord = await ClientBilbord.findById(bilbord_id)

  if (!bilbord) {
    res.status(404)
    throw new Error('Bilbord nije pronađen')
  }

  // Trazi korisnika
  const user = await User.findById(bilbord.userId)
  if (!user) {
    res.status(404)
    throw new Error('Korisnik nije pronađen')
  }

  // Formira path do foldera koji treba obrisati
  const folderPath = path.join('uploads', user.name, bilbord_id)

  // Briše folder iz uploads
  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error('Greška prilikom brisanja foldera:', err)
    } else {
      console.log('Folder uspešno obrisan:', folderPath)
    }
  })

  // Sad briše bilbord iz baze
  const deletedBilbord = await ClientBilbord.findByIdAndDelete(bilbord_id)

  res.status(200).json({
    message: 'Bilbord i folder uspešno obrisani',
    bilbord: deletedBilbord,
  })
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
  uploadBilbordVideo,
  getBilbordsByUserId,
  getBilbordByUserAndBilbordId,
  createBilbordForUser,
  deleteBilbordOfUser,
  clientUpdateBilbordName,
}
