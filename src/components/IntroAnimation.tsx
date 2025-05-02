import React, { FC } from "react";
import { Bobblehead } from "./Illustration";
import candidateList from "../candidate-list.json";
import { CandidateName } from "../utils";
import classnames from "classnames";

export const IntroAnimation: FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const candidateNames: string[] = JSON.parse(
    JSON.stringify(candidateList)
  ).map((c: CandidateName) => c.name);

  return (
    <div
      className={classnames(
        "intro-animation column is-flex is-flex-direction-row is-half",
        isMobile ? "is-hidden-tablet" : "is-hidden-mobile"
      )}
    >
      <div className="slider">
        {candidateNames.map((name, i) => (
          <Bobblehead
            key={i}
            candidateName={name}
            customClassNames="slide"
            size="is-1by2"
          />
        ))}
      </div>
    </div>
  );
};
