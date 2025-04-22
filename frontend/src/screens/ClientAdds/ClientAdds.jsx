import { useState, useEffect, useRef } from 'react'
// import { FiPlus } from 'react-icons/fi'
import './clientAddsStyle.css'
import {
  uploadBilbordApi,
  getClientBilbordsApi,
  clientUpdateBilbordNameApi,
  uploadBilbordVideoApi,
} from '../../apiCalls/apiCalls'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import Back from '../../components/BackIcon/Back'
import { GrEdit } from 'react-icons/gr'

const ClientAdds = () => {
  const [bilbords, setBilbords] = useState([]) // Držimo sve bilborde
  const fileInputRef = useRef(null) // Ref za input element
  const editNameRefs = useRef({})
  const { userInfo } = useSelector((state) => state.auth)
  const [page, setPage] = useState(1) // Trenutna stranica
  const [pages, setPages] = useState(1) // Ukupan broj stranica
  const [editNameById, setEditNameById] = useState({})
  const [newNameById, setNewNameById] = useState({})
  const [imagesByBilbord, setImagesByBilbord] = useState({}) // Pratimo slike za svaki bilbord
  const [mediaByBilbord, setMediaByBilbord] = useState({}) // image | video | slider
  const [activePreview, setActivePreview] = useState({})

  const [uploadingByBilbord, setUploadingByBilbord] = useState({}) // Status dodavanja slike
  const [progressByBilbord, setProgressByBilbord] = useState({}) // progress bar uploadovanja

  const [hasChangesByBilbord, setHasChangesByBilbord] = useState({})
  // Preuzimanje bilborda za korisnika sa userId
  const getBilbords = async () => {
    try {
      const { bilbords: fetchAllBilbords, pages: totalPages } =
        await getClientBilbordsApi({ userId: userInfo._id, page })
      if (fetchAllBilbords) {
        setBilbords(fetchAllBilbords)
        setPages(totalPages)

        // setovanje inicijalnog bilborda klijenta iz response sa backenda
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

  // Aktiviranje file input-a
  const triggerFileInput = (bilbordId) => {
    fileInputRef.current.dataset.bilbordId = bilbordId
    fileInputRef.current.click()
  }

  // Uploadovanje slike/videa bilborda
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
        await uploadBilbordVideoApi(bilbordId, formData, onProgress)
        toast.success('Video uspešno sačuvan!')
      } else {
        await uploadBilbordApi(bilbordId, formData, onProgress)
        toast.success('Slika uspešno sačuvana!')
      }

      getBilbords()

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

  // client panel
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

            {/* PROGRESS BAR */}
            {uploadingByBilbord[bilbord._id] && (
              <div className="upload-progress-bar">
                <progress
                  value={progressByBilbord[bilbord._id] || 0}
                  max="100"
                />
              </div>
            )}

            {/* DUGME "SACUVAJ" */}
            <button
              onClick={() => handleSaveChanges(bilbord._id)}
              className="submitUploadImage"
              disabled={
                uploadingByBilbord[bilbord._id] ||
                !hasChangesByBilbord[bilbord._id]
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
