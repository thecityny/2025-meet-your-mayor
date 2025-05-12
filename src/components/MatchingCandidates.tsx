import React, { FC } from "react";
import classnames from "classnames";
import { arrayToNiceList, formatContent } from "../utils";
import { Bobblehead } from "./Illustration";

type MatchingCandidate = {
  name: string;
  quote: string | null;
  source: string | null;
};

export const abbreviateName = (name: string) => {
  const lastName = name.split(" ")[name.split(" ").length - 1];
  // Add first initial to each "Adams" candidate name label:
  return lastName === "Adams" ? `${name[0]}. ${lastName}` : lastName;
};

const ListOfCandidates: FC<{ candidates: MatchingCandidate[] }> = ({
  candidates,
}) => {
  const names = candidates.map((candidate) => abbreviateName(candidate.name));
  return arrayToNiceList(names);
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
  /**
   * Are these the candidates that match with the user's selected response,
   * or another quiz option?
   */
  isUserSelection: boolean;
  /**
   * Is this the "Skip" question option?
   */
  isSkipped: boolean;
}> = ({ candidates, isUserSelection, isSkipped }) => {
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
        const abbreviatedName = abbreviateName(name);

        return isExpanded ? (
          <div
            key={i}
            className="expanded-candidate-responses is-flex is-flex-direction-row mb-4"
          >
            <div className="is-flex is-flex-direction-column is-align-items-center mr-3">
              <Bobblehead candidateName={name} size="is-64x64" showBustOnly />
              <span className="label">{abbreviatedName}</span>
            </div>

            <div className="mb-5 mt-4">
              <p className="label">
                {!!quote ? (
                  quote
                ) : isSkipped ? (
                  <span>
                    {abbreviatedName} skipped this response <br />
                    in our survey.
                  </span>
                ) : (
                  <span>
                    {abbreviatedName} selected this response <br />
                    in our survey.
                  </span>
                )}
              </p>
              {!!source && (
                <div className="label mt-1">
                  {formatContent(" — " + source)}
                </div>
              )}
            </div>
            {i === 0 && (
              <button
                className="eyebrow is-link is-inline-block is-float-right mt-3 ml-5 no-wrap"
                onClick={handleClick}
              >
                Hide -
              </button>
            )}
          </div>
        ) : isUserSelection ? (
          <div key={i}>
            <div
              key={i}
              className="is-flex is-flex-direction-column is-align-items-center mr-3"
            >
              <Bobblehead candidateName={name} size="is-64x64" showBustOnly />
              <span className="label has-text-centered">{abbreviatedName}</span>
            </div>
          </div>
        ) : (
          <div key={i}></div>
        );
      })}

      {!isExpanded && candidates.length > 0 && (
        <div
          className={classnames(
            "mx-2 is-inline-block ",
            isUserSelection ? "mt-3" : "ml-4"
          )}
        >
          {!isUserSelection && (
            <span className="label is-inline-block mr-3">
              <ListOfCandidates candidates={candidates} />
            </span>
          )}
          <button
            key="x"
            className="eyebrow is-link is-inline-block"
            onClick={handleClick}
          >
            See <span className="no-wrap">details +</span>
          </button>
        </div>
      )}

      {candidates.length === 0 && (
        <div
          className={classnames(
            "label has-text-left ml-4",
            isUserSelection && "has-text-weight-semibold"
          )}
        >
          No matching candidates
        </div>
      )}
    </div>
  );
};
