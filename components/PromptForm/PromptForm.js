const PromptForm = (props) => {
  const {
    placeholderVisible,
    promptSubmitted,
    spinnerVisible,
    displayTimer,
    formRef,
  } = props;

  return (
    <section className="prompt-form">
      <div className="prompt-form__centered">
        <div
          className={
            promptSubmitted
              ? "prompt-form__input prompt-form--submitted"
              : "prompt-form__input"
          }
          contentEditable={true}
          suppressContentEditableWarning={true}
          tabIndex="0"
          ref={formRef}
        >
          {placeholderVisible ? (
            <div className="hello">
              <div className="hello__typewriter"></div>
              <div className="prompt-form__cursor"></div>
            </div>
          ) : (
            <></>
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
                spinnerVisible ? "timer timer--hidden" : "timer timer--visible"
              }
              dangerouslySetInnerHTML={{ __html: displayTimer }}
            ></p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromptForm;
