import './allClients.css'
import SingleClientCard from './SingleClientCard/SingleClientCard'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { hideModal } from '../../slices/modalsSlices'
import { useEffect, useState } from 'react'
import { getAllClientsApi } from '../../apiCalls/apiCalls'

const AllClients = () => {
  const [clients, setClients] = useState([])
  const [page, setPage] = useState(1) // Trenutna stranica
  const [pages, setPages] = useState(1) // Ukupan broj stranica
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)

  const handleNavigate = (clientId) => {
    dispatch(hideModal('adminModal'))
    navigate(`/client/${clientId}`)
  }

  console.log('USERINFO', userInfo)

  const getAllClients = async (page) => {
    try {
      if (
        userInfo &&
        (userInfo.role === 'superadmin' || userInfo.role === 'admin')
      ) {
        const { clients: fetchedClients, pages: totalPages } =
          await getAllClientsApi(page)
        setClients(fetchedClients)
        setPages(totalPages)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleNextPage = () => {
    if (page < pages) setPage((prevPage) => prevPage + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1)
  }

  useEffect(() => {
    if (userInfo) {
      getAllClients(page)
    }
    // eslint-disable-next-line
  }, [page, userInfo])

  console.log('SVI KLIJENTI', clients)
  return (
    <div className="allClientsContainer">
      <div className="onlyClients">
        {clients.map((client) => (
          <div key={client._id} onClick={() => handleNavigate(client._id)}>
            <SingleClientCard client={client} />
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

export default AllClients
