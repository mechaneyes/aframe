import { useState, useEffect, useRef, use } from "react";
import axios from "axios";
import { useAtom, useSetAtom, useAtomValue } from "jotai";

import Modal from "../Modal/Modal";

import { introVisibleAtom } from "/store/state-jotai.js";
import { examplePromptAtom } from "/store/state-jotai.js";
import { gptFreestyleAtom } from "/store/state-jotai.js";
import { gptReferencesAtom } from "/store/state-jotai.js";

const PromptForm = (props) => {
  const textareaRef = useRef(null);
  const formRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [seenIds, setSeenIds] = useState(new Set());
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [displayTimer, setDisplayTimer] = useState("");

  const examplePrompt = useAtomValue(examplePromptAtom);
  const setIntroVisible = useSetAtom(introVisibleAtom);
  const setGptFreestyle = useSetAtom(gptFreestyleAtom);
  const setGptReferences = useSetAtom(gptReferencesAtom);

  const { stability, bottomOfPage } = props;

  // o————————————————————————————————————o form height —>
  //
  // height of prompt form grows as user types. using a css
  // variable this pushes the chat responses down
  //
  useEffect(() => {
    const root = document.documentElement;
    const promptForm = document.querySelector(".prompt-form");

    function updateResponseContainerHeight() {
      const promptFormHeight = promptForm.offsetHeight;
      root.style.setProperty("--prompt-form-height", `${promptFormHeight}px`);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        updateResponseContainerHeight();
      }
    });
    resizeObserver.observe(formRef.current);

    updateResponseContainerHeight();
  }, []);

  // o————————————————————————————————————o query timer —>
  //
  let totalSeconds = 0;

  const setTime = () => {
    ++totalSeconds;
  };

  // o————————————————————————————————————o api, waves hands —>
  //
  const makeRequest = (requestValue) => {
    setFirstRun(false);
    setSpinnerVisible(true);
    setPromptSubmitted(true);
    setModalVisible(false);
    setGptReferences([]);

    const responseTimer = setInterval(setTime, 1000);

    // const inputElement =
    //   document.getElementsByClassName("prompt-form__inner")[0];
    // inputElement.blur();
    // inputElement.innerHTML = requestValue;

    const newPrompt = {
      prompt: requestValue,
    };

    const textarea = document.querySelector("textarea");
    textarea.blur();

    const thePage = window.location.pathname.split("/").pop();

    // change the api endpoint based on the page
    //
    let endpoint = "";
    if (thePage === "stability") {
      endpoint = "image";
    } else {
      endpoint = "prose";
    }

    axios
      // .post("http://127.0.0.1:5000/image", newPrompt, {
      // .post("http://localhost:3001/prose", newPrompt, {
      // .post(`https://thirdeyes-flask-dev.vercel.app/${endpoint}`, newPrompt, {
      // .post("https://third-eyes-flask.vercel.app/prose", newPrompt, {
      .post(`https://third-eyes-flask.vercel.app/${endpoint}`, newPrompt, {
        timeout: 90000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // o——————————————————o stability —>
        //
        if (thePage === "stability") {
          // console.log("responseJson", JSON.parse(response.data[2]));

          const prompt2 = true;
          const imagePrompts = JSON.parse(response.data[2]);

          stability(imagePrompts.img_description_1);
          stability(imagePrompts.img_description_2, prompt2);
        }

        setGptFreestyle(response.data[0]);

        ((response) => {
          const newResponses = response.data[1].filter((item) => {
            if (!seenIds.has(item.reviewid)) {
              seenIds.add(item.reviewid);
              return true;
            }
            return false;
          });

          const newChatResponse = newResponses.map((item, index) => (
            <div
              key={`${item.reviewid}-${index}`}
              className="response__reference"
            >
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.title}
              </a>
            </div>
          ));
          setSeenIds(seenIds);

          setGptReferences((gptReferences) => [
            ...gptReferences,
            ...newChatResponse,
          ]);
          setSpinnerVisible(false);
          setPromptSubmitted(false);
        })(response);
      })
      .then(() => {
        setSpinnerVisible(false);
        setPromptSubmitted(false);
        setIntroVisible(false);
        setDisplayTimer(totalSeconds + "s");
        clearInterval(responseTimer);
        totalSeconds = 0;
        const refocusTextarea = document.querySelector("textarea");
        refocusTextarea.focus();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // o————————————————————————————————————o form + modal —>
  //
  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    makeRequest(inputValue);
  }

  function handleEnterKey(event) {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
    if (event.key === "Escape") {
      setModalVisible(false);
    }
  }

  function OnInput() {
    this.style.height = 0;
    this.style.height = this.scrollHeight + "px";
  }

  useEffect(() => {
    const introText = document.querySelector("textarea");
    introText.setAttribute(
      "style",
      "height:" + (introText.scrollHeight - 20) + "px;overflow-y:hidden;"
    );
    introText.addEventListener("input", OnInput, false);

    const responseForm = document.querySelector(
      ".response__container textarea"
    );
    responseForm.setAttribute(
      "style",
      "height:" + (responseForm.scrollHeight - 20) + "px;overflow-y:hidden;"
    );
    responseForm.addEventListener("input", OnInput, false);
  });

  useEffect(() => {
    addEventListener("keydown", setModalVisible);
  }, []);

  useEffect(() => {
    textareaRef.current.focus();
    !firstRun && removeEventListener("keydown", setModalVisible);
    setFirstRun(false);
  }, [modalVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  // o————————————————————————————————————o trigger via example prompts —>
  //
  useEffect(() => {
    const examplePrompts = document.querySelectorAll(
      ".introduction__example-prompts li"
    );

    examplePrompts.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.stopImmediatePropagation(); // Stop other event listeners from firing
        makeRequest(event.target.textContent);
        setInputValue(event.target.textContent);
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* <Modal
        show={modalVisible}
        setModalVisible={setModalVisible}
        typeUse="modal--input"
      >
        <div className="modal__inputter">
          <span className="before-cursor">%</span>
          <form onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              placeholder="Explore music insights"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleEnterKey}
            ></textarea>
          </form>
        </div>
      </Modal> */}
      <section
        className={`${
          bottomOfPage ? "prompt-form prompt-form--bottom" : "prompt-form"
        }`}
        onClick={() => setModalVisible(true)}
      >
        <span className="before-cursor"> % </span>
        <div
          className={
            promptSubmitted
              ? "prompt-form__input prompt-form--submitted"
              : "prompt-form__input"
          }
          ref={formRef}
        >
          <div className="prompt-form__inner" tabIndex="0">
            <form onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                placeholder="Explore music insights"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleEnterKey}
              ></textarea>
            </form>
            {/* <div className="hello">
                <div className="hello__typewriter"></div>
                <div className="prompt-form__cursor"></div>
              </div> */}
          </div>
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
      </section>
    </>
  );
};

export default PromptForm;
