import React from "react";
import { useLocation } from "@reach/router";
import { kebabCase } from "./QuizContent";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classnames from "classnames";

export const Bobblehead: React.FC<{
  candidateName: string;
  size: "is-48x48" | "is-96x96" | "is-128x128";
  showBustOnly?: boolean;
}> = ({ candidateName, size, showBustOnly }) => {
  const { pathname } = useLocation();

  // TODO: once we have all illustraitons, remove this randomizaiton of illustration paths:
  const imagePrefix = ["Eric Adams", "Jessica Ramos"].includes(candidateName)
    ? kebabCase(candidateName)
    : candidateName > "M"
    ? "eric-adams"
    : "jessica-ramos";

  console.log(pathname);
  return (
    <figure className={classnames("image", size, showBustOnly && "bust-only")}>
      <LazyLoadImage
        src={`./illustrations/${imagePrefix}-head.png`}
        className={classnames("illustration", "top", imagePrefix)}
        alt={candidateName}
      />
      <LazyLoadImage
        src={`./illustrations/${imagePrefix}-${
          showBustOnly ? "bust" : "body"
        }.png`}
        className={classnames("illustration", "bottom", imagePrefix)}
        alt={candidateName}
      />
    </figure>
  );
};
