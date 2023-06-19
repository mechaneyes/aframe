"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [chatResponse, setChatResponse] = useState([]);
  const [triggerDisplay, setTriggerDisplay] = useState(false);
  const [gptFreestyle, setGptFreestyle] = useState([]);
  const [seenIds, setSeenIds] = useState(new Set());
  const [displayedResponse, setDisplayedResponse] = useState([]);

  useEffect(() => {
    setDisplayedResponse(chatResponse);
  }, [triggerDisplay]);

  const handleInput = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrompt = {
      prompt: prompt,
    };

    axios
      .post("http://127.0.0.1:8000/api/prompt", newPrompt, {
        timeout: 60000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("responseJson", response.data);
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
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" placeholder="prompt here" onChange={handleInput} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div className="response__container">
        <h2 className={`mb-3 text-2xl font-semibold`}>Response</h2>
        <div className="response response--creative">
          <p>{gptFreestyle}</p>
        </div>
        <br />
        <br />
        <div className="response response--references">{displayedResponse}</div>
      </div>
    </main>
  );
}
