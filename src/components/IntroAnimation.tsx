import React, { FC } from "react";
import { Bobblehead } from "./Illustration";
import candidateList from "../candidate-list.json";
import { CandidateName } from "../utils";

export const IntroAnimation: FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const candidateNames: string[] = JSON.parse(
    JSON.stringify(candidateList)
  ).map((c: CandidateName) => c.name);

  return isMobile ? (
    <div className="intro-animation column is-flex is-flex-direction-row is-half is-hidden-tablet">
      <Bobblehead candidateName="Eric Adams" size="is-128x128" />
      <Bobblehead candidateName="Jessica Ramos" size="is-128x128" />
      <Bobblehead candidateName="Zohran Mamdani" size="is-128x128" />
    </div>
  ) : (
    <div className="intro-animation column is-half is-hidden-touch is-flex is-flex-direction-row">
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
