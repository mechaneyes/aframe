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
    if (e.which === 13) {
      e.preventDefault();
      setSpinnerVisible(true);
      setPromptSubmitted(true);
      setInterval(setTime, 1000);
      setGptReferences([]);

      console.log(
        document.getElementsByClassName("prompt-form__input")[0].innerHTML
      );

      const newPrompt = {
        prompt:
          document.getElementsByClassName("prompt-form__input")[0].innerHTML,
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
          setDisplayTimer(totalSeconds);
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
            <div>
              hello<div className="prompt-form__cursor"></div>
            </div>
          ) : (
            content
          )}
        </div>
        <div className="spinner lds-ripple">
          {spinnerVisible ? (
            <>
              <div></div>
              <div></div>
            </>
          ) : (
            <p
              className="timer"
              dangerouslySetInnerHTML={{ __html: displayTimer + "s" }}
            ></p>
          )}
        </div>
      </div>

      <div className="response__container">
        {/* <h2 className={`mb-3 text-2xl font-semibold`}>Response</h2> */}
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
