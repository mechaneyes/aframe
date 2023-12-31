"use client";

import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";

import { stability } from "./stability";
import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";

import { introVisibleAtom } from "/store/state-jotai.js";
import { gptFreestyleAtom } from "/store/state-jotai.js";
import { gptReferencesAtom } from "/store/state-jotai.js";

import "app/styles/styles.scss";

export default function Stability() {
  const [introVisible, setIntroVisible] = useAtom(introVisibleAtom);
  const gptFreestyle = useAtomValue(gptFreestyleAtom);
  const gptReferences = useAtomValue(gptReferencesAtom);

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

  return (
    <main className="thirdeyes thirdeyes--stability">
      <Header page="stability" />

      {/* // o————————————————————————————————————o introduction —> */}
      {/*  */}
      <section
        className={[...introClasses.concat(" ", ...modalClasses)].join("")}
      >
        <PromptForm stability={stability} />

        <p className="introduction__description">
          In this experiment multiple Large Language Models (LLMs) are strung
          together to generate information, this time with one additional step:
          in addition to the copy generated, your prompt provides the basis for
          creating images, providing a visual dimension to the generated
          content.
        </p>
        <p>
          After the copy is generated and presented that output is sent back to
          GPT-3.5 to distill its sentiment into a single sentence. This sentence
          becomes a new prompt then sent to the Stability API which uses Stable
          Diffusion, a text-to-image model, to generate the image.
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

      {/* // o————————————————————————————————————o response —> */}
      {/*  */}
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
        <PromptForm stability={stability} />

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
        <div className="response response--references">{gptReferences}</div>
      </section>
    </main>
  );
}
