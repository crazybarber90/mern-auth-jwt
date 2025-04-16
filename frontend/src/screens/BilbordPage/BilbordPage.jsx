import { useParams } from 'react-router-dom'

import { useState, useEffect } from 'react'
import { getBilbordApi } from '../../apiCalls/apiCalls'

const BilbordPage = () => {
  const { userId, bilbordId } = useParams() // Izvlačenje parametara iz URL-a
  const [bilbord, setBilbord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBilbord = async () => {
      try {
        const data = await getBilbordApi({ userId, bilbordId })
        setBilbord(data) // Postavi podatke bilborda
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || 'Došlo je do greške')
        setLoading(false)
      }
    }

    fetchBilbord()
  }, [userId, bilbordId])

  if (loading) return <div>Učitavanje...</div>
  if (error) return <div>Greška: {error}</div>

  return (
    <div
      style={{
        width: '100%',
        // height: '100vh',
        backgroundColor: 'black',
        padding: '5px 0',
        display: 'flex',
      }}
    >
      <img
        src={bilbord.imageUrl}
        alt="Bilbord"
        style={{
          margin: '0 auto',
          maxWidth: '99.7%',
          minHeight: '100vh',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default BilbordPage
