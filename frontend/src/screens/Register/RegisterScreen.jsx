import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import FormContainer from '../../components/FormContainer/FormContainer'
import Loader from '../../components/Loader'
import { setCredentials } from '../../slices/authSlice'
import './registerStyle.css'
import { registerUserApi } from '../../apiCalls/apiCalls'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
    } else {
      try {
        const res = await registerUserApi({ name, email, password })
        dispatch(setCredentials({ ...res }))
        navigate('/')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <FormContainer>
      <h1 className="registerTitle">Register</h1>
      <form className="registerForm" onSubmit={submitHandler}>
        <div className="formGroup">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="formControl"
          />
        </div>
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
        <div className="formGroup">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="formControl"
          />
        </div>
        <button type="submit" className="btnPrimary" disabled={isLoading}>
          Register
        </button>
        {isLoading && <Loader />}
      </form>
      <div className="footer">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </FormContainer>
  )
}

export default RegisterScreen
