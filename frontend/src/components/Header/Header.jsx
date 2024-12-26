import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RxHamburgerMenu } from 'react-icons/rx'

import AdminDashboad from '../AdminDashboard/AdminDashboard'
import { logout } from '../../slices/authSlice'
import './headerStyle.css'
import { useLogoutMutation } from '../../slices/usersApiSlice'
import { useState } from 'react'
import { toggleAdminModal } from '../../slices/modalsSlices'

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [showDropdown, setShowDropdownd] = useState(false)
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

  console.log('adminModal', adminModal)

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

      <div>
        <Link to="/" className="navbarbrand">
          DIGITAL ADDS
        </Link>
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
          <>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                <FaSignInAlt /> Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                <FaSignOutAlt /> Sign Up
              </Link>
            </li>
          </>
        )}
      </div>

      {/* <nav className="navbar">
        <div className="container">
          <div>
            <Link to="/" className="navbar-brand">
              DIGITAL ADDS
            </Link>
          </div>
          <button className="navbar-toggle" aria-label="Toggle navigation">
            ☰
          </button>
          <div className="navbar-collapse">
            <ul className="nav">
              {userInfo ? (
                <>
                  <li className="nav-item dropdown">
                    <button className="dropdown-toggle">{userInfo.name}</button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/profile" className="dropdown-item">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={logoutHandler}
                          className="dropdown-item"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      <FaSignInAlt /> Sign In
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      <FaSignOutAlt /> Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav> */}
    </header>
  )
}

export default Header
