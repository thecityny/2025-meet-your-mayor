import React from "react";
import { generateListOfCandidates } from "./QuizContent";
import { Link } from "gatsby";
import classnames from "classnames";

export const CandidateSelectorMenu: React.FC<{ isBig?: boolean }> = ({
  isBig,
}) => {
  const candidates = generateListOfCandidates();
  return (
    <div className="columns is-multiline is-mobile">
      {candidates.map((candidate, i) => (
        <Link
          key={i}
          to={`/${candidate.slug}`}
          className="column is-one-quarter"
          activeClassName="has-background-light"
        >
          <div className="is-flex is-flex-direction-column is-align-items-center">
            <div
              style={{
                width: `${isBig ? "150" : "100"}px`,
                height: `${isBig ? "150" : "100"}px`,
                borderRadius: "100%",
                backgroundColor: "#BBBBBB",
              }}
            ></div>
            <div
              className={classnames(
                "has-text-centered",
                "mt-2",
                !isBig && "is-size-7"
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
