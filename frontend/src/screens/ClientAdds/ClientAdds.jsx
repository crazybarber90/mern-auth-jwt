// import { useState, useEffect, useRef } from 'react'
// import { FiPlus } from 'react-icons/fi' // Ikona za dodavanje
// import './clientAddsStyle.css'
// import { uploadBilbordApi, getClientBilbordsApi } from '../../apiCalls/apiCalls'
// import { toast } from 'react-toastify'
// import { useSelector } from 'react-redux'

// const ClientAdds = () => {
//   const [bilbords, setBilbords] = useState([])
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [uploading, setUploading] = useState(false)
//   const [selectedBilbord, setSelectedBilbord] = useState(null)
//   const fileInputRef = useRef(null)
//   const { userInfo } = useSelector((state) => state.auth)

//   // Preuzimanje bilborda za korisnika sa userId
//   // const fetchBilbords = async () => {
//   //   const userId = localStorage.getItem('userId'); // Pretpostavka da se userId čuva u localStorage
//   //   try {
//   //     const bilbordsData = await getClientBilbordsApi(userId); // Preuzimanje bilborda sa userId
//   //     setBilbords(bilbordsData); // Čuvanje podataka o bilbordima u stanje
//   //   } catch (error) {
//   //     console.error('Greška prilikom učitavanja bilborda:', error);
//   //   }
//   // };

//   const getBilbords = async () => {
//     try {
//       const myBilbords = await getClientBilbordsApi(userInfo._id)

//       if (myBilbords) {
//         toast.success('Bilbordi uspešno preuzeti!')
//         setBilbords(myBilbords)
//       }
//     } catch (error) {
//       console.error('Greška prilikom preuzimanja bilborda:', error)
//     }
//   }

//   useEffect(() => {
//     getBilbords()
//   }, [])

//   // useEffect(() => {
//   //   fetchBilbords(); // Pozivanje funkcije da učita bilborde pri učitavanju komponente
//   // }, []);

//   // Držimo izabranu sliku
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0]
//     if (file) {
//       setSelectedImage(URL.createObjectURL(file))
//     }
//   }

//   // Aktiviranje file input-a
//   const triggerFileInput = (bilbord) => {
//     setSelectedBilbord(bilbord) // Povezivanje trenutnog bilborda sa slikom
//     fileInputRef.current.click()
//   }

//   // Funkcija za upload slike
//   const handleSaveChanges = async () => {
//     if (!selectedImage || !selectedBilbord) {
//       alert('Nema izabrane slike ili bilborda.')
//       return
//     }

//     setUploading(true)

//     // Kreiramo FormData za sliku
//     const formData = new FormData()
//     const file = fileInputRef.current.files[0]
//     formData.append('image', file)

//     try {
//       const { data } = await uploadBilbordApi({
//         bilbordId: selectedBilbord._id, // ID bilborda koji se updejtuje
//         formData,
//       })

//       console.log('Slika uspešno uploadovana:', data)
//       alert('Slika uspešno sačuvana!')
//       getBilbords() // Osvježavanje bilborda nakon uspešnog upload-a
//     } catch (error) {
//       console.error('Greška prilikom upload-a slike:', error)
//       alert('Greška prilikom upload-a slike.')
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <div className="clientAddWrapper">
//       <div className="clientAddsContainer">
//         {bilbords.map((bilbord) => (
//           <div key={bilbord._id} className="clientAddsCard">
//             <h3 className="bilbordName">{`Bilbord ${bilbord.bilbord_id}`}</h3>
//             <div className="uploadSection">
//               <p className="imageInfo">
//                 Preporučena dimenzija slike: <strong>1920x1080</strong> (16:9
//                 format).
//               </p>
//               <p
//                 className="uploadButton"
//                 onClick={() => triggerFileInput(bilbord)}
//               >
//                 <FiPlus size={24} />
//                 <span>Dodaj sliku</span>
//               </p>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 style={{ display: 'none' }}
//                 onChange={handleImageUpload}
//               />
//             </div>
//             {selectedImage &&
//               selectedBilbord &&
//               selectedBilbord._id === bilbord._id && (
//                 <div className="imagePreview">
//                   <img
//                     src={selectedImage}
//                     alt="Selected"
//                     className="previewImage"
//                   />
//                 </div>
//               )}
//             <p
//               onClick={handleSaveChanges}
//               className="submitUploadImage"
//               disabled={uploading}
//             >
//               {uploading ? 'Uploading...' : 'Sačuvaj izmenu'}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ClientAdds

