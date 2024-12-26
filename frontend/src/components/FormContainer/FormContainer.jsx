import './formsWrapper.css'

const FormContainer = ({ children }) => {
  return (
    <div className="formContainer">
      <div className="formRow">
        <div className="formCard">{children}</div>
      </div>
    </div>
  )
}

export default FormContainer
