import React, { FC } from "react";
import { StaticImage } from "gatsby-plugin-image";
import classnames from "classnames";
import { formatContent } from "../utils";

type MatchingCandidate = {
  name: string;
  quote: string | null;
  source: string | null;
};

export const MatchingCandidates: FC<{
  candidates: MatchingCandidate[];
  dontShowResponses?: boolean;
}> = ({ candidates, dontShowResponses }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={classnames(
        "is-flex",
        "is-flex-wrap-wrap",
        isExpanded ? "is-flex-direction-column" : "is-flex-direction-row"
      )}
    >
      {candidates.map((candidate, i) => {
        const { name, quote, source } = candidate;
        const firstName = name.split(" ")[0];
        return isExpanded ? (
          <div key={i} className="is-flex is-flex-direction-row mb-4">
            <div className="is-flex is-flex-direction-column is-align-items-center mr-3">
              <figure className="image is-48x48">
                <StaticImage
                  src="../assets/images/sample-bobblehead.png"
                  alt="CandidateBobblehead"
                  placeholder="blurred"
                  layout="constrained"
                />
              </figure>
              <span className="label">{firstName}</span>
            </div>

            <div className="mb-5 mt-4">
              <p className="label">
                {quote ||
                  `${
                    // Candidate's First Name:
                    name.split(" ")[0]
                  } selected this response in our survey to their team.`}
              </p>
              {source && (
                <div className="label mt-1">
                  {formatContent(" - From " + source)}
                </div>
              )}
            </div>
            {i === 0 && (
              <div
                className="eyebrow is-link is-inline-block is-float-right mt-3 ml-3 no-wrap"
                onClick={handleClick}
              >
                Hide -
              </div>
            )}
          </div>
        ) : (
          <div key={i}>
            <div
              key={i}
              className="is-flex is-flex-direction-column is-align-items-center mr-3"
            >
              <figure className="image is-48x48">
                <StaticImage
                  src="../assets/images/sample-bobblehead.png"
                  alt="candidate bobblehead"
                  placeholder="blurred"
                  layout="constrained"
                />
              </figure>
              <span className="label has-text-centered">{firstName}</span>
            </div>
          </div>
        );
      })}
      {!isExpanded && candidates.length > 0 && !dontShowResponses && (
        <span key="x" onClick={handleClick}>
          <div className="mx-2 eyebrow is-link is-inline-block mt-3">
            See <span className="no-wrap">responses +</span>
          </div>
        </span>
      )}
    </div>
  );
};
