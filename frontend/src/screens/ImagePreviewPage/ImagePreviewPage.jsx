import { useEffect, useState } from 'react'
// import axios from 'axios'

const ImagePreviewPage = () => {
  const [image, setImage] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      setImage('')
      //   try {
      //     const { data } = await axios.get('/api/images/current')
      //     setImage(data.image.url)
      //   } catch (error) {
      //     console.error('Greška prilikom preuzimanja slike:', error)
      //   }
    }

    fetchImage()
  }, [])

  if (!image) {
    return <div>Slika nije pronađena.</div>
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <img
        src={image}
        alt="Preview"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default ImagePreviewPage
