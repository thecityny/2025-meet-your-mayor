import React, { FC } from "react";
import { Bobblehead } from "./Illustration";
import candidateList from "../candidate-list.json";
import { CandidateName, shuffleArray } from "../utils";
import classnames from "classnames";

export const IntroAnimation: FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const candidateNames: string[] = JSON.parse(
    JSON.stringify(candidateList)
  ).map((c: CandidateName) => c.name);

  const candidateNamesShuffled = shuffleArray(candidateNames);

  return (
    <div
      className={classnames(
        "column is-flex is-flex-direction-row is-two-thirds",
        isMobile ? "is-hidden-tablet p-0 mt-5" : "is-hidden-mobile"
      )}
    >
      <Bobblehead
        candidateName="Zohran Mamdani"
        customClassNames="slide"
        size="is-1by2"
        loadWithBlurEffect
      />
    </div>
  );
};
