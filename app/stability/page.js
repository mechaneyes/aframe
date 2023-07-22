"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { stability } from "./stability";
import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";

import "../styles/styles.scss";

export default function Home() {
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

  let promptFormProps = {
    placeholderVisible,
    promptSubmitted,
    spinnerVisible,
    formRef,
    displayTimer,
  };

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

  // o————————————————————————————————————o placeholder —>
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

  // o————————————————————————————————————o focus —>
  //
  // focus on input first keypress & || header click
  //
  const handlePromptFocus = (event) => {
    setPlaceholderVisible(false);
    const focusOnMe = document.querySelector(".prompt-form__inner");
    focusOnMe.focus();

    removeEventListener("keydown", handlePromptFocus);
    document
      .querySelector(".prompt-form__centered")
      .removeEventListener("click", handlePromptFocus);
  };

  useEffect(() => {
    addEventListener("keydown", handlePromptFocus);
    document
      .querySelector(".prompt-form__centered")
      .addEventListener("click", handlePromptFocus);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // o————————————————————————————————————o api, waves hands —>
  //
  const makeRequest = () => {
    setSpinnerVisible(true);
    setPromptSubmitted(true);
    setGptReferences([]);
    removeEventListener("keydown", handlePromptFocus);

    const responseTimer = setInterval(setTime, 1000);

    const inputElement =
      document.getElementsByClassName("prompt-form__inner")[0];

    inputElement.blur();

    const newPrompt = {
      prompt: inputElement.innerHTML,
    };

    console.log(inputElement.innerHTML);

    axios
      // .post("http://127.0.0.1:5000/image", newPrompt, {
      // .post("http://localhost:3001/image", newPrompt, {
      // .post("https://thirdeyes-flask-dev.vercel.app/image", newPrompt, {
      .post("https://third-eyes-flask.vercel.app/image", newPrompt, {
        timeout: 90000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // o————————————————————————————————————o stability —>
        //
        console.log("responseJson", JSON.parse(response.data[2]));
        const imagePrompts = JSON.parse(response.data[2]);
        stability(imagePrompts.img_description_1);

        // o————————————————————————————————————o copy —>
        //
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
      document.getElementsByClassName("prompt-form__inner")[0];
    if (!placeholderVisible) {
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

    // when clicking on example prompts
    //
    const examplePrompts = document.querySelectorAll(
      ".introduction__example-prompts li"
    );
    examplePrompts.forEach((item) => {
      item.addEventListener("click", (event) => {
        const promptText = event.target.textContent;
        setPlaceholderVisible(false);
        setTimeout(() => {
          const promptInput = document.querySelector(".prompt-form__inner");
          promptInput.innerHTML = promptText;
          makeRequest();
          setFirstInput(false);
        }, 100);
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholderVisible]);

  return (
    <main className="thirdeyes thirdeyes--stability flex min-h-screen flex-col items-center p-8">
      <PromptForm {...promptFormProps} />
      <Header page="stability" />

      <section
        className={
          introVisible
            ? "introduction introduction--visible"
            : "introduction introduction--hidden"
        }
      >
        <p className="introduction__description">
          In this experiment multiple Large Language Models (LLMs) are strung
          together to generate the information you didn&apos;t know you were
          after. The content generated by OpenAI&apos;s GPT-3 (the technology
          powering ChatGPT) is used to create images, providing a visual
          dimension to the generated content.
        </p>
        <p>
          After the first bit of content is generated, that output is sent back
          to GPT-3 to distill its sentiment into a single sentence. This
          sentence becomes a new prompt then sent to the Stability API which
          uses Stable Diffusion, a text-to-image model, to generate the image.
        </p>
        <p>
          Because this process is so slow, the image is injected after the 3rd
          paragraph, in hopes that you won&apos;t notice it appearing after the
          fact. No 3rd paragraph, no image. Sorry.
        </p>
        {/* <p>
          Waiting for the image may feel like the passing of many moons, so
          channel your inner sloth, sit back, and trust the process.
        </p> */}
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
