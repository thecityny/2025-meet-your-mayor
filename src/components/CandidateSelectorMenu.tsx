import React from "react";
import { generateListOfCandidates } from "./QuizContent";
import { Link } from "gatsby";
import classnames from "classnames";
import { Bobblehead } from "./Illustration";
import { useIsCandidatePage } from "../utils";

/**
 * A menu of buttons that link to each candidate page.
 */
export const CandidateSelectorMenu: React.FC = () => {
  const candidates = generateListOfCandidates();
  const isCandidatePage = useIsCandidatePage();
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
            <Bobblehead
              candidateName={candidate.name}
              size={isCandidatePage ? "is-96x96" : "is-128x128"}
              showBustOnly={isCandidatePage}
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
