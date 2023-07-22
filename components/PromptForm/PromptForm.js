import { useState } from "react";

import Modal from "../Modal/Modal";

const PromptForm = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {
    placeholderVisible,
    promptSubmitted,
    spinnerVisible,
    displayTimer,
    formRef,
    bottomOfPage,
  } = props;

  return (
    <>
      <Modal show={modalVisible} setModalVisible={setModalVisible} typeUse="modal--input">
        <p>Modal</p>
        <input type="text" />
      </Modal>
      <section
        className={`${
          bottomOfPage ? "prompt-form prompt-form--bottom" : "prompt-form"
        }`}
      >
        <div className="prompt-form__centered">
          <span className="before-cursor"> % </span>
          <button type="button" onClick={() => setModalVisible(true)}>
            Open
          </button>
          <div
            className={
              promptSubmitted
                ? "prompt-form__input prompt-form--submitted"
                : "prompt-form__input"
            }
            ref={formRef}
          >
            {placeholderVisible ? (
              <div
                className="prompt-form__inner"
                contentEditable={true}
                suppressContentEditableWarning={true}
                tabIndex="0"
              >
                <div className="hello">
                  <div className="hello__typewriter"></div>
                  <div className="prompt-form__cursor"></div>
                </div>
              </div>
            ) : (
              <div
                className="prompt-form__inner"
                contentEditable={true}
                suppressContentEditableWarning={true}
                tabIndex="0"
              ></div>
            )}
          </div>
          <div
            className={
              spinnerVisible
                ? "spinner spinner--visible lds-ripple"
                : "spinner spinner--hidden"
            }
          >
            {spinnerVisible ? (
              <>
                <div></div>
                <div></div>
              </>
            ) : (
              <p
                className={
                  spinnerVisible
                    ? "timer timer--hidden"
                    : "timer timer--visible"
                }
                dangerouslySetInnerHTML={{ __html: displayTimer }}
              ></p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PromptForm;
