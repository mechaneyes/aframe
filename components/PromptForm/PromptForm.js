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

  const [examplePrompt, setExamplePrompt] = useAtom(examplePromptAtom);
  const setIntroVisible = useSetAtom(introVisibleAtom);
  const setGptFreestyle = useSetAtom(gptFreestyleAtom);
  const setGptReferences = useSetAtom(gptReferencesAtom);

  const { stability, bottomOfPage } = props;

  // o————————————————————————————————————o header placeholder —>
  //
  // typewriter animation on load
  //
  useEffect(() => {
    let i = 0;
    const copy = "start exploring here: ";
    const speed = 50;
    function writeTyper() {
      if (i < copy.length) {
        document.querySelector(".hello__typewriter").innerHTML +=
          copy.charAt(i);
        i++;
        setTimeout(writeTyper, speed);
      }
    }
    writeTyper();
  }, []);

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

    const inputElement =
      document.getElementsByClassName("prompt-form__inner")[0];
    inputElement.blur();
    inputElement.innerHTML = requestValue;

    const newPrompt = {
      prompt: requestValue,
    };

    const textarea = document.querySelector('.modal--input textarea')
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
        setExamplePrompt("");
        setDisplayTimer(totalSeconds + "s");
        clearInterval(responseTimer);
        totalSeconds = 0;
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
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute(
        "style",
        "height:" + (tx[i].scrollHeight - 10) + "px;overflow-y:hidden;"
      );
      tx[i].addEventListener("input", OnInput, false);
    }
  }, []);

  useEffect(() => {
    addEventListener("keydown", setModalVisible);
  }, []);

  useEffect(() => {
    textareaRef.current.focus();
    !firstRun && removeEventListener("keydown", setModalVisible);
    setFirstRun(false);
  }, [modalVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    examplePrompt !== "" && makeRequest(examplePrompt);
  }, [examplePrompt]); // eslint-disable-line react-hooks/exhaustive-deps



  return (
    <>
      <Modal
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
      </Modal>
      <section
        className={`${
          bottomOfPage ? "prompt-form prompt-form--bottom" : "prompt-form"
        }`}
        onClick={() => setModalVisible(true)}
      >
        <div className="prompt-form__centered">
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
              <div className="hello">
                <div className="hello__typewriter"></div>
                <div className="prompt-form__cursor"></div>
              </div>
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
