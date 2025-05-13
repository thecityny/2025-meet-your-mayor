import React from "react";
import { generateListOfCandidatesByParty } from "./QuizContent";
import { Link } from "gatsby";
import classnames from "classnames";
import { Bobblehead } from "./Illustration";
import { useIsCandidatePage } from "../utils";
import { track } from "@amplitude/analytics-browser";

/**
 * A menu of buttons that link to each candidate page.
 */
export const CandidateSelectorMenu: React.FC = () => {
  const candidates = generateListOfCandidatesByParty(); // All Candidates
  const isCandidatePage = useIsCandidatePage();
  return (
    <div
      className={classnames(
        "candidate-selector-menu",
        "columns",
        "is-multiline",
        "is-mobile",
        isCandidatePage ? "is-on-candidate-page" : "is-on-home-page"
      )}
    >
      {candidates.map((candidate, i) => (
        <Link
          key={i}
          to={`/${candidate.slug}`}
          onClick={() =>
            track(
              `Visit ${candidate.name}'s page from ${
                isCandidatePage
                  ? "another candidate page"
                  : "bottom of main page"
              }`
            )
          }
          className="column is-one-quarter"
          activeClassName="is-active"
        >
          <div className="is-flex is-flex-direction-column is-align-items-center">
            <Bobblehead
              candidateName={candidate.name}
              size={isCandidatePage ? "is-64x64" : "is-96x96"}
              showBustOnly
              startAnimationRightAway
            />

            <div
              className={classnames(
                isCandidatePage ? "label" : "copy",
                "has-text-centered",
                "mt-2"
              )}
              style={{
                lineHeight: "1rem",
              }}
            >
              {candidate.name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
