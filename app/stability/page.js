"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { stability } from "./stability";

import "../styles/styles.scss";

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
        // formRef.current.focus();
        document.querySelector(".prompt-form__input").focus();
        setFirstInput(false);
      }
    });

    document
      .querySelector(".prompt-form__centered")
      .addEventListener("click", (event) => {
        if (firstInput) {
          // formRef.current.focus();
          document.querySelector(".prompt-form__input").focus();
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
      .post("http://127.0.0.1:5000/img", newPrompt, {
        // .post("https://third-eyes-flask.vercel.app/prompt", newPrompt, {
        timeout: 90000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // o————————————————————————————————————o stability —>
        console.log("responseJson", JSON.parse(response.data[2]));
        const imagePrompts = JSON.parse(response.data[2]);
        stability(imagePrompts.img_description_1);

        // o————————————————————————————————————o copy —>
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
    <main className="thirdeyes thirdeyes--stability flex min-h-screen flex-col items-center justify-between p-8">
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
        <h1 className="introduction__title">Third Eyes v Stability AI</h1>
        <p className="introduction__feedback">
          <Link href="/">Home</Link> &middot; <Link href="/about">About</Link>
          &middot; <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
        </p>
        <p className="introduction__description">
          In this application, we&apos;re working with multiple Large Language
          Models (LLMs) to generate the music-related information you&apos;re
          after. We take that information and distill it into prompts that are
          used to generate images, providing a visual dimension to the generated
          content.
        </p>
        <p>
          We use OpenAI&apos;s GPT-3 (the technology powering ChatGPT) to
          generate the prompts for the images. Each prompt is carefully crafted
          based on your input and the content generated. These prompts are then
          handed over to the Stability API, which uses them to create the
          corresponding images.
        </p>
        <p>
          Remember, great things take time. The process starts with extracting
          meaningful prompts from the GPT-3 output, and it doesn&apos;t end
          until the Stability API crafts the final images. It might feel like
          many moons have passed, so channel your inner sloth, sit back, and
          enjoy the process.
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
        <Link href="/">
          <h1 className="introduction__title">Third Eyes v Stability AI</h1>
        </Link>
        <p className="introduction__feedback">
          <Link href="/">Home</Link> &middot; <Link href="/about">About</Link>{" "}
          {"  "}
          &middot; &nbsp; {"  "}
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
