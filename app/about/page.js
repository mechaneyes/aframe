"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import "../styles/styles.scss";

export default function Page() {
  return (
    <main className="thirdeyes thirdeyes--about flex min-h-screen flex-col items-center justify-between p-8">
      <section className="prompt-form">
        <div className="prompt-form__centered">
          <div className="prompt-form__input">
            <div className="hello">
              <Link href="/">Home</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="response__container response__container--visible">
        <Link href="/">
          <h1 className="introduction__title">Third Eyes</h1>
        </Link>
        <p className="introduction__feedback">
          <Link href="/">Home</Link> &middot; {""}
          <Link href="/stability">Labs</Link> &middot; {""}
          <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
        </p>
        <h2>About</h2>
        <div className="response response--references">
          <p>
            Welcome. I&apos;m Ray Weitzenberg. Third Eyes is my first experiment
            with building an AI leveraged application.
          </p>
          <p>
            While I&apos;m not a data scientist at this point, I&apos;ve
            successfully leveraged a lot of related technologies in service of
            Third Eyes&apos; production. I&apos;m concurrently immersed in
            learning Python, and once I feel I&apos;ve got a solid grasp on it,
            I&apos;ll be able to dive deeper into the data science side of
            things.
          </p>
          <p>
            The dataset used was built over the winter of 2016-2017, so
            it&apos;s not the most current. Nolan Conaway, who built the
            dataset, has a more recent version,{" "}
            <a href="https://www.kaggle.com/datasets/nolanbconaway/24169-pitchfork-reviews">
              24,169 Pitchfork Reviews
            </a>
            . I plan on using the scraper he built to get even more recent
            reviews on my own.
          </p>
          <p>
            For more of the technical backstory check this WinterWerk post:{" "}
            <a href="https://winterwerk.one/posts/thirdeyes-mvp">
              https://winterwerk.one/posts/thirdeyes-mvp
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
