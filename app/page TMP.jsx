'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [chatResponse, setChatResponse] = useState([])
  const [displayedResponse, setDisplayedResponse] = useState([])

  const chatter = async () => {
    const res = await fetch("/api/hello/world")
    const json = await res.json()
    // setChatResponse(json[0].page_content)

    const response = (
      json.map((item) => (
        <p key={item.metadata.reviewid} className="response__item">{item.page_content}</p>
      ))
    );
    setChatResponse(response);
  }

  // useEffect(() => {
  //   chatter()
  // }, [])

  useEffect(() => {
    setDisplayedResponse(chatResponse)
  }, [chatResponse])

  const handleInput = event => {
    setPrompt(event.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrompt = {
      "prompt": prompt
    }

    fetch("/api/prompt", {
      method: "POST",
      body: JSON.stringify(newPrompt)
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
      .then((responseJson) => {
        console.log('responseJson', responseJson)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text"
            placeholder="prompt here"
            onChange={handleInput} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div className="response__container">
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Response
        </h2>
        {/* <div className="response">{displayedResponse}</div> */}
      </div>
    </main>
  );
}
