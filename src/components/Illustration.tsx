import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classnames from "classnames";
import { kebabCase, useIsCandidatePage } from "../utils";

export const Bobblehead: React.FC<{
  candidateName: string;
  size: "is-48x48" | "is-64x64" | "is-96x96" | "is-128x128" | "is-1by2";
  customClassNames?: string;
  showBustOnly?: boolean;
  loadWithBlurEffect?: boolean;
  startAnimationRightAway?: boolean;
}> = ({
  candidateName,
  size,
  customClassNames,
  showBustOnly,
  loadWithBlurEffect,
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
        src={`${imgPathPrefix}-head.png`}
        className={classnames("illustration", candidatePath)}
        style={{
          animationDelay: animationDelay,
        }}
        wrapperClassName={classnames("image-wrapper", "top")}
        effect={loadWithBlurEffect ? "blur" : undefined}
        visibleByDefault
        alt={candidateName}
      />
      <LazyLoadImage
        src={`${imgPathPrefix}-body.png`}
        className={classnames("illustration", candidatePath)}
        wrapperClassName={classnames("image-wrapper", "bottom")}
        effect={loadWithBlurEffect ? "blur" : undefined}
        visibleByDefault
        alt={candidateName}
      />
      {candidateName === "Jessica Ramos" && (
        <LazyLoadImage
          src={`${imgPathPrefix}-head-back.png`}
          className={classnames("illustration", candidatePath)}
          wrapperClassName={classnames("image-wrapper", "top", "background")}
          style={{
            animationDelay: animationDelay,
          }}
          effect={loadWithBlurEffect ? "blur" : undefined}
          visibleByDefault
          alt={candidateName}
        />
      )}
    </figure>
  );
};
