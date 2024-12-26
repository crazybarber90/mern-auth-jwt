import './allClients.css'
import SingleClientCard from './SingleClientCard/SingleClientCard'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { hideModal } from '../../slices/modalsSlices'

const AllClients = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleNavigate = (clientId) => {
    dispatch(hideModal('adminModal'))
    navigate(`/client/${clientId}`)
  }

  return (
    <div className="allClientsContainer">
      {/* Primer sa statičkim ID-jevima */}
      <div onClick={() => handleNavigate(1)}>
        <SingleClientCard clientId={1} />
      </div>
      <div onClick={() => handleNavigate(2)}>
        <SingleClientCard clientId={2} />
      </div>
      <div onClick={() => handleNavigate(3)}>
        <SingleClientCard clientId={3} />
      </div>
      <div onClick={() => handleNavigate(3)}>
        <SingleClientCard clientId={3} />
      </div>
      <div onClick={() => handleNavigate(3)}>
        <SingleClientCard clientId={3} />
      </div>
      <div onClick={() => handleNavigate(3)}>
        <SingleClientCard clientId={3} />
      </div>
      <div onClick={() => handleNavigate(3)}>
        <SingleClientCard clientId={3} />
      </div>
      <div onClick={() => handleNavigate(3)}>
        <SingleClientCard clientId={3} />
      </div>
      <div onClick={() => handleNavigate(3)}>
        <SingleClientCard clientId={3} />
      </div>
    </div>
  )
}

export default AllClients
