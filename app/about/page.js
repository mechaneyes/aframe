"use client";

import Header from "/components/Header/Header";
import "../styles/styles.scss";

export default function Page() {
  return (
    <main className="thirdeyes">
      <Header page="about" />

      <section className="introduction introduction--visible">
        <div className="introduction__description">
          <p>
            Hello! I&apos;m Ray Weitzenberg and welcome to Aframe - an
            experiment at the intersection of AI and music.
          </p>
          <p>
            Aframe&apos;s content is derived from a dataset on Kaggle containing{" "}
            <a href="https://www.kaggle.com/datasets/nolanbconaway/pitchfork-data">
              18,393 Pitchfork reviews
            </a>
            {" "}assembled during the frosty winter of 2016-2017. While the data
            may not be the most current, it&apos;s provided a solid foundation for my
            venture into music-related data and my ongoing exploration of
            generative AI.
          </p>
          <p>
            For the heavy lifting, I&apos;ve utilized state-of-the-art AI
            technologies such as OpenAI&apos;s GPT-4, GPT-3.5 and Embeddings
            models, Langchain, the Stability.ai API, and Pinecone.
          </p>
          <p>
            I warmly invite your feedback and comments. You can reach me at
            {"  "}
            <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>. Let&apos;s
            collaborate to merge AI and music data in innovative ways.
          </p>
        </div>
      </section>
    </main>
  );
}
