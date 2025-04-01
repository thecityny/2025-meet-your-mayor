import React from "react";
import { generateListOfCandidates } from "./QuizContent";
import { Link } from "gatsby";

export const CandidateSelectorMenu = () => {
  const candidates = generateListOfCandidates();
  return (
    <div className="columns">
      {candidates.map((candidate) => (
        <Link to={`/${candidate.slug}`} className="column">
          <div className="is-flex is-flex-direction-column is-align-items-center">
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "100%",
                backgroundColor: "#BBBBBB",
              }}
            ></div>
            <div className="has-text-centered mt-2">{candidate.name}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};
