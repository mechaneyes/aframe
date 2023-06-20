"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
  const formRef = useRef(null);

  const root = document.documentElement;

  useEffect(() => {
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

    // window.addEventListener("resize", updateResponseContainerHeight);
    // updateResponseContainerHeight();
  }, []);

  useEffect(() => {
    const introduction = document.querySelector(".introduction");
    const distanceFromLeft = introduction.offsetLeft;
    console.log(distanceFromLeft);
    root.style.setProperty("--distance-from-left", `${distanceFromLeft}px`);
  }, []);

  // o————————————————————————————————————o timer —>
  //   const minutesLabel = document.getElementById("minutes");
  //   const secondsLabel = document.getElementById("seconds");
  let totalSeconds = 0;

  const setTime = () => {
    ++totalSeconds;
    // secondsLabel.innerHTML = pad(totalSeconds % 60);
    // minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  };

  const pad = (val) => {
    let valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  };
  // <label id="minutes">00</label>:<label id="seconds">00</label>

  const hidePlaceholder = () => {
    setPlaceholderVisible(false);
  };

  const handleChange = (e) => {
    const inputElement =
      document.getElementsByClassName("prompt-form__input")[0];

    if (e.which === 13) {
      e.preventDefault();
      setSpinnerVisible(true);
      setPromptSubmitted(true);
      setInterval(setTime, 1000);
      setGptReferences([]);

      inputElement.blur();

      console.log(inputElement.innerHTML);

      const newPrompt = {
        prompt: inputElement.innerHTML,
      };

      axios
        .post("http://127.0.0.1:8000/api/prompt", newPrompt, {
          timeout: 0,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("responseJson", response);

          setGptFreestyle(response.data[0]);

          ((response) => {
            const newResponses = response.data[1].filter((item) => {
              if (!seenIds.has(item.metadata.reviewid)) {
                seenIds.add(item.metadata.reviewid);
                return true;
              }
              return false;
            });

            const newChatResponse = newResponses.map((item, index) => (
              <div
                key={`${item.metadata.reviewid}-${index}`}
                className="response__reference"
              >
                {/* <p>{item.page_content}</p> */}
                <a href={item.metadata.url}>{item.metadata.url}</a>
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
          setTriggerDisplay(!triggerDisplay);
          clearInterval(setTime);
          console.log("totalSeconds", totalSeconds);
          setDisplayTimer(totalSeconds + "s");
          setIntroVisible(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <main className="thirdeyes flex min-h-screen flex-col items-center justify-between p-8">
      <div className="prompt-form">
        <div
          className={
            promptSubmitted
              ? "prompt-form__input prompt-form--submitted"
              : "prompt-form__input"
          }
          contentEditable={true}
          suppressContentEditableWarning={true}
          onFocus={hidePlaceholder}
          onKeyDown={handleChange}
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
                spinnerVisible ? "timer timer--hidden" : "timer timer--visible"
              }
              dangerouslySetInnerHTML={{ __html: displayTimer }}
            ></p>
          )}
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
          Third Eyes is a tool that helps you write by providing you with
          references and inspiration from an archive built on top of 18,393
          Pitchfork reviews.
        </p>
        <p>
          The app is powered by GPT-3.5, a language model developed by OpenAI.
        </p>
      </section>

      <div className="response__container">
        <div
          className="response response--creative"
          dangerouslySetInnerHTML={{ __html: gptFreestyle }}
        ></div>
        <br />
        <br />
        <div className="response response--references">{gptReferences}</div>
      </div>
    </main>
  );
}
