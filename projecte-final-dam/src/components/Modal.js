import React, { useState, forwardRef, useImperativeHandle } from 'react';

const Modal = forwardRef((props, ref) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (event.target.id === 'myModal') {
      setModalOpen(false);
    }
  };

  useImperativeHandle(ref, () => ({
    openModal: openModal
  }));

  return (
    <div>
      {modalOpen && (
        <div id="myModal" className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}></span>
            {props.children}
          </div>
        </div>
      )}
    </div>
  );
});

export default Modal;