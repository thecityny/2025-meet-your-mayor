import React from "react";
import { generateListOfCandidates } from "./QuizContent";
import { Link } from "gatsby";
import classnames from "classnames";
import { StaticImage } from "gatsby-plugin-image";

export const CandidateSelectorMenu: React.FC<{
  isOnHomepage?: boolean;
}> = ({ isOnHomepage }) => {
  const candidates = generateListOfCandidates();
  return (
    <div className="candidate-selector-menu columns is-multiline is-mobile">
      {candidates.map((candidate, i) => (
        <Link
          key={i}
          to={`/${candidate.slug}`}
          className="column is-one-quarter"
          activeClassName="is-active"
        >
          <div className="is-flex is-flex-direction-column is-align-items-center">
            <figure
              className={classnames(
                "image",
                isOnHomepage ? "is-128x128" : "is-96x96"
              )}
            >
              <StaticImage
                src="../assets/images/sample-bobblehead.png"
                alt="CandidateBobblehead"
                placeholder="blurred"
                layout="constrained"
              />
            </figure>
            <div
              className={classnames(
                "has-text-centered",
                "mt-2",
                !isOnHomepage && "is-size-7"
              )}
            >
              {candidate.name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
