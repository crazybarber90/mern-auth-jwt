import { useDispatch, useSelector } from 'react-redux'
import './admindashboard.css'
import { Link } from 'react-router-dom'
import { hideModal } from '../../slices/modalsSlices'

const AdminDashboad = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  return (
    <div className="adminBar">
      <Link
        to="/all-clients"
        className="adminBtn"
        onClick={() => dispatch(hideModal('adminModal'))}
      >
        Svi korisnici
      </Link>
      {userInfo && userInfo.role === 'superadmin' && (
        <Link to="/admins" className="adminBtn">
          Svi admini
        </Link>
      )}
      <Link className="adminBtn">proba 1</Link>
      <Link className="adminBtn">proba 2</Link>
      <Link className="adminBtn">proba 3</Link>
      <Link className="adminBtn">proba 4</Link>
      <Link className="adminBtn">proba 5</Link>
    </div>
  )
}

export default AdminDashboad
