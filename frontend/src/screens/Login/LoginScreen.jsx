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

      console.log('RESPIOSE ZA LOGIN', res)
      dispatch(setCredentials({ ...res }))
      navigate('/')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormContainer>
      <h1 className="loginTitle">Sign In</h1>
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
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="formControl"
          />
        </div>

        <button type="submit" className="btnPrimary" disabled={isLoading}>
          Sign In
        </button>
      </form>

      {isLoading && <Loader />}

      <div className="registerLink">
        <span>New Customer?</span> <Link to="/register">Register</Link>
      </div>
    </FormContainer>
  )
}

export default LoginScreen
