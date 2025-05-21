import React from "react";

const CHANGELOG_ENTRIES = [
  "In March, we sent each of the campaigns a multiple-choice survey",
  "TKTKTKTKT",
];

export const Changelog = () => (
  <div className="mt-2">
    <ul>
      {CHANGELOG_ENTRIES.map((change, i) => (
        <li className="label is-flex my-0" key={i}>
          <div className="mr-2 mt-1">●</div>{" "}
          <span className="copy has-text-left ml-0 mb-1">{change}</span>
        </li>
      ))}
    </ul>
  </div>
);
