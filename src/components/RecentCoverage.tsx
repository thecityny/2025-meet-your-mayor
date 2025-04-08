import React from "react";
import { coverageLinksTheCity } from "../coverage-links";
import { OutboundLink } from "./Links";

export const RecentCoverage: React.FC = () => (
  <>
    <div className="mt-3">THE CITY</div>
    <ul>
      {coverageLinksTheCity.map((link, i) => (
        <li key={i} className="is-inline-block mb-1">
          •{" "}
          <OutboundLink to={link.href} className="has-text-left">
            {link.text}
          </OutboundLink>
        </li>
      ))}
    </ul>
    <div className="mt-3">GOTHAMIST</div>
    <ul>
      {coverageLinksTheCity.map((link, i) => (
        <li key={i} className="is-inline-block mb-1">
          •{" "}
          <OutboundLink to={link.href} className="has-text-left">
            {link.text}
          </OutboundLink>
        </li>
      ))}
    </ul>
  </>
);
