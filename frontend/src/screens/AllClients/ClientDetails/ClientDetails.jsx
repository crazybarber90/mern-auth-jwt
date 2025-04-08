// Importujemo potrebne React hook-ove i druge module
import { useEffect, useRef, useState } from 'react'
import './clientDetails.css'
import { useParams } from 'react-router-dom'
import {
  adminCreateBilbordForUserApi,
  adminDeleteBilbordOfUserApi, // API za dodavanje novog bilborda za korisnika
  getAllClientsBilbordsApi, // API za dohvatanje svih bilborda klijenta
  uploadBilbordApi, // API za upload slike za bilbord
} from '../../../apiCalls/apiCalls'
import { useSelector } from 'react-redux' // Hook za uzimanje podataka iz Redux-a
import { toast } from 'react-toastify' // Prikaz notifikacija korisniku
import { FiPlus } from 'react-icons/fi' // Ikonica za "dodavanje"
import Back from '../../../components/BackIcon/Back' // Komponenta za povratak unazad
import { CiSquarePlus } from 'react-icons/ci' // Ikonica za "dodavanje novog bilborda"

// Glavna komponenta koja prikazuje detalje klijenta
const ClientDetails = () => {
  // Ekstrakcija ID-a klijenta iz URL-a
  const { id } = useParams()
  // Uzmi informacije o trenutno prijavljenom korisniku iz Redux-a
  const { userInfo } = useSelector((state) => state.auth)

  // Stati za čuvanje podataka
  const [clientBilbords, setClientBilbords] = useState([]) // Lista bilborda
  const [page, setPage] = useState(1) // Trenutna stranica
  const [pages, setPages] = useState(1) // Ukupan broj stranica
  const [uploading, setUploading] = useState(false) // Status učitavanja slike
  const [imagesByBilbord, setImagesByBilbord] = useState({}) // Privremene slike za bilborde
  const fileInputRef = useRef(null) // Referenca na skriveni file input

  // Funkcija za dohvatanje svih bilborda klijenta
  const fetchClientsBilbords = async (page) => {
    try {
      // Proveravamo da li je korisnik admin ili superadmin
      if (
        userInfo &&
        (userInfo.role === 'superadmin' || userInfo.role === 'admin')
      ) {
        const { bilbords: fetchAllBilbords, pages: totalPages } =
          await getAllClientsBilbordsApi({
            userId: id, // Prosleđujemo ID klijenta
            page, // Trenutna stranica
          })
        setClientBilbords(fetchAllBilbords) // Postavi dobijene bilborde u state
        setPages(totalPages) // Postavi ukupan broj stranica
      }
    } catch (error) {
      console.error(error) // Ispis greške u konzolu
    }
  }

  // Funkcija za rukovanje odabirom slike
  const handleImageUpload = (event, bilbordId) => {
    const file = event.target.files[0] // Dohvati izabranu datoteku
    if (file) {
      // Čuvamo privremenu URL sliku za prikaz
      setImagesByBilbord((prev) => ({
        ...prev,
        [bilbordId]: URL.createObjectURL(file),
      }))
    }
  }

  // Aktiviraj skriveni input za odabir slike
  const triggerFileInput = (bilbordId) => {
    fileInputRef.current.dataset.bilbordId = bilbordId // Dodaj ID bilborda u dataset
    fileInputRef.current.click() // Simulira klik na file input
  }

  // Funkcija za upload izabrane slike
  const handleSaveChanges = async (bilbordId) => {
    if (!imagesByBilbord[bilbordId]) {
      toast.error('Nema izabrane slike.') // Ako slika nije izabrana, obavesti korisnika
      return
    }

    setUploading(true) // Podesi status "uploading" na true
    const file = fileInputRef.current.files[0] // Dohvati izabranu datoteku
    const formData = new FormData()
    formData.append('image', file) // Dodaj sliku u formu

    try {
      await uploadBilbordApi(bilbordId, formData) // Pošalji API zahtev za upload
      toast.success('Slika uspešno sačuvana!') // Obavesti korisnika o uspehu
      fetchClientsBilbords() // Osveži listu bilborda

      // Ukloni sliku iz privremenog state-a
      setImagesByBilbord((prev) => {
        const updated = { ...prev }
        delete updated[bilbordId]
        return updated
      })
    } catch (error) {
      console.error('Greška prilikom upload-a slike:', error) // Ispis greške
      toast.error('Greška prilikom upload-a slike.') // Prikaz greške korisniku
    } finally {
      setUploading(false) // Resetuj status "uploading"
    }
  }

  // Funkcije za navigaciju između stranica
  const handleNextPage = () => {
    if (page < pages) setPage((prevPage) => prevPage + 1)
  }
  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1)
  }

  // Funkcija za kreiranje novog bilborda
  const handleAdminCreateBilbord = async () => {
    try {
      const newBilbord = await adminCreateBilbordForUserApi(id)
      if (newBilbord) {
        toast.success('Novi bilbord uspešno dodat.') // Obavesti o uspehu
        setClientBilbords((prevBilbords) => [...prevBilbords, newBilbord]) // Dodaj novi bilbord u listu
        fetchClientsBilbords() // Osveži listu
      }
    } catch (error) {
      toast.error('Greška prilikom dodavanja novog bilborda.') // Prikaz greške
      console.error(error)
    }
  }
  // Funkcija za admin-brisanje bilborda
  const handleAdminDeleteBilbord = async (bilbordId) => {
    try {
      const deletedBilbord = await adminDeleteBilbordOfUserApi(bilbordId)
      if (deletedBilbord) {
        toast.success('Bilbord uspešno obrisan.')

        // Ponovo učitaj podatke sa servera
        fetchClientsBilbords(page)
      }
    } catch (error) {
      console.error('error', error)
      toast.error('Greška prilikom brisanja bilborda.')
    }
  }

  // useEffect za dohvatanje podataka pri inicijalizaciji
  useEffect(() => {
    if (userInfo) {
      fetchClientsBilbords(page) // Učitaj bilborde za trenutnu stranicu
    }
    // eslint-disable-next-line
  }, [page, userInfo])

  return (
    <div className="clientAddWrapper">
      {/* Povratak na prethodnu stranicu */}
      <Back />
      <div className="addNewBilbordContainer">
        <h2>Dodaj novi bilbord klijentu</h2>
        <CiSquarePlus
          cursor="pointer"
          size={46}
          onClick={handleAdminCreateBilbord}
        />
      </div>

      <div className="allBilbordsWrapper">
        {clientBilbords.map((bilbord) => (
          <div key={bilbord._id} className="clientAddsContainer">
            {/* ADMIN DELETE BILBORD */}
            <span
              className="bilbordDeleteBtn"
              onClick={() => handleAdminDeleteBilbord(bilbord._id)}
            >
              X
            </span>
            <h3 className="bilbordName">{`Ime: ${bilbord.name}`}</h3>
            <h3 className="bilbordName">{`Id: ${bilbord.bilbord_id}`}</h3>
            <div className="uploadSection">
              <p className="imageInfo">
                Preporučena dimenzija slike: <strong>1920x1080</strong> (16:9
                format).
              </p>
              <p
                className="uploadButton"
                onClick={() => triggerFileInput(bilbord._id)}
              >
                <FiPlus size={24} />
                <span>Dodaj sliku</span>
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(event) =>
                  handleImageUpload(
                    event,
                    fileInputRef.current.dataset.bilbordId
                  )
                }
              />
            </div>
            <div className="imagePreview">
              <img
                src={
                  imagesByBilbord[bilbord._id] ||
                  bilbord.imageUrl ||
                  '/public/images/defaultImage.png'
                }
                alt="Bilbord"
                className="previewImage"
              />
            </div>
            <p
              onClick={() => handleSaveChanges(bilbord._id)}
              className="submitUploadImage"
              disabled={uploading}
            >
              {uploading ? 'Dodavanje...' : 'Sačuvaj izmenu'}
            </p>
          </div>
        ))}
      </div>

      <div className="paginationControls">
        <button
          className="paginationBtn"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Nazad
        </button>
        <span>
          Stranica {page} of {pages}
        </span>
        <button
          className="paginationBtn"
          onClick={handleNextPage}
          disabled={page === pages}
        >
          Dalje
        </button>
      </div>
    </div>
  )
}

export default ClientDetails
