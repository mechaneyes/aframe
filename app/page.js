"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import axios from "axios";

import "./styles/styles.scss";

export default function Home() {
  const [content, setContent] = useState([]);
  const [triggerDisplay, setTriggerDisplay] = useState(false);
  const [gptFreestyle, setGptFreestyle] = useState([]);
  const [gptReferences, setGptReferences] = useState([]);
  const [seenIds, setSeenIds] = useState(new Set());
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [displayTimer, setDisplayTimer] = useState("");
  const [firstInput, setFirstInput] = useState(true);
  const formRef = useRef(null);

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

  // o————————————————————————————————————o timer —>
  //
  let totalSeconds = 0;

  const setTime = () => {
    ++totalSeconds;
    // secondsLabel.innerHTML = pad(totalSeconds % 60);
    // minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  };

  // o————————————————————————————————————o placeholder —>
  //
  const hidePlaceholder = () => {
    setPlaceholderVisible(false);
  };

  // focus on input when first key is pressed
  //
  useEffect(() => {
    addEventListener("keydown", (event) => {
      if (firstInput) {
        formRef.current.focus();
        setFirstInput(false);
      }
    });
  }, [firstInput]);

  // o————————————————————————————————————o api, waves hands —>
  //
  const makeRequest = () => {
    setSpinnerVisible(true);
    setPromptSubmitted(true);
    const responseTimer = setInterval(setTime, 1000);
    setGptReferences([]);

    const inputElement =
      document.getElementsByClassName("prompt-form__input")[0];
    inputElement.blur();

    console.log(inputElement.innerHTML);

    const newPrompt = {
      prompt: inputElement.innerHTML,
    };

    axios
      // .post("http://127.0.0.1:5000/prompt", newPrompt, {
      // .post("http://localhost:3000/api/prompt", newPrompt, {
      .post("https://third-eyes-flask.vercel.app/prompt", newPrompt, {
        timeout: 90000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("responseJson", response);

        setGptFreestyle(response.data);

        // setGptFreestyle(response.data[0]);

        // ((response) => {
        //   const newResponses = response.data[1].filter((item) => {
        //     if (!seenIds.has(item.metadata.reviewid)) {
        //       seenIds.add(item.metadata.reviewid);
        //       return true;
        //     }
        //     return false;
        //   });

        //   const newChatResponse = newResponses.map((item, index) => (
        //     <div
        //       key={`${item.metadata.reviewid}-${index}`}
        //       className="response__reference"
        //     >
        //       <a href={item.metadata.url}>{item.metadata.url}</a>
        //     </div>
        //   ));
        //   setSeenIds(seenIds);

        //   setGptReferences((gptReferences) => [
        //     ...gptReferences,
        //     ...newChatResponse,
        //   ]);
        //   setSpinnerVisible(false);
        //   setPromptSubmitted(false);
        // })(response);
      })
      .then(() => {
        setSpinnerVisible(false);
        setPromptSubmitted(false);
        setTriggerDisplay(!triggerDisplay);
        setDisplayTimer(totalSeconds + "s");
        clearInterval(responseTimer);
        totalSeconds = 0;
        setIntroVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // o————————————————————————————————————o trigger request —>
  //
  useEffect(() => {
    const inputElement =
      document.getElementsByClassName("prompt-form__input")[0];
    if (inputElement) {
      const submitHandler = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          e.preventDefault();
          makeRequest();

          inputElement.removeEventListener("keydown", submitHandler);
        }
        inputElement.addEventListener("keydown", submitHandler);
      };
      inputElement.addEventListener("keydown", submitHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="thirdeyes flex min-h-screen flex-col items-center justify-between p-8">
      <div className="prompt-form">
        <div className="prompt-form__centered">
          <div
            className={
              promptSubmitted
                ? "prompt-form__input prompt-form--submitted"
                : "prompt-form__input"
            }
            contentEditable={true}
            suppressContentEditableWarning={true}
            onFocus={hidePlaceholder}
            tabIndex="0"
            ref={formRef}
          >
            {placeholderVisible ? (
              <div className="hello">
                hello<div className="prompt-form__cursor"></div>
              </div>
            ) : (
              content
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
      </div>

      <section
        className={
          introVisible
            ? "introduction introduction--visible"
            : "introduction introduction--hidden"
        }
      >
        <h1 className="introduction__title">Third Eyes</h1>
        <p className="introduction__description">
          Third Eyes allows you to query a knowledge base of 18,393 Pitchfork
          reviews, surfacing inspiration and references for your listening, and
          potentially writing pleasure.
        </p>
        <p>
          This is an MVP, so please pardon the dust. The app runs a bit slowly
          atm.
        </p>
        <p className="introduction__feedback">
          Feedback is welcome:{" "}
          <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
        </p>
        <div className="introduction__image">
          <Image
            src="/party-pic-1024px-1.0.1.jpg"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            alt="Party Pic"
          />
        </div>
      </section>

      <section
        className={
          introVisible
            ? "response__container response__container--hidden"
            : "response__container response__container--visible"
        }
      >
        <h1 className="introduction__title">Third Eyes</h1>
        <p className="introduction__feedback">
          Feedback is welcome:{" "}
          <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
        </p>
        <div
          className="response response--creative"
          dangerouslySetInnerHTML={{ __html: gptFreestyle }}
        ></div>
        <br />
        <br />
        <div className="response response--references">{gptReferences}</div>
      </section>
    </main>
  );
}
