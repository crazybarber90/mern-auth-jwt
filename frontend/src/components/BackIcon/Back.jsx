import { IoReturnUpBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const Back = () => {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
      <IoReturnUpBack size={24} />
    </div>
  )
}

export default Back
