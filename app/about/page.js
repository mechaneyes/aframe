"use client";

import { useEffect, useRef } from "react";

import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";

import "../styles/styles.scss";

export default function Page() {
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

  return (
    <main className="thirdeyes thirdeyes--about flex min-h-screen flex-col items-center p-8">
      <PromptForm formRef={formRef} />
      <Header page="about" />

      <section className="introduction introduction--visible">
        <div className="introduction__description">
          <p>
            Hello! I&apos;m Ray Weitzenberg and welcome to Aframe - an
            exploration into the intersection of AI and music data.
          </p>
          <p>
            Although I don&apos;t officially wear the &apos;data scientist&apos;
            badge yet, the experience I&apos;ve gained during the creation of
            Aframe has proven to be invaluable. Currently, I&apos;m navigating
            the vast Python landscape with an eager mind set to venture further
            into data science once I have mastered this programming language.
          </p>
          <p>
            Aframe&apos;s content is derived from an initial{" "}
            <a href="https://www.kaggle.com/datasets/nolanbconaway/pitchfork-data">
              dataset of 18,393 Pitchfork reviews
            </a>{" "}
            , accumulated during the frosty winter of 2016-2017. Though this
            data may not be the most recent, it provided a robust launching pad
            for this project. I&apos;m also excited to share that the expansion
            of our dataset is underway. This includes a variety of more
            contemporary and diverse music data to further power Aframe.
          </p>
          <p>
            For the heavy lifting, I&apos;ve utilized state-of-the-art AI
            technologies such as OpenAI&apos;s GPT-4, GPT-3.5 and Embeddings
            models, Langchain, the Stability.ai API, and Pinecone. In terms of
            web development, I&apos;ve utilized Next.js and Material Design.
          </p>
          <p>
            I warmly invite your feedback and comments. You can reach me at
            {"  "}
            <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>. Join me
            in combining AI and music data in fresh, creative ways.
          </p>
        </div>
      </section>
    </main>
  );
}
