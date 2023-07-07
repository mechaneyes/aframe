"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { MessageList } from "react-chat-elements";
import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";

import "../../app/styles/styles.scss";

export default function DraftingParameters() {
  // o————————————————————————————————————o focus —>
  //
  return (
    <>
      <p className="chat-info">
        This is currently a simple chat interface between you and GPT-3.5.
        Coming soon your conversation will be localized around the factually
        correct music info baked into the app.
      </p>
    </>
  );
}
