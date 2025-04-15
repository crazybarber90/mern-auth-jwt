import './confirmModalStyle.css'

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-text">
          Da li si siguran da želiš da obrišeš bilbord?
        </p>
        <div className="modal-buttons">
          <button className="btn delete" onClick={onConfirm}>
            Obriši
          </button>
          <button className="btn cancel" onClick={onCancel}>
            Odustani
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
