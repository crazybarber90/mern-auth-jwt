import './headerResponsiveStyle.css'
import { NavLink } from 'react-router-dom'
const HeaderResponsive = ({ isColapsed, setIsColapsed }) => {
  return (
    <div className="dropdown-menu-container">
      <h3 onClick={() => setIsColapsed(!isColapsed)} className="menu-button">
        UPOZNAJ NAS
      </h3>
      {isColapsed && (
        <div className={`menu-items ${isColapsed ? 'open' : ''}`}>
          <NavLink
            onClick={() => setIsColapsed(false)}
            to="/"
            className={({ isActive }) =>
              isActive ? 'navbarbrand active' : 'navbarbrand'
            }
          >
            O Nama
          </NavLink>
          <NavLink
            onClick={() => setIsColapsed(false)}
            to="/proizvodi"
            className={({ isActive }) =>
              isActive ? 'navbarbrand active' : 'navbarbrand'
            }
          >
            Naši proizvodi
          </NavLink>
          <NavLink
            onClick={() => setIsColapsed(false)}
            to="/cenovnik"
            className={({ isActive }) =>
              isActive ? 'navbarbrand active' : 'navbarbrand'
            }
          >
            Cenovnik
          </NavLink>
          <NavLink
            onClick={() => setIsColapsed(false)}
            to="/kontakt"
            className={({ isActive }) =>
              isActive ? 'navbarbrand active' : 'navbarbrand'
            }
          >
            Kontakt
          </NavLink>
        </div>
      )}
    </div>
  )
}

export default HeaderResponsive
