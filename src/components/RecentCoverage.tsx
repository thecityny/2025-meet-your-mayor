import React from "react";
import { OutboundLink } from "./Links";
import { track } from "@amplitude/analytics-browser";

const LINKS_JSON_URL_PREFIX =
  "https://raw.githubusercontent.com/thecityny/mym-recent-coverage/refs/heads/main/";

const GOTHAMIST_DONATION_URL = "https://pledge.wnyc.org/support/gothamist/";

const THE_CITY_DONATION_URL = "https://donorbox.org/nycdonate";

const GOTHAMIST_DEFAULT_LINKS = [
  {
    text: "'12 They’re coming for everyone': Fearful NY immigrant families weigh voluntary departures",
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
    text: "12 City Council Races to Watch in NYC’s June Election",
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

const testValidSetOfLinks = (links: any[]) => {
  if (!Array.isArray(links)) {
    throw new Error("Links is not an array");
  }
  if (links.length !== 3) {
    throw new Error("Links array is not the correct length");
  }
  links.forEach((link) => {
    if (typeof link.text !== "string" && link.text.length > 5) {
      throw new Error("Link text is not a string");
    }
    if (typeof link.href !== "string" && link.href.length > 5) {
      throw new Error("Link href is not a string");
    }
  });
};

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
      .then((json) => {
        testValidSetOfLinks(json);
        return json;
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
      .then((json) => {
        testValidSetOfLinks(json);
        return json;
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
              className="copy has-text-left ml-0"
              style={{ lineHeight: "1.4rem" }}
            >
              {link.text}
            </OutboundLink>
          </li>
        ))}
      </ul>
      <OutboundLink to={THE_CITY_DONATION_URL}>
        <div
          className="button is-white is-small mt-3"
          aria-label="Donate to THE CITY"
          onClick={() => {
            track("Clicked THE CITY Donate button");
          }}
        >
          Donate
        </div>
      </OutboundLink>
      <div className="eyebrow mt-6 mb-2 pt-3">GOTHAMIST</div>
      <ul>
        {gothamistLinks.map((link, i) => (
          <li key={i} className="label is-flex mb-0">
            <div className="mr-2 mt-1">●</div>{" "}
            <OutboundLink
              to={link.href}
              className="copy has-text-left ml-0"
              style={{ lineHeight: "1.4rem" }}
            >
              {link.text}
            </OutboundLink>
          </li>
        ))}
      </ul>
      <OutboundLink to={GOTHAMIST_DONATION_URL}>
        <div
          className="button is-white is-small mt-3"
          aria-label="Donate to Gothamist"
          onClick={() => {
            track("Clicked Gothamist Donate button");
          }}
        >
          Donate
        </div>
      </OutboundLink>
    </>
  );
};
