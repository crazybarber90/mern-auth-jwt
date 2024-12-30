import { Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

const App = () => {
  const location = useLocation()

  // Provera da li URL počinje sa "/bilbord"
  const isBilbordRoute = location.pathname.startsWith('/bilbord')

  return (
    <>
      {/* Prikazuje Header samo ako nije ruta za bilbord */}
      {!isBilbordRoute && <Header />}
      <ToastContainer />
      <Outlet />
      {!isBilbordRoute && <Footer />}

      {/* OVDE FOOTER ISTO KAO HEADER */}
    </>
  )
}

export default App
