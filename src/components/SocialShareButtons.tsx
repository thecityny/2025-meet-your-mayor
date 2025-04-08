import React from "react";
import { SocialIcon } from "react-social-icons";

export const SocialShareButtons: React.FC = () => {
  const shareUrl = `${process.env.GATSBY_DOMAIN}${process.env.GATSBY_SLUG}`;
  return (
    <>
      <SocialIcon
        className="mr-2"
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: "30px", height: "30px" }}
        url={`https://twitter.com/intent/tweet?text=${shareUrl}`}
      />
      <SocialIcon
        className="mr-2"
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: "30px", height: "30px" }}
        url={`https://bsky.app/intent/compose?text=${shareUrl}`}
      />
      <SocialIcon
        className="mr-2"
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: "30px", height: "30px" }}
        url={`mailto:?subject=${process.env.GATSBY_SITE_NAME}&body=${shareUrl}`}
      />
    </>
  );
};
