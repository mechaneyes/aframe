"use client";

import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";

import { stability } from "./stability";
import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";

import { introVisibleAtom } from "/store/state-jotai.js";
import { gptFreestyleAtom } from "/store/state-jotai.js";
import { gptReferencesAtom } from "/store/state-jotai.js";

import "../styles/styles.scss";

export default function Stability() {
  const [introVisible, setIntroVisible] = useAtom(introVisibleAtom);
  const gptFreestyle = useAtomValue(gptFreestyleAtom);
  const gptReferences = useAtomValue(gptReferencesAtom);

  useEffect(() => {
    setIntroVisible(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="thirdeyes thirdeyes--stability">
      <PromptForm stability={stability} />
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
          together to generate information, this time with one additional step:
          in addition to the copy generated, your prompt provides the basis for
          creating images, providing a visual dimension to the generated
          content.
        </p>
        <p>
          After the copy is generated and presented that output is sent back
          to GPT-3.5 to distill its sentiment into a single sentence. This
          sentence becomes a new prompt then sent to the Stability API which
          uses Stable Diffusion, a text-to-image model, to generate the image.
        </p>
        <p>
          Because this process is so slow, the image is injected after the 3rd
          paragraph, in hopes that you won&apos;t notice it appearing after the
          fact. No 3rd paragraph, no image. Sorry.
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
