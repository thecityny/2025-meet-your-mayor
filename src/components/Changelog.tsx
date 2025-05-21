import React from "react";

/**
 * An array of objects, which include a date in the format like "May 21, 2025",
 * and an array of React fragments that describe changes to the quiz.
 *
 * NOTE: Please use the <OutboundLink> component for hyperlinks.
 */
const CHANGELOG_ENTRIES = [
  {
    date: "May 21, 2025",
    changes: [
      <>
        We added Jim Walden’s survey responses, submitted after Meet Your Mayor
        launched.
      </>,
      <>
        Brad Lander changed his response on the Rikers Island question (#6) and
        added a response on public housing (#8).
      </>,
    ],
  },
];

export const Changelog = () => (
  <div className="my-2">
    {CHANGELOG_ENTRIES.map((entry, i) => (
      <div key={i}>
        {entry.date}
        <ul className="mt-1">
          {entry.changes.map((change, i) => (
            <li className="label is-flex my-0" key={i}>
              <div className="mr-2 mt-1">●</div>{" "}
              <span className="copy has-text-left ml-0 mb-1">{change}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);
