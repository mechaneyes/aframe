"use client";

import { useEffect } from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import Image from "next/image";

import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";
import { introVisibleAtom } from "/services/state-jotai.js";
import { examplePromptAtom } from "/services/state-jotai.js";
import { gptFreestyleAtom } from "/services/state-jotai.js";
import { gptReferencesAtom } from "/services/state-jotai.js";

import "./styles/styles.scss";

export default function Home() {
  const [introVisible, setIntroVisible] = useAtom(introVisibleAtom);
  const gptFreestyle = useAtomValue(gptFreestyleAtom);
  const gptReferences = useAtomValue(gptReferencesAtom);
  const setExamplePrompt = useSetAtom(examplePromptAtom);

  useEffect(() => {
    setIntroVisible(true);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // o————————————————————————————————————o trigger via example prompts —>
  //
  useEffect(() => {
    const examplePrompts = document.querySelectorAll(
      ".introduction__example-prompts li"
    );
    examplePrompts.forEach((item) => {
      item.addEventListener("click", (event) => {
        setTimeout(() => {
          setExamplePrompt(event.target.textContent);
        }, 100);
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="thirdeyes thirdeyes--home">
      <PromptForm />
      <Header page="home" />

      {/* // o————————————————————————————————————o introduction —> */}
      {/* // */}
      <section
        className={
          introVisible
            ? "introduction introduction--visible"
            : "introduction introduction--hidden"
        }
      >
        <p className="introduction__description">
          Use OpenAI&apos;s GPT-3 (the technology powering ChatGPT) to
          interrogate a knowledge base built from 18,393 Pitchfork reviews. The
          app will surface insights and references for both industry needs and
          personal music discovery.
        </p>
        <p className="introduction__call-to-action">Enter your prompt up top to begin.</p>
        <p className="introduction__note">Note: Interacting with LLMs takes time. Patience, Daniel-son.</p>
        <div className="introduction__example-prompts">
          <h3>Example Prompts</h3>
          <ul>
            <li>Introduce me to ambient music</li>
            <li>
              What&apos;s Frankie Knuckles&apos;s impact on music and culture?
            </li>
            <li>Give me a 20 song playlist of outstanding Detroit techno</li>
            <li>Dissect Radiohead&apos;s Kid A</li>
            <li>What is the history of the Roland TB-303?</li>
            <li>Tell me about music that incorporates NASA mission sounds</li>
          </ul>
        </div>
        <p className="introduction__feedback">
          Feedback is appreciated:{" "}
          <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
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

      {/* // o————————————————————————————————————o response —> */}
      {/* // */}
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