// React komponenta za rad sa bilbordima
import { useState, useEffect, useRef } from 'react'
import { FiPlus } from 'react-icons/fi'
import './clientAddsStyle.css'
import { uploadBilbordApi, getClientBilbordsApi } from '../../apiCalls/apiCalls'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const ClientAdds = () => {
  const [bilbords, setBilbords] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedBilbord, setSelectedBilbord] = useState(null)
  const fileInputRef = useRef(null)
  const { userInfo } = useSelector((state) => state.auth)

  // Preuzimanje bilborda za korisnika sa userId
  const getBilbords = async () => {
    try {
      const myBilbords = await getClientBilbordsApi(userInfo._id)
      if (myBilbords) {
        toast.success('Bilbordi uspešno preuzeti!')
        setBilbords(myBilbords)
      }
    } catch (error) {
      console.error('Greška prilikom preuzimanja bilborda:', error)
    }
  }

  console.log('myBilbords', bilbords)

  useEffect(() => {
    getBilbords()
  }, [])

  // Držimo izabranu sliku
  const handleImageUpload = (event) => {
    console.log('USAOOO', event)
    const file = event.target.files[0]

    console.log('Izabrani fajl:', file) // Proverite da li je fajl pravilno izabran
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  // Aktiviranje file input-a
  const triggerFileInput = (bilbord) => {
    setSelectedBilbord(bilbord) // Povezivanje trenutnog bilborda sa slikom
    fileInputRef.current.click()
  }

  // Funkcija za upload slike
  const handleSaveChanges = async () => {
    if (!selectedImage || !selectedBilbord) {
      alert('Nema izabrane slike ili bilborda.')
      return
    }

    setUploading(true)

    const formData = new FormData()
    const file = fileInputRef.current.files[0]

    formData.append('image', file)

    try {
      const { data } = await uploadBilbordApi(selectedBilbord._id, formData)

      console.log('Slika uspešno uploadovana:', data)
      toast.success('Slika uspešno sačuvana!')
      getBilbords() // Osvježavanje bilborda nakon uspešnog upload-a
    } catch (error) {
      console.error('Greška prilikom upload-a slike:', error)
      toast.error('Greška prilikom upload-a slike.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="clientAddWrapper">
      <div className="clientAddsContainer">
        {bilbords.map((bilbord) => (
          <div key={bilbord._id} className="clientAddsCard">
            <h3 className="bilbordName">{`Bilbord ${bilbord.name}`}</h3>
            <div className="uploadSection">
              <p className="imageInfo">
                Preporučena dimenzija slike: <strong>1920x1080</strong> (16:9
                format).
              </p>
              <p
                className="uploadButton"
                onClick={() => triggerFileInput(bilbord)}
              >
                <FiPlus size={24} />
                <span>Dodaj sliku</span>
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
            <div className="imagePreview">
              {selectedImage ? (
                <img
                  src={selectedImage} // Prikazivanje izabrane slike
                  alt="Selected"
                  className="previewImage"
                />
              ) : (
                <img
                  // src={
                  //   'http://localhost:5000/uploads/bilbord/676c389e405aceae42332dcf/1735173129930_lhujxuj14.jpg' ||
                  //   'defaultImage.jpg'
                  // } // Ako nema izabrane slike, prikazujemo sliku iz baze

                  src={bilbord.imageUrl || 'defaultImage.jpg'}
                  alt="Bilbord"
                  className="previewImage"
                />
              )}
            </div>
            <p
              onClick={handleSaveChanges}
              className="submitUploadImage"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Sačuvaj izmenu'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientAdds
