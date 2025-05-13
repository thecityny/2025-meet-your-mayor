import React from "react";
import parse from "html-react-parser";
import { useLocation } from "@reach/router";
import candidateList from "./candidate-list.json";

export type CandidateName = {
  name: string;
};

/**
 * Converts string to kebab case (for generating a url slug).
 * NOTE: this implementation is copied with an implementation in gatsby-node.js (not ideal).
 */
export const kebabCase = (string: string) => {
  return string
    .replace(/\d+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("-");
};

export function useIsCandidatePage() {
  const location = useLocation();
  const lastPathSegment = location.pathname
    .split("/")
    .filter((path) => path !== "")
    .pop();
  const candidateSlugs = JSON.parse(JSON.stringify(candidateList)).map(
    (c: CandidateName) => kebabCase(c.name)
  );
  return candidateSlugs.includes(lastPathSegment);
}

/**
 * Groups an array of objects by a specified key.
 * @param array - The array to group.
 * @param key - The key to group by.
 * @returns An object where each key is a unique value from the specified key,
 *           and the value is an array of objects that share that key value.
 */
export const groupBy = <T, K extends keyof any>(
  array: T[],
  key: keyof T
): Record<K, T[]> => {
  return array.reduce((acc, item) => {
    const groupKey = item[key] as K; // Ensure the key is treated as the correct type

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }

    acc[groupKey].push(item);
    return acc;
  }, {} as Record<K, T[]>);
};

/**
 *
 * @param array - The array to shuffle.
 * @returns A new array with the elements shuffled randomly.
 */
export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
  return array;
};

/**
 * Converts a string containing HTML to a React component.
 *
 * @param text - The string containing HTML to convert.
 * @returns A React component representing the HTML.
 */
export const convertToHtml = (text: string) => {
  let formattedText = text;

  // Make links outbound:
  formattedText = formattedText.replace(
    "<a href=",
    '<a target="_blank" rel="noopener noreferrer" href='
  );

  // Fix double spaces and non-spaced commas:
  formattedText = formattedText.replace("  ", " ").replace(",", ", ");

  return parse(formattedText);
};

export const Paragraph: React.FC<{ text: string }> = ({ text }) => (
  <p className="mb-2">{convertToHtml(text)}</p>
);

export const splitParagraphs = (content: string) =>
  content.split("{newParagraph}");

export const formatContent = (content: string) => (
  <>
    {splitParagraphs(content).map((paragraph, i) => (
      <Paragraph key={i} text={paragraph} />
    ))}
  </>
);

export const arrayToNiceList = (list: string[]) => {
  if (list.length === 1) {
    return <span>{list[0]}</span>;
  } else if (list.length > 1) {
    return (
      <span>
        {list.slice(0, -1).join(", ")} and {list.slice(-1)}
      </span>
    );
  } else return <></>;
};

export function smoothScrollToCenter(
  target: HTMLElement,
  duration: number = 500
): void {
  const elementTop = target.getBoundingClientRect().top + window.scrollY;
  const elementHeight = target.offsetHeight;
  const viewportHeight = window.innerHeight;
  const targetY = elementTop - viewportHeight / 2 + elementHeight / 2;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function animateScroll(currentTime: number): void {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // Clamp between 0 and 1

    // Ease-in-out cubic function
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}
