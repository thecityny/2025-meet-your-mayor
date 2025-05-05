import React from "react";
import { OutboundLink } from "./Links";

const GOTHAMIST_DONATION_URL =
  "https://pledge.wnyc.org/support/gothamist/?utm_medium=partnersite&utm_source=the-city&utm_campaign=meet-your-mayor";

const THE_CITY_DONATION_URL =
  "https://donorbox.org/nycdonate?utm_source=button&utm_medium=website&utm_campaign=meet%20your%20mayor%202025";

const LINKS_JSON_URL_PREFIX =
  "https://raw.githubusercontent.com/thecityny/mym-recent-coverage/refs/heads/main/";

const GOTHAMIST_DEFAULT_LINKS = [
  {
    text: "'They’re coming for everyone': Fearful NY immigrant families weigh voluntary departures",
    href: "https://gothamist.com/news/theyre-coming-for-everyone-fearful-ny-immigrant-families-weigh-voluntary-departures",
  },
  {
    text: "Housing could be on the ballot in NYC. Here’s what New Yorkers may be voting on.",
    href: "https://gothamist.com/news/housing-could-be-on-the-ballot-in-nyc-heres-what-new-yorkers-may-be-voting-on",
  },
  {
    text: "NY AG James says she’s suing Trump administration over cuts to health and social programs",
    href: "https://gothamist.com/news/ny-ag-james-says-shes-suing-trump-administration-over-cuts-to-health-and-social-programs",
  },
];

const THE_CITY_DEFAULT_LINKS = [
  {
    text: "11 City Council Races to Watch in NYC’s June Election",
    href: "https://www.thecity.nyc/2025/05/05/11-city-council-races-election-june/",
  },
  {
    text: "Can Voters Game Out Their Ranked Choice Ballot?",
    href: "https://www.thecity.nyc/2025/05/01/ranked-choice-voting-strategy-mayoral-primary-cuomo-working-families/",
  },
  {
    text: "Following THE CITY’s Trail, Campaign Board Escalates Eric Adams Fraud Probe",
    href: "https://www.thecity.nyc/2025/04/30/eric-adams-campaign-finance-funds/",
  },
];

export const RecentCoverage: React.FC = () => {
  const [gothamistLinks, setGothamistLinks] = React.useState(
    GOTHAMIST_DEFAULT_LINKS
  );
  const [theCityLinks, setTheCityLinks] = React.useState(
    THE_CITY_DEFAULT_LINKS
  );

  React.useEffect(() => {
    fetch(`${LINKS_JSON_URL_PREFIX}gothamist-links.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch JSON");
        }
        return response.json();
      })
      .then((json) => setGothamistLinks(json))
      .catch((error) =>
        console.error("Error loading Gothamist Links JSON:", error)
      );
    fetch(`${LINKS_JSON_URL_PREFIX}the-city-links.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch JSON");
        }
        return response.json();
      })
      .then((json) => setTheCityLinks(json))
      .catch((error) =>
        console.error("Error loading THE CITY Links JSON:", error)
      );
  }, []);

  return (
    <>
      <div className="eyebrow mb-2 mt-3">THE CITY</div>
      <ul>
        {theCityLinks.map((link, i) => (
          <li key={i} className="label is-flex mb-0">
            <div className="mr-2 mt-1">●</div>{" "}
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
        {gothamistLinks.map((link, i) => (
          <li key={i} className="label is-flex mb-0">
            <div className="mr-2 mt-1">●</div>{" "}
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
      <OutboundLink to={GOTHAMIST_DONATION_URL}>
        <div className="button is-white is-small mt-3">Donate</div>
      </OutboundLink>
    </>
  );
};
