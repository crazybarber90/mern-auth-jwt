import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { RxHamburgerMenu } from 'react-icons/rx'

import AdminDashboad from '../AdminDashboard/AdminDashboard'
import { logout } from '../../slices/authSlice'
import './headerStyle.css'
import { useLogoutMutation } from '../../slices/usersApiSlice'
import { useState } from 'react'
import { toggleAdminModal } from '../../slices/modalsSlices'
import HeaderResponsive from './HeaderResponsive/HeaderResponsive'

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [showDropdown, setShowDropdownd] = useState(false)
  const [isColapsed, setIsColapsed] = useState(false)
  const { adminModal } = useSelector((state) => state.modals.activeModal)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="header">
      {/* HAMBURGER MENU FOR ADMINS */}
      {userInfo &&
        (userInfo.role === 'superadmin' || userInfo.role === 'admin') && (
          <div
            onClick={() => dispatch(toggleAdminModal('adminModal'))}
            className="navbar-toggle"
            aria-label="Toggle navigation"
          >
            <RxHamburgerMenu />
          </div>
        )}

      {userInfo &&
        (userInfo.role === 'superadmin' || userInfo.role === 'admin') &&
        adminModal && <AdminDashboad />}

      <div className="header-responsive">
        <HeaderResponsive
          isColapsed={isColapsed}
          setIsColapsed={setIsColapsed}
        />
      </div>

      <div className="navbar">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'navbarbrand active' : 'navbarbrand'
          }
        >
          O Nama
        </NavLink>
        <NavLink
          to="/proizvodi"
          className={({ isActive }) =>
            isActive ? 'navbarbrand active' : 'navbarbrand'
          }
        >
          Naši proizvodi
        </NavLink>
        <NavLink
          to="/cenovnik"
          className={({ isActive }) =>
            isActive ? 'navbarbrand active' : 'navbarbrand'
          }
        >
          Cenovnik
        </NavLink>
        <NavLink
          to="/kontakt"
          className={({ isActive }) =>
            isActive ? 'navbarbrand active' : 'navbarbrand'
          }
        >
          Kontakt
        </NavLink>
      </div>

      <div>
        {userInfo ? (
          <>
            <li className="nav-item dropdown">
              <button
                onClick={() => setShowDropdownd((prev) => !prev)}
                className="dropdown-toggle"
              >
                {userInfo.name}
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <p>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowDropdownd(false)}
                    >
                      Profile
                    </Link>
                  </p>
                  <p>
                    <Link
                      to="/client-adds"
                      className="dropdown-item"
                      onClick={() => setShowDropdownd(false)}
                    >
                      Moje reklame
                    </Link>
                  </p>
                  <li>
                    <p onClick={logoutHandler} className="dropdown-item">
                      Izloguj se
                    </p>
                  </li>
                </div>
              )}
            </li>
          </>
        ) : (
          <div className="navitemsWrapper">
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                <FaSignInAlt /> Uloguj se
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                <FaSignOutAlt /> Registruj se
              </Link>
            </li>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
