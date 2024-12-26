import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import FormContainer from '../../components/FormContainer/FormContainer'
import Loader from '../../components/Loader'
import { setCredentials } from '../../slices/authSlice'
import './profileStyle.css'
import { updateUserApi } from '../../apiCalls/apiCalls'

const ProfileScreen = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setName(userInfo.name)
    setEmail(userInfo.email)
  }, [userInfo.email, userInfo.name])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
    } else {
      try {
        const res = await updateUserApi({
          _id: userInfo._id,
          name,
          email,
          password,
        })
        dispatch(setCredentials(res))
        toast.success('Profile updated successfully')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <FormContainer>
      <h1 className="profileTitle">Update Profile</h1>
      <form className="profileForm" onSubmit={submitHandler}>
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
          Update
        </button>
        {isLoading && <Loader />}
      </form>
    </FormContainer>
  )
}

export default ProfileScreen
