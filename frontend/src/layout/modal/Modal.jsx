
import "./Modal.css";

export default function Modal({ isOpen, handleClose, children }) {
  if (isOpen) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div onClick={handleClose} className="overlay"></div>
          <div className="modal-content">
            <button className="close-modal" onClick={handleClose}>
              CLOSE
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
