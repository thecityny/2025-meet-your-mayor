import React from "react";
import { useLocation } from "@reach/router";
import { kebabCase } from "./QuizContent";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classnames from "classnames";

type ImageSize = "is-48x48" | "is-96x96" | "is-128x128";

export const Bobblehead: React.FC<{
  candidateName: string;
  size: ImageSize;
}> = ({ candidateName, size }) => {
  const { pathname } = useLocation();

  // TODO: once we have all illustraitons, remove this randomizaiton of illustration paths:
  const imagePrefix = ["Eric Adams", "Jessica Ramos"].includes(candidateName)
    ? kebabCase(candidateName)
    : Math.random() > 0.5
    ? "eric-adams"
    : "jessica-ramos";

  console.log(pathname);
  return (
    <figure className={classnames("image", size)}>
      <LazyLoadImage
        src={`./illustrations/${imagePrefix}-head.png`}
        className="illustration top"
        alt={candidateName}
      />
      <LazyLoadImage
        src={`./illustrations/${imagePrefix}-bust.png`}
        className="illustration top"
        alt={candidateName}
      />
    </figure>
  );
};
