"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import axios from "axios";

import "./styles/styles.scss";

export default function Home() {
  const [content, setContent] = useState([]);
  const [chatResponse, setChatResponse] = useState([]);
  const [triggerDisplay, setTriggerDisplay] = useState(false);
  const [gptFreestyle, setGptFreestyle] = useState([]);
  const [seenIds, setSeenIds] = useState(new Set());
  const [displayedResponse, setDisplayedResponse] = useState([]);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const formRef = useRef(null);

  const root = document.documentElement;
  
  useEffect(() => {
    const promptForm = document.querySelector(".prompt-form__input");

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
    setDisplayedResponse(chatResponse);
  }, [triggerDisplay]);

  const hidePlaceholder = () => {
    setPlaceholderVisible(false);
  };

  const handleChange = (e) => {
    // console.log('e', e.key);
    // add e.key to content
    // setContent(content + e.key);

    if (e.which === 13) {
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

          const noQuotes = response.data[0];
          setGptFreestyle(noQuotes);

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

            setChatResponse((chatResponse) => [
              ...chatResponse,
              ...newChatResponse,
            ]);

            setSeenIds(seenIds);
          })(response);
        })
        .then(() => {
          setTriggerDisplay(!triggerDisplay);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <main className="thirdeyes flex min-h-screen flex-col items-center justify-between p-8">
      <div
        className="prompt-form prompt-form__input"
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

      <div className="response__container">
        {/* <h2 className={`mb-3 text-2xl font-semibold`}>Response</h2> */}
        <div
          className="response response--creative"
          dangerouslySetInnerHTML={{ __html: gptFreestyle }}
        ></div>
        <br />
        <br />
        <div className="response response--references">{displayedResponse}</div>
      </div>
    </main>
  );
}
