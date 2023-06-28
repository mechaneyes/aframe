"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { stability } from "./stability";

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

  useEffect(() => {
    stability();

    // imageKeys.forEach((key) => {
    //   const url = sessionStorage.getItem(key);
    //   const img = document.createElement("img");
    //   img.src = url;
    // });

    const imageData = sessionStorage.getItem("v1_txt2img_0.png");
    const url = `data:image/png;base64,${imageData}`;

    const debaser = sessionStorage.getItem('debaser');
    const img = document.createElement("img");
    img.src = debaser;
    document.querySelector('.introduction').appendChild(img);
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
    // secondsLabel.innerHTML = pad(totalSeconds % 60);
    // minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  };

  // o————————————————————————————————————o placeholder —>
  //
  const hidePlaceholder = () => {
    setPlaceholderVisible(false);
  };

  // typewriter animation on load
  //
  useEffect(() => {
    let i = 0;
    const copy = "start your exploration here: ";
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

  // focus on input first keypress & || header click
  //
  useEffect(() => {
    addEventListener("keydown", (event) => {
      if (firstInput) {
        formRef.current.focus();
        setFirstInput(false);
      }
    });

    document
      .querySelector(".prompt-form__centered")
      .addEventListener("click", (event) => {
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
    setGptReferences([]);
    const responseTimer = setInterval(setTime, 1000);

    const inputElement =
      document.getElementsByClassName("prompt-form__input")[0];

    inputElement.blur();

    const newPrompt = {
      prompt: inputElement.innerHTML,
    };

    console.log(inputElement.innerHTML);

    axios
      .post("http://127.0.0.1:5000/prompt", newPrompt, {
        // .post("https://third-eyes-flask.vercel.app/prompt", newPrompt, {
        timeout: 90000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("responseJson", response);

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
              <a href={item.url}>{item.title}</a>
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
        setTriggerDisplay(!triggerDisplay);
        setDisplayTimer(totalSeconds + "s");
        clearInterval(responseTimer);
        totalSeconds = 0;
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
      // 🐝 TODO: one of these should come out
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
                <div className="hello__typewriter"></div>
                <div className="prompt-form__cursor"></div>
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
        <h1 className="introduction__title" onClick={() => stability()}>
          Third Eyes
        </h1>
        <p className="introduction__description">
          Interrogate a knowledge base built from 18,393 Pitchfork reviews. And
          use it to surface insights and references for both industry needs and
          personal music discovery.
        </p>
        <p>
          Some technologies leveraged include Langchain, OpenAI&apos;s GPT-3.5
          and Embeddings models, Pinecone and Next.js.
        </p>
        <p className="introduction__feedback">
          Feedback is appreciated:{" "}
          <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
        </p>
        <p>
          <Link href="/about">About</Link>
        </p>
        <div className="introduction__image">
          <Image
            src="/party-pic-1024px-1.0.1.jpg"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            alt="Party Pic"
            priority
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
        <Link href="/">
          <h1 className="introduction__title">Third Eyes</h1>
        </Link>
        <p className="introduction__feedback">
          Feedback is appreciated:{" "}
          <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
        </p>
        <div
          className="response response--creative"
          dangerouslySetInnerHTML={{ __html: gptFreestyle }}
        ></div>
        <h2>References</h2>
        <div className="response response--references">{gptReferences}</div>
      </section>
    </main>
  );
}
