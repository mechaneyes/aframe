const Modal = ({ setModalVisible, show, typeUse, children }) => {
  const showHideClassName = show
    ? `modal modal--display-block ${typeUse}`
    : `modal modal--display-none ${typeUse}`;

  return (
    <div className={showHideClassName}>
      <div
        className="modal__close-button modal__close-button--top-right"
        onClick={() => setModalVisible(false)}
      >
        ✕
      </div>
      <section className="modal__main">{children}</section>
    </div>
  );
};

export default Modal;
