// import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const PrivateRoute = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
// };
// export default PrivateRoute;

import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RoleBasedRoute = ({ roles }) => {
  const { userInfo } = useSelector((state) => state.auth)

  if (!userInfo) {
    // Ako korisnik nije ulogovan, preusmerava na login stranicu
    return <Navigate to="/login" replace />
  }

  if (!roles.includes(userInfo.role)) {
    // Ako korisnik nema odgovarajuću ulogu, prikazuje "Page Not Found"
    return <Navigate to="/404" replace />
  }

  // Ako je ulogovan i ima odgovarajuću ulogu, prikazuje traženu rutu
  return <Outlet />
}

export default RoleBasedRoute
