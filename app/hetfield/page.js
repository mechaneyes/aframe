"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";

import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";
import VerticalLinearStepper from "/components/Steppers/VerticalLinearStepper";
import ChatCard from "/components/Chat/ChatCard";

import "../styles/styles.scss";

export default function Hetfield() {
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [displayTimer, setDisplayTimer] = useState("");
  const [firstInput, setFirstInput] = useState(true);
  const formRef = useRef(null);
  const bottomOfPage = true;
  const [messages, setMessages] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [displayedTime, setDisplayedTime] = useState(Date.now());
  const [newCardAdded, setNewCardAdded] = useState(0);

  let promptFormProps = {
    placeholderVisible,
    promptSubmitted,
    spinnerVisible,
    formRef,
    displayTimer,
    bottomOfPage,
  };

  // o————————————————————————————————————o chat —>
  //
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function addMessage(text, position) {
    const newMessage = {
      text,
      position,
      date: new Date(),
      initTime: Date.now(),
      newCardAdded: true,
    };

    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((message) => ({
        ...message,
        newCardAdded: false,
      }));

      return [...updatedMessages, newMessage];
    });
  }

  // Prompt form handler
  function handlePrompt(response) {
    addMessage(response, 1);
  }

  // Response handler
  function handleResponse(response) {
    addMessage(response, 0);
  }

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
    if (firstInput) {
      addEventListener("keydown", handlePromptFocus);
      document
        .querySelector(".prompt-form__centered")
        .addEventListener("click", handlePromptFocus);

      setFirstInput(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // o————————————————————————————————————o api, waves hands —>
  //
  const makeRequest = () => {
    setSpinnerVisible(true);
    setPromptSubmitted(true);
    removeEventListener("keydown", handlePromptFocus);

    const responseTimer = setInterval(setTime, 1000);

    const inputElement =
      document.getElementsByClassName("prompt-form__inner")[0];
    inputElement.blur();

    const newPrompt = {
      prompt: inputElement.innerHTML,
    };

    console.log(inputElement.innerHTML);

    handlePrompt(inputElement.innerHTML);
    setNewCardAdded((prevNewCardAdded) => prevNewCardAdded + 1);

    axios
      // .post("http://127.0.0.1:5000/image", newPrompt, {
      // .post("http://localhost:3001/chat", newPrompt, {
      // .post("https://thirdeyes-flask-dev.vercel.app/chat", newPrompt, {
      .post("https://third-eyes-flask.vercel.app/chat", newPrompt, {
        timeout: 90000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        handleResponse(response.data);
        setSpinnerVisible(false);
        setPromptSubmitted(false);
        setDisplayTimer(totalSeconds + "s");
        clearInterval(responseTimer);
        totalSeconds = 0;
        setNewCardAdded((prevNewCardAdded) => prevNewCardAdded + 1);
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
    if (inputElement) {
      const submitHandler = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          e.preventDefault();
          makeRequest();

          inputElement.removeEventListener("keydown", submitHandler);
          inputElement.innerHTML = "";
          inputElement.focus();
        }
        inputElement.addEventListener("keydown", submitHandler);
      };
      inputElement.addEventListener("keydown", submitHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="thirdeyes thirdeyes--hetfield flex min-h-screen flex-col items-center p-8">
      <section className="chat-container">
        <div className="the-conversation">
          {messages.map((message, index) => (
            <ChatCard
              key={index}
              text={message.text}
              position={message.position}
              date={message.date}
              initTime={displayedTime}
              newCardAdded={message.newCardAdded}
            />
          ))}
        </div>
        <VerticalLinearStepper />
        <Header />
      </section>

      <PromptForm {...promptFormProps} />
    </main>
  );
}
