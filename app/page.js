"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [chatResponse, setChatResponse] = useState([]);
  const [displayedResponse, setDisplayedResponse] = useState([]);
  const [seenContents, setSeenContents] = useState(new Set());

  useEffect(() => {
    setDisplayedResponse(chatResponse);
  }, [chatResponse]);

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
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("responseJson", response.data);

        const newResponses = response.data.filter(
          (item) => !seenContents.has(item.page_content)
        );
        const newChatResponse = newResponses.map((item) => (
          <div key={item.metadata.reviewid} className="response">
            <p>{item.page_content}</p>
            <a href={item.metadata.url}>{item.metadata.url}</a>
          </div>
        ));
        setChatResponse((chatResponse) => [
          ...chatResponse,
          ...newChatResponse,
        ]);
        setSeenContents(
          (seenContents) =>
            new Set([
              ...seenContents,
              ...newResponses.map((item) => item.page_content),
            ])
        );
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
        {displayedResponse}
      </div>
    </main>
  );
}
