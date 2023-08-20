import { atom } from "jotai";

export const introVisibleAtom = atom(true);
export const modalVisibleAtom = atom(false);
export const gptFreestyleAtom = atom([]);
export const gptReferencesAtom = atom([]);
export const examplePromptAtom = atom("");
export const inputValueAtom = atom("");
export const totalTimeAtom = atom(0);
