import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classnames from "classnames";
import { kebabCase, useIsCandidatePage } from "../utils";

export const Bobblehead: React.FC<{
  candidateName: string;
  size: "is-48x48" | "is-64x64" | "is-96x96" | "is-128x128" | "is-1by2";
  customClassNames?: string;
  showBustOnly?: boolean;
  startAnimationRightAway?: boolean;
}> = ({
  candidateName,
  size,
  customClassNames,
  showBustOnly,
  startAnimationRightAway,
}) => {
  const isCandidatePage = useIsCandidatePage();

  const candidatePath = kebabCase(candidateName);

  const imgPathPrefix = `${
    isCandidatePage ? ".." : "."
  }/illustrations/${candidatePath}`;

  const animationDelay = startAnimationRightAway
    ? "0s"
    : `${Math.random() * 0.5}s`;

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
        src={`${imgPathPrefix}-head.svg`}
        className={classnames("illustration", "top", candidatePath)}
        style={{
          animationDelay: animationDelay,
        }}
        effect="blur"
        alt={candidateName}
      />
      <LazyLoadImage
        src={`${imgPathPrefix}-body.svg`}
        className={classnames("illustration", "bottom", candidatePath)}
        effect="blur"
        alt={candidateName}
      />
      {candidateName === "Jessica Ramos" && (
        <LazyLoadImage
          src={`${imgPathPrefix}-head-back.svg`}
          className={classnames(
            "illustration",
            "top",
            "background",
            candidatePath
          )}
          style={{
            animationDelay: animationDelay,
          }}
          effect="blur"
          alt={candidateName}
        />
      )}
    </figure>
  );
};
