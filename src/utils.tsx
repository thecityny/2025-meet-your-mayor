import React from "react";
import parse from "html-react-parser";

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
  <p className="copy">{convertToHtml(text)}</p>
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
