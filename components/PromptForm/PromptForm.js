import { useState, useEffect, useRef } from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import axios from "axios";

import Modal from "components/Modal/Modal";

import { introVisibleAtom } from "/store/state-jotai.js";
import { examplePromptAtom } from "/store/state-jotai.js";
import { gptFreestyleAtom } from "/store/state-jotai.js";
import { gptReferencesAtom } from "/store/state-jotai.js";
import { inputValueAtom } from "/store/state-jotai.js";
import { totalTimeAtom } from "/store/state-jotai.js";

const PromptForm = (props) => {
  const textareaRef = useRef(null);
  const formRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const [totalTime, setTotalTime] = useAtom(totalTimeAtom);
  const intervalIdRef = useRef(null);
  const [timerVisible, setTimerVisible] = useState(false);
  const [seenIds, setSeenIds] = useState(new Set());
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [thePage, setThePage] = useState("");
  const [hasRun, setHasRun] = useState(false);

  const examplePrompt = useAtomValue(examplePromptAtom);
  const setIntroVisible = useSetAtom(introVisibleAtom);
  const setGptFreestyle = useSetAtom(gptFreestyleAtom);
  const setGptReferences = useSetAtom(gptReferencesAtom);

  const { stability } = props;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window !== undefined && window.innerWidth <= 450) {
      setIsMobile(true);
    }
  }, []);

  // o————————————————————————————————————o form height —>
  //
  // height of prompt form grows on input
  //
  function handleTextareaInput() {
    if (textareaRef.current) {
      document.querySelector(
        ".prompt-form"
      ).style.height = `${textareaRef.current.scrollHeight}px`;
      document.querySelector(
        ".prompt-form__input"
      ).style.height = `${textareaRef.current.scrollHeight}px`;

      const promptForm = document.querySelector(".prompt-form");
      if (parseInt(promptForm.style.height) > 44) {
        document.querySelector(".prompt-form textarea").style.paddingBottom =
          "10px";
      }
    }
  }

  // o————————————————————————————————————o resize for example prompst —>
  //
  // form is set to accomodate example prompts 50ms after makeRequest()
  // 
  const resizeViaExamples = () => {
    let heightToSet = document.querySelectorAll(".prompt-form textarea");
    heightToSet = heightToSet[0].scrollHeight;

    const forms = document.querySelectorAll(".prompt-form");
    const inputs = document.querySelectorAll(".prompt-form__input");

    for (const form of forms) {
      form.style.height = `${heightToSet + 11}px`;
    }

    for (const input of inputs) {
      input.style.height = `${heightToSet + 11}px`;
    }
  };

  // o————————————————————————————————————o query timer —>
  //
  let countTime;

  const startTimer = () => {
    countTime = 0;
    intervalIdRef.current = setInterval(setTime, 100);
  };

  const stopTimer = () => {
    clearInterval(intervalIdRef.current);
  };

  const setTime = () => {
    countTime = Number(countTime) + 0.1;
    countTime = countTime.toFixed(1);

    setTotalTime(countTime);
  };

  // o————————————————————————————————————o api, waves hands —>
  //
  const makeRequest = (requestValue) => {
    setPromptSubmitted(true);
    setModalVisible(false);
    setGptReferences([]);
    setHasRun(true);
    startTimer();
    setTimerVisible(true);

    setTimeout(() => {
      resizeViaExamples();
    }, 50);

    const newPrompt = {
      prompt: requestValue,
    };

    const textarea = document.querySelector("textarea");
    textarea.blur();

    setThePage(window.location.pathname.split("/").pop());

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
        stopTimer();

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
          setPromptSubmitted(false);
        })(response);
      })
      .then(() => {
        setPromptSubmitted(false);
        setIntroVisible(false);
        clearInterval(responseTimer);
        textarea.innerHTML = inputValue;

        if (!isMobile) {
          const refocusTextarea = document.querySelector("textarea");
          refocusTextarea.focus();
        } else {
          setModalVisible(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // o————————————————————————————————————o form + modal —>
  //
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

  useEffect(() => {
    if (modalVisible) {
      const staticTextarea = document.querySelector("textarea");
      staticTextarea.blur();

      if (modalVisible) {
        const modalTextarea = document.querySelector(
          ".modal__inputter textarea"
        );
        modalTextarea.focus();
      }
    } else {
      document.querySelector(".introduction textarea").focus();
    }
  }, [modalVisible]);

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
              placeholder="Discover music. Start typing..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleEnterKey}
            ></textarea>
          </form>
        </div>
      </Modal>
      <section
        className={hasRun ? "prompt-form" : "prompt-form prompt-form--has-run"}
        onClick={() => isMobile && setModalVisible(true)}
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
            {/* <div className="prompt-form__cursor"></div> */}
            <form onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                placeholder="Discover music. Start typing..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onInput={handleTextareaInput}
                onKeyDown={handleEnterKey}
                autoFocus
              ></textarea>
            </form>
          </div>
        </div>
        {/* <p className={timerVisible ? "timer timer--visible" : "timer timer--hidden"}>{totalTime}s</p> */}
        <p className="timer timer--visible">{totalTime}s</p>
      </section>
    </>
  );
};

export default PromptForm;
