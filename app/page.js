"use client";

import { useEffect, useState } from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import Image from "next/image";

import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";
import { introVisibleAtom } from "/store/state-jotai.js";
import { modalVisibleAtom } from "/store/state-jotai.js";
import { examplePromptAtom } from "/store/state-jotai.js";
import { gptFreestyleAtom } from "/store/state-jotai.js";
import { gptReferencesAtom } from "/store/state-jotai.js";

import "./styles/styles.scss";

export default function Home() {
  const [introVisible, setIntroVisible] = useAtom(introVisibleAtom);
  const modalVisible = useAtomValue(modalVisibleAtom);
  const gptFreestyle = useAtomValue(gptFreestyleAtom);
  const gptReferences = useAtomValue(gptReferencesAtom);
  const setExamplePrompt = useSetAtom(examplePromptAtom);
  const [introClasses, setIntroClasses] = useState(
    "introduction introduction--visible"
  );
  const [modalClasses, setModalClasses] = useState(
    "introduction introduction--no-modal"
  );

  // o————————————————————————————————————o introduction classNames —>
  //
  useEffect(() => {
    if (introVisible) {
      setIntroClasses("introduction introduction--visible");
    } else {
      setIntroClasses("introduction introduction--hidden");
    }
  }, [introVisible]);

  useEffect(() => {
    console.log("modalVisible", modalVisible);
    if (modalVisible) {
      setModalClasses("blur--modal");
    } else {
      setModalClasses("blur--no-modal");
    }
  }, [modalVisible]);

  return (
    <main className="thirdeyes thirdeyes--home">
      <Header page="home" />

      {/* // o————————————————————————————————————o introduction —> */}
      {/* // */}
      <section
        className={[...introClasses.concat(" ", ...modalClasses)].join("")}
      >
        <p className="introduction__description">
          Use OpenAI&apos;s GPT-3.5 (the technology powering ChatGPT) to
          interrogate a knowledge base built from 18,393 Pitchfork reviews.
          Aframe will surface insights and references for your personal music
          discovery.
        </p>

        <PromptForm />

        <p className="introduction__note">
          Note: Interacting with LLMs takes time. Patience, Daniel-son.
        </p>
        <div className="introduction__example-prompts">
          <h3>Example Prompts</h3>
          <ul>
            <li>Introduce me to ambient music</li>
            <li>How did Frankie Knuckles impact music and culture?</li>
            <li>
              Give me a 20 song playlist inspired by David Mancuso&apos;s party,
              The Loft
            </li>
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
            ? [
                ...modalClasses.concat(
                  " ",
                  "response__container response__container--hidden"
                ),
              ].join("")
            : [
                ...modalClasses.concat(
                  " ",
                  "response__container response__container--visible"
                ),
              ].join("")
        }
      >
        <PromptForm />

        <div
          className="response response--creative"
          dangerouslySetInnerHTML={{ __html: gptFreestyle }}
        ></div>
        <div className="response response__intro">
          <h2>References</h2>
          <p>Wondering where the AI&apos;s insights come from?</p>{" "}
          <p>
            For clarity and trust, we&apos;ve provided direct links to the
            relevant Pitchfork reviews here, guiding you directly to the
            original content.
          </p>
        </div>
        <div className="response response__references">{gptReferences}</div>
      </section>
    </main>
  );
}
