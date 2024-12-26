import './clientDetails.css'
import { useParams } from 'react-router-dom'
const ClientDetails = () => {
  const { id } = useParams()

  // Ovdje biste mogli da učitate informacije o klijentu putem API poziva
  const clientInfo = {
    name: 'John Doe',
    email: 'johndoe@example.com',
  }

  return (
    <div>
      <h2>Client Details</h2>
      <p>ID: {id}</p>
      <p>Name: {clientInfo.name}</p>
      <p>Email: {clientInfo.email}</p>
    </div>
  )
}

export default ClientDetails
