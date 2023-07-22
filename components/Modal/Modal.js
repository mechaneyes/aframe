const Modal = ({ setModalVisible, show, typeUse, children }) => {
  const showHideClassName = show ? `modal modal--display-block ${typeUse}` : `modal modal--display-none ${typeUse}`;

  return (
    <div className={showHideClassName}>
      <section className="modal__main">
        {children}
        <button type="button" onClick={() => setModalVisible(false)}>
          Close
        </button>
      </section>
    </div>
  );
};

export default Modal;