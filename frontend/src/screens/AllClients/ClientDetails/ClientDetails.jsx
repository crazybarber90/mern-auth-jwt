// Importujemo potrebne React hook-ove i druge module
import { useEffect, useRef, useState } from 'react'
import './clientDetails.css'
import { useParams } from 'react-router-dom'
import {
  adminCreateBilbordForUserApi,
  adminDeleteBilbordOfUserApi, // API za dodavanje novog bilborda za korisnika
  getAllClientsBilbordsApi, // API za dohvatanje svih bilborda klijenta
  uploadBilbordApi,
  uploadBilbordVideoApi, // API za upload slike za bilbord
} from '../../../apiCalls/apiCalls'
import { useSelector } from 'react-redux' // Hook za uzimanje podataka iz Redux-a
import { toast } from 'react-toastify' // Prikaz notifikacija korisniku
// import { FiPlus } from 'react-icons/fi' // Ikonica za "dodavanje"
import Back from '../../../components/BackIcon/Back' // Komponenta za povratak unazad
import { CiSquarePlus } from 'react-icons/ci' // Ikonica za "dodavanje novog bilborda"
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal'

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
  const [imagesByBilbord, setImagesByBilbord] = useState({}) // Privremene slike za bilborde
  const fileInputRef = useRef(null) // Referenca na skriveni file input
  const [showModal, setShowModal] = useState(false) // modal za potvrdu brisanja bilborda (ADMIN)
  const [activePreview, setActivePreview] = useState({})
  const [mediaByBilbord, setMediaByBilbord] = useState({}) // image | video | slider

  const [uploadingByBilbord, setUploadingByBilbord] = useState({})
  const [progressByBilbord, setProgressByBilbord] = useState({})

  const [hasChangesByBilbord, setHasChangesByBilbord] = useState({})

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

        if (fetchAllBilbords) {
          setClientBilbords(fetchAllBilbords) // Postavi dobijene bilborde u state
          setPages(totalPages) // Postavi ukupan broj stranica

          // Auto-setuj preview tip na osnovu mediaType
          const initialPreview = {}
          fetchAllBilbords.forEach((b) => {
            if (b.mediaType === 'video') {
              initialPreview[b._id] = 'video'
            } else {
              initialPreview[b._id] = 'slika'
            }
          })
          setActivePreview(initialPreview)
        }
      }
    } catch (error) {
      console.error(error) // Ispis greške u konzolu
    }
  }

  // Aktiviraj skriveni input za odabir slike
  const triggerFileInput = (bilbordId) => {
    fileInputRef.current.dataset.bilbordId = bilbordId // Dodaj ID bilborda u dataset
    fileInputRef.current.click() // Simulira klik na file input
  }

  const handleSaveChanges = async (bilbordId) => {
    const file = fileInputRef.current.files[0]
    const formData = new FormData()
    const previewType = activePreview[bilbordId]

    if (!file) {
      toast.error('Nema fajla za upload.')
      return
    }

    setUploadingByBilbord((prev) => ({ ...prev, [bilbordId]: true }))
    setProgressByBilbord((prev) => ({ ...prev, [bilbordId]: 0 }))
    formData.append(previewType === 'video' ? 'video' : 'image', file)

    // funkcija za racunanje progresa uploada
    const onProgress = (event) => {
      const percent = Math.round((event.loaded * 100) / event.total)
      setProgressByBilbord((prev) => ({ ...prev, [bilbordId]: percent }))
    }

    try {
      if (previewType === 'video') {
        console.log('UPLOADUJE VIDEO IZ ClientAdds')
        await uploadBilbordVideoApi(bilbordId, formData, onProgress)
        toast.success('Video uspešno sačuvan!')
      } else {
        console.log('UPLOADUJE SLIKU IZ ClientAdds')
        await uploadBilbordApi(bilbordId, formData, onProgress)
        toast.success('Slika uspešno sačuvana!')
      }

      fetchClientsBilbords() // Osveži listu bilborda

      setImagesByBilbord((prev) => {
        const updated = { ...prev }
        delete updated[bilbordId]
        return updated
      })
    } catch (error) {
      toast.error(
        `Greška prilikom upload-a ${
          previewType === 'video' ? 'videa' : 'slike'
        }.`
      )
    } finally {
      setUploadingByBilbord((prev) => ({ ...prev, [bilbordId]: false }))
      setProgressByBilbord((prev) => ({ ...prev, [bilbordId]: 0 }))
      // za dugme da disabluje posle promene bilborda/slike
      setHasChangesByBilbord((prev) => ({ ...prev, [bilbordId]: false }))
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
      console.log('DELETED BILBORD', deletedBilbord)
      if (deletedBilbord) {
        console.log('USAO U IF')
        toast.success('Bilbord uspešno obrisan.')
        setShowModal(false)
        // Ponovo učitaj podatke sa servera
        fetchClientsBilbords(page)
      }
    } catch (error) {
      console.error('error', error)
      toast.error('Greška prilikom brisanja bilborda.')
    }
  }
  const handleMediaUpload = (event, bilbordId) => {
    const file = event.target.files[0]
    if (file) {
      const previewType = activePreview[bilbordId]
      const fileType = file.type

      if (previewType === 'video') {
        if (!fileType.startsWith('video/')) {
          toast.error('Na dugme "Dodaj video" možete dodati samo video fajl.')
          return
        }
        setMediaByBilbord((prev) => ({
          ...prev,
          [bilbordId]: URL.createObjectURL(file),
        }))
        setHasChangesByBilbord((prev) => ({ ...prev, [bilbordId]: true }))
      } else if (previewType === 'slika') {
        if (!fileType.startsWith('image/')) {
          toast.error('Na dugme "Dodaj sliku" možete dodati samo sliku.')
          return
        }
        setImagesByBilbord((prev) => ({
          ...prev,
          [bilbordId]: URL.createObjectURL(file),
        }))
        setHasChangesByBilbord((prev) => ({ ...prev, [bilbordId]: true }))
      } else {
        console.log('treba ovde slajder')
      }
    }
  }

  // useEffect za dohvatanje podataka pri inicijalizaciji
  useEffect(() => {
    if (userInfo) {
      fetchClientsBilbords(page) // Učitaj bilborde za trenutnu stranicu
    }
    // eslint-disable-next-line
  }, [page, userInfo])

  // admin panel
  return (
    <div className="clientAddWrapper">
      {/* Povratak na prethodnu stranicu */}
      <Back />
      <div
        onClick={handleAdminCreateBilbord}
        className="addNewBilbordContainer"
      >
        <p>DODAJ BILBORD</p>
        <CiSquarePlus cursor="pointer" size={60} />
      </div>

      <div className="allBilbordsWrapper">
        {clientBilbords.map((bilbord) => (
          <div key={bilbord._id} className="clientAddsContainer">
            {showModal && (
              <ConfirmModal
                isOpen={showModal}
                onConfirm={() => handleAdminDeleteBilbord(bilbord._id)}
                onCancel={() => setShowModal(false)}
              />
            )}

            {/* ADMIN DELETE BILBORD */}
            <span
              className="bilbordDeleteBtn"
              onClick={() => setShowModal(true)}
            >
              X
            </span>
            <h3 className="bilbordName">{`Ime: ${bilbord.name}`}</h3>
            <h3 className="bilbordName">{`Id: ${bilbord.bilbord_id}`}</h3>
            <p className="imageInfo">
              Preporučena dimenzija slike: <strong>1920x1080</strong> (16:9
              format).
            </p>
            <div className="uploadSection">
              <div className="uploadSection">
                {/* 3 dugmeta */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: '12px',
                  }}
                >
                  <button
                    onClick={() => {
                      setActivePreview((prev) => ({
                        ...prev,
                        [bilbord._id]: 'slika',
                      }))
                      triggerFileInput(bilbord._id)
                    }}
                    style={{
                      padding: '5px 15px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: '#25910b',
                      color: 'white',
                    }}
                  >
                    {/* <FiPlus size={20} /> */}
                    Dodaj sliku
                  </button>
                  <button
                    style={{
                      padding: '5px 15px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: '#6b78be',
                      color: 'white',
                    }}
                    onClick={() =>
                      setActivePreview((prev) => ({
                        ...prev,
                        [bilbord._id]: 'slider',
                      }))
                    }
                  >
                    Dodaj slajder
                  </button>
                  <button
                    style={{
                      padding: '5px 15px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: '#e05050',
                      color: 'white',
                    }}
                    onClick={() => {
                      setActivePreview((prev) => ({
                        ...prev,
                        [bilbord._id]: 'video',
                      }))
                      triggerFileInput(bilbord._id)
                    }}
                  >
                    Dodaj video
                  </button>
                </div>

                {/* INPIUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={
                    activePreview[fileInputRef.current?.dataset?.bilbordId] ===
                    'video'
                      ? 'video/*'
                      : 'image/*'
                  }
                  style={{ display: 'none' }}
                  onChange={(event) =>
                    handleMediaUpload(
                      event,
                      fileInputRef.current.dataset.bilbordId
                    )
                  }
                />
              </div>
            </div>

            {/* PREVIEW IMAGE / VIDEO */}
            <div className="imagePreview">
              <h4 style={{ textTransform: 'capitalize' }}>
                {activePreview[bilbord._id] || 'Slika'}
              </h4>
              {activePreview[bilbord._id] === 'video' ? (
                <video
                  src={mediaByBilbord[bilbord._id] || bilbord.videoUrl}
                  controls
                  className="previewImage"
                />
              ) : (
                <img
                  src={
                    imagesByBilbord[bilbord._id] ||
                    bilbord.imageUrl ||
                    '/public/images/defaultImage.png'
                  }
                  alt="Bilbord"
                  className="previewImage"
                />
              )}
            </div>

            {/* DUGME "SACUVAJ" */}
            <button
              onClick={() => handleSaveChanges(bilbord._id)}
              className="submitUploadImage"
              disabled={
                !hasChangesByBilbord[bilbord._id] ||
                uploadingByBilbord[bilbord._id]
              }
              style={{
                opacity:
                  uploadingByBilbord[bilbord._id] ||
                  !hasChangesByBilbord[bilbord._id]
                    ? '50%'
                    : '100%',
                cursor:
                  uploadingByBilbord[bilbord._id] ||
                  !hasChangesByBilbord[bilbord._id]
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              {uploadingByBilbord[bilbord._id]
                ? 'Dodavanje...'
                : 'Sačuvaj izmenu'}
            </button>

            {/* PROGRESS BAR */}
            {uploadingByBilbord[bilbord._id] && (
              <div className="upload-progress-bar">
                <progress
                  value={progressByBilbord[bilbord._id] || 0}
                  max="100"
                />
              </div>
            )}

            {/* LINK ZA HTTPS BILBORD */}
            <p
              style={{
                width: '100%',
                wordBreak: 'break-all', // ili 'break-word'
                whiteSpace: 'normal',
              }}
            >
              {`https://digitalizujse.rs/bilbord/${bilbord.userId}/${bilbord._id}`}
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
