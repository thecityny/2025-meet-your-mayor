import React from "react";
import { SocialIcon } from "react-social-icons";

type ScoreShareDetails = {
  topCandidate: string;
  /**
   * The percentage of the quiz that matches the top candidate.
   * This is a number between 0 and 100.
   */
  matchScore: number;
};

export const SocialButton: React.FC<{ url: string; ariaLabel?: string }> = ({
  url,
  ariaLabel,
}) => (
  <SocialIcon
    className="button is-icon mr-2 p-0"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel || "Share this link"}
    bgColor="#111111" // THE CITY Black
    style={{
      width: "25px",
      height: "25px",
    }}
    url={url}
  />
);

const getShareText = (
  platform: "x" | "bluesky" | "email",
  results?: ScoreShareDetails
) => {
  const theCityHandle =
    platform === "x"
      ? "@THECITYNY"
      : platform === "bluesky"
      ? "@thecity.nyc"
      : "THE CITY";
  const gothamistHandle =
    platform === "x"
      ? "@Gothamist"
      : platform === "bluesky"
      ? "@gothamist.com"
      : "Gothamist";
  return !!results
    ? `I'm a ${results.matchScore}%25 match with ${results.topCandidate} on the Meet Your Mayor quiz! Find your own match, powered by ${theCityHandle} and ${gothamistHandle}:`
    : `Check out the Meet Your Mayor quiz from ${theCityHandle} and ${gothamistHandle}!`;
};

export const SocialShareButtons: React.FC<{
  /**
   * Details on the matching score with the top candidate — only present if the user has completed the quiz.
   */
  results?: ScoreShareDetails;
}> = ({ results }) => {
  const shareUrl = `${process.env.GATSBY_DOMAIN}${process.env.GATSBY_SLUG}`;
  return (
    <>
      <SocialButton
        url={`https://x.com/intent/post?text=${getShareText(
          "x",
          results
        )}&url=${shareUrl}`}
        ariaLabel="Share on X"
      />
      <SocialButton
        url={`https://bsky.app/intent/compose?text=${getShareText(
          "bluesky",
          results
        )} ${shareUrl}`}
        ariaLabel="Share on Bluesky"
      />
      <SocialButton
        url={`mailto:?subject=Meet Your Mayor: 2025&body=${getShareText(
          "email",
          results
        )} ${shareUrl}`}
        ariaLabel="Share via Email"
      />
    </>
  );
};
