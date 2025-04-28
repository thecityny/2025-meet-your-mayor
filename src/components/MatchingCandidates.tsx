import React, { FC } from "react";
import classnames from "classnames";
import { formatContent } from "../utils";
import { Bobblehead } from "./Illustration";

type MatchingCandidate = {
  name: string;
  quote: string | null;
  source: string | null;
};

/**
 *
 * This component shows the set of matching candidates
 * that selected a particular response to a quiz question.
 *
 * It has two states, compact (where it just shows the candidates' icons
 * in a list), or expanded, where it shows each candidate's specific
 * reply to the quiz survey, explaining their response.
 *
 */
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
        const lastName = name.split(" ")[name.split(" ").length - 1];
        // Add first initial to each "Adams" candidate name label:
        const abbreviatedName =
          lastName === "Adams" ? `${name[0]}. ${lastName}` : lastName;
        return isExpanded ? (
          <div key={i} className="is-flex is-flex-direction-row mb-4">
            <div className="is-flex is-flex-direction-column is-align-items-center mr-3">
              <Bobblehead candidateName={name} size="is-48x48" />
              <span className="label">{abbreviatedName}</span>
            </div>

            <div className="mb-5 mt-4">
              <p className="label">
                {quote || (
                  <span>
                    {abbreviatedName} selected this response <br />
                    in our survey to their team.
                  </span>
                )}
              </p>
              {source && (
                <div className="label mt-1">
                  {formatContent(" - From " + source)}
                </div>
              )}
            </div>
            {i === 0 && (
              <div
                className="eyebrow is-link is-inline-block is-float-right mt-3 ml-5 no-wrap"
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
              <Bobblehead candidateName={name} size="is-48x48" />
              <span className="label has-text-centered">{abbreviatedName}</span>
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
