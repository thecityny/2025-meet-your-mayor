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

export const SocialShareButtons: React.FC<{
  /**
   * Details on the matching score with the top candidate — only present if the user has completed the quiz.
   */
  results?: ScoreShareDetails;
}> = ({ results }) => {
  const shareUrl = `${process.env.GATSBY_DOMAIN}${process.env.GATSBY_SLUG}`;
  const shareText = !!results
    ? `I'm a ${results.matchScore}%25 match with ${results.topCandidate} on THE CITY's Meet Your Mayor quiz:`
    : `Check out THE CITY's Meet Your Mayor quiz!`;

  return (
    <>
      <SocialIcon
        className="mr-2"
        target="_blank"
        rel="noopener noreferrer"
        url={`https://x.com/intent/post?text=${shareText}&url=${shareUrl}`}
      />
      <SocialIcon
        className="mr-2"
        target="_blank"
        rel="noopener noreferrer"
        url={`https://bsky.app/intent/compose?text=${shareText} ${shareUrl}`}
      />
      <SocialIcon
        className="mr-2"
        target="_blank"
        rel="noopener noreferrer"
        url={`mailto:?subject=Meet Your Mayor: 2025&body=${shareText} ${shareUrl}`}
      />
    </>
  );
};
