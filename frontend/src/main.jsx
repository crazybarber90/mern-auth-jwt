import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import store from './store'
import { Provider } from 'react-redux'
import HomeScreen from './screens/Home/HomeScreen.jsx'
import LoginScreen from './screens/Login/LoginScreen.jsx'
import RegisterScreen from './screens/Register/RegisterScreen.jsx'

import PrivateRoute from './components/PrivateRoute.jsx'
import ProfileScreen from './screens/Profile/ProfileScreen.jsx'
import ClientAdds from './screens/ClientAdds/ClientAdds.jsx'
import AllClients from './screens/AllClients/AllClients.jsx'
import ClientDetails from './screens/AllClients/ClientDetails/ClientDetails.jsx'
import NotFoundPage from './screens/NotFoundPage/NotFoundPage.jsx'
import ImagePreviewPage from './screens/ImagePreviewPage/ImagePreviewPage.jsx'
import BilbordPage from './screens/BilbordPage/BilbordPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/client-adds" element={<ClientAdds />} />
      <Route path="/image/:id" element={<ImagePreviewPage />} />

      {/* BILBORD SLIKA */}
      <Route path="/bilbord/:userId/:bilbordId" element={<BilbordPage />} />
      {/* Dinamična ruta */}
      {/* PROTECTED ROUTES (ONLY ADMINS) */}
      <Route path="" element={<PrivateRoute roles={['admin', 'superadmin']} />}>
        {/* ROUTES FOR ALL ADMINS */}
        <Route path="/all-clients" element={<AllClients />} />
        <Route path="/client/:id" element={<ClientDetails />} />
        {/* ROUTES FOR ALL ADMINS */}
        <Route path="/all-admins" element={<ClientDetails />} />
        <Route path="/admin/:id" element={<ClientDetails />} />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)
