import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../../slices/authSlice'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer/FormContainer'
import './loginStyle.css'
import { loginUserApi } from '../../apiCalls/apiCalls'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await loginUserApi({ email, password })
      dispatch(setCredentials({ ...res }))
      setError('')
      navigate('/')
      toast.success('Dobrodošli')
    } catch (err) {
      // toast.error(err?.data?.message || err.error)
      toast.error(err?.response?.data?.message || 'Došlo je do greške')
      setError(err?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormContainer>
      <h1 className="loginTitle">Prijavljivanje</h1>
      <form className="loginForm" onSubmit={submitHandler}>
        <div className="formGroup">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="formControl"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <div className="login-passwordWrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="formControl"
            />
            <button
              type="button"
              className="toggleBtn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button type="submit" className="btnPrimary" disabled={isLoading}>
          Uloguj se
        </button>
        <p style={{ color: 'red' }}>{error}</p>
      </form>

      {isLoading && <Loader />}

      <div className="registerLink">
        <span>Ako si nov korisnik?</span>{' '}
        <Link to="/register">Registruj se ovde</Link>
      </div>
    </FormContainer>
  )
}

export default LoginScreen
