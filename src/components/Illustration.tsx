import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classnames from "classnames";
import { kebabCase, useIsCandidatePage } from "../utils";

export const Bobblehead: React.FC<{
  candidateName: string;
  size: "is-48x48" | "is-64x64" | "is-96x96" | "is-128x128" | "is-1by2";
  customClassNames?: string;
  showBustOnly?: boolean;
}> = ({ candidateName, size, customClassNames, showBustOnly }) => {
  const isCandidatePage = useIsCandidatePage();

  // TODO: once we have all illustraitons, remove this randomizaiton of illustration paths:
  const candidatePath = ["Eric Adams", "Jessica Ramos"].includes(candidateName)
    ? kebabCase(candidateName)
    : candidateName < "M"
    ? "eric-adams"
    : "jessica-ramos";

  const imgPathPrefix = `${
    isCandidatePage ? ".." : "."
  }/illustrations/${candidatePath}`;
  return (
    <figure
      className={classnames(
        "image",
        size,
        showBustOnly && "bust-only",
        customClassNames
      )}
    >
      <LazyLoadImage
        src={`${imgPathPrefix}-head.png`}
        className={classnames("illustration", "top", candidatePath)}
        style={{
          animationDelay: `${Math.random() * 0.5}s`,
        }}
        alt={candidateName}
      />
      <LazyLoadImage
        src={`${imgPathPrefix}-${showBustOnly ? "bust" : "body"}.png`}
        className={classnames("illustration", "bottom", candidatePath)}
        alt={candidateName}
      />
    </figure>
  );
};
