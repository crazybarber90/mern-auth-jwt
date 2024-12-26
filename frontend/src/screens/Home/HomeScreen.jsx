import { useSelector } from 'react-redux'
import Homepage from '../../components/Homepage/Hero'

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth)

  console.log('USER', userInfo)
  return (
    <>
      <Homepage />
    </>
  )
}
export default HomeScreen
