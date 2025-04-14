import { useState, useEffect, useRef } from 'react'
import { FiPlus } from 'react-icons/fi'
import './clientAddsStyle.css'
import {
  uploadBilbordApi,
  getClientBilbordsApi,
  clientUpdateBilbordNameApi,
} from '../../apiCalls/apiCalls'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import Back from '../../components/BackIcon/Back'
import { GrEdit } from 'react-icons/gr'

const ClientAdds = () => {
  const [bilbords, setBilbords] = useState([]) // Držimo sve bilborde
  const [imagesByBilbord, setImagesByBilbord] = useState({}) // Pratimo slike za svaki bilbord
  const [uploading, setUploading] = useState(false) // Status dodavanja slike
  const fileInputRef = useRef(null) // Ref za input element
  const editNameRefs = useRef({})
  const { userInfo } = useSelector((state) => state.auth)
  const [page, setPage] = useState(1) // Trenutna stranica
  const [pages, setPages] = useState(1) // Ukupan broj stranica
  const [editNameById, setEditNameById] = useState({})
  const [newNameById, setNewNameById] = useState({})

  // Preuzimanje bilborda za korisnika sa userId
  const getBilbords = async () => {
    try {
      const { bilbords: fetchAllBilbords, pages: totalPages } =
        await getClientBilbordsApi({ userId: userInfo._id, page })
      if (fetchAllBilbords) {
        setBilbords(fetchAllBilbords)
        setPages(totalPages)
      }
    } catch (error) {
      console.error('Greška prilikom preuzimanja bilborda:', error)
    }
  }

  const handleNextPage = () => {
    if (page < pages) setPage((prevPage) => prevPage + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1)
  }

  useEffect(() => {
    getBilbords(page)
  }, [page])

  // Obrada izabrane slike za specifičan bilbord
  const handleImageUpload = (event, bilbordId) => {
    const file = event.target.files[0]
    if (file) {
      setImagesByBilbord((prev) => ({
        ...prev,
        [bilbordId]: URL.createObjectURL(file),
      }))
    }
  }

  // Aktiviranje file input-a
  const triggerFileInput = (bilbordId) => {
    fileInputRef.current.dataset.bilbordId = bilbordId
    fileInputRef.current.click()
  }

  // Funkcija za upload slike
  const handleSaveChanges = async (bilbordId) => {
    if (!imagesByBilbord[bilbordId]) {
      toast.error('Nema izabrane slike.')
      return
    }

    setUploading(true)

    const file = fileInputRef.current.files[0]
    const formData = new FormData()
    formData.append('image', file)

    try {
      await uploadBilbordApi(bilbordId, formData)
      toast.success('Slika uspešno sačuvana!')
      getBilbords() // Revalidiranje bilborda nakon uspešnog upload-a

      setImagesByBilbord((prev) => {
        const updated = { ...prev }
        delete updated[bilbordId]
        return updated
      })
    } catch (error) {
      console.error('Greška prilikom upload-a slike:', error)
      toast.error('Greška prilikom upload-a slike.')
    } finally {
      setUploading(false)
    }
  }

  // Funkcija za update imena
  const handleSaveName = async (bilbordId) => {
    const newName = newNameById[bilbordId]
    if (!newName) return

    try {
      // pozovi svoj API za promenu imena ovde, npr:
      await clientUpdateBilbordNameApi(bilbordId, { name: newName })
      toast.success('Ime bilborda uspešno izmenjeno!')
      setEditNameById((prev) => ({ ...prev, [bilbordId]: false }))
      getBilbords()
    } catch (err) {
      toast.error('Greška prilikom izmene imena.')
    }
  }

  //toggle izmedju imena i inputa za izmenu imena
  const toggleEditName = (id, currentName) => {
    setEditNameById((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
    setNewNameById((prev) => ({
      ...prev,
      [id]: currentName, // Popuni trenutnim imenom
    }))
  }

  // Skini input za promenu imena bilborda kad se klikne u prazno
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(editNameRefs.current).forEach((id) => {
        const ref = editNameRefs.current[id]
        if (ref && !ref.contains(event.target)) {
          setEditNameById((prev) => ({
            ...prev,
            [id]: false,
          }))
        }
      })
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="clientAddWrapper">
      {/* Povratak na prethodnu stranicu */}
      <Back />
      <div className="allBilbordsWrapper">
        {bilbords.map((bilbord) => (
          <div
            key={bilbord._id}
            className="clientAddsContainer"
            ref={(el) => (editNameRefs.current[bilbord._id] = el)}
          >
            <div>
              <p className="bilbordName">
                Izmeni ime
                <span
                  style={{
                    marginLeft: '15px',
                    marginTop: '15px',
                    cursor: 'pointer',
                  }}
                >
                  <GrEdit
                    onClick={() => toggleEditName(bilbord._id, bilbord.name)}
                  />
                </span>
              </p>

              {editNameById[bilbord._id] ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '230px',
                  }}
                >
                  <input
                    style={{ marginTop: '5px', width: '160px' }}
                    value={newNameById[bilbord._id] || ''}
                    type="text"
                    placeholder="Izmeni ime bilborda"
                    onChange={(e) =>
                      setNewNameById((prev) => ({
                        ...prev,
                        [bilbord._id]: e.target.value,
                      }))
                    }
                  />
                  <span
                    onClick={() => handleSaveName(bilbord._id)}
                    style={{
                      padding: '10px 5px',
                      backgroundColor: 'gray',
                      cursor: 'pointer',
                      color: 'white',
                    }}
                  >
                    izmeni
                  </span>
                </div>
              ) : (
                <h3>{bilbord.name}</h3>
              )}
            </div>
            <p className="imageInfo">
              Preporučena dimenzija slike: <strong>1920x1080</strong> (16:9
              format).
            </p>
            <div className="uploadSection">
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

export default ClientAdds
