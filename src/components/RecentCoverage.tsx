import React from "react";
import { coverageLinksTheCity } from "../coverage-links";
import { OutboundLink } from "./Links";

const GOTHAMIST_DONATION_URL =
  "https://pledge.wnyc.org/support/gothamist/?utm_medium=partnersite&utm_source=the-city&utm_campaign=meet-your-mayor";

const THE_CITY_DONATION_URL =
  "https://donorbox.org/nycdonate?utm_source=button&utm_medium=website&utm_campaign=meet%20your%20mayor%202025";

export const RecentCoverage: React.FC = () => (
  <>
    <div className="eyebrow mb-2 mt-3">THE CITY</div>
    <ul>
      {coverageLinksTheCity.map((link, i) => (
        <li key={i} className="label is-inline-block mb-2">
          ●{" "}
          <OutboundLink
            to={link.href}
            className="copy has-text-left"
            style={{ lineHeight: "1.4rem" }}
          >
            {link.text}
          </OutboundLink>
        </li>
      ))}
    </ul>
    <OutboundLink to={THE_CITY_DONATION_URL}>
      <div className="button is-white is-small mt-3">Donate</div>
    </OutboundLink>
    <div className="eyebrow mt-6 mb-2 pt-3">GOTHAMIST</div>
    <ul>
      {
        // TODO: Replace with actual Gothamist links
        coverageLinksTheCity.map((link, i) => (
          <li key={i} className="label is-inline-block mb-2">
            ●{" "}
            <OutboundLink
              to={link.href}
              className="copy has-text-left"
              style={{ lineHeight: "1.4rem" }}
            >
              {link.text}
            </OutboundLink>
          </li>
        ))
      }
    </ul>
    <OutboundLink to={GOTHAMIST_DONATION_URL}>
      <div className="button is-white is-small mt-3">Donate</div>
    </OutboundLink>
  </>
);
