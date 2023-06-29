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
            <div className="hello">{/* <Link href="/">Home</Link> */}</div>
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
            Welcome. I&apos;m Ray Weitzenberg, the creator of Third Eyes. This
            application represents my first experiment with harnessing the power
            of AI to generate music-related content and accompanying images.
          </p>
          <p>
            While I may not hold the title of data scientist (yet!), the journey
            of creating Third Eyes has allowed me to gain invaluable experience
            with a variety of related technologies. I&apos;m currently immersing
            myself in the world of Python, and I&apos;m eager to delve deeper
            into data science once I&apos;ve tamed the snake.
          </p>
          <p>
            The content generated in Third Eyes stems from a dataset built
            during the winter of 2016-2017. Although it might not be the most
            current, it&apos;s been a fantastic starting point for this project.
            Nolan Conaway, who created the dataset has open sourced the scraper
            he wrote to retrieve the content. I&apos;m looking forward to
            utilizing his scraper to incorporate even more, and the most recent
            reviews into Third Eyes.
          </p>
          <p>
            For a more technical deep dive into the making of Third Eyes, check
            out{"  "}
            <a href="https://winterwerk.one/posts/thirdeyes-mvp">
              this post on WinterWerk
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
