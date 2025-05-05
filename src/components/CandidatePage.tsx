import React from "react";
import { PageLayout } from "./PageLayout";
import { Link } from "gatsby";
import { OutboundLink } from "./Links";
import { formatCandidateContent } from "./QuizContent";
import { convertToHtml, formatContent, kebabCase } from "../utils";
import { CandidateSelectorMenu } from "./CandidateSelectorMenu";
import { SocialShareButtons } from "./SocialShareButtons";
import { RecentCoverage } from "./RecentCoverage";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useLocation } from "@reach/router";
import { NewsletterSignupBanner } from "./NewsletterSignup";

const splitByFirstComma = (text: string) => {
  let textSplit = text.split(",");
  const firstBit = textSplit.shift();
  return [firstBit, textSplit.join(",")];
};

type LocationState = {
  origin?: string;
};

const CandidatePage: React.FC<{ pageContext: any }> = ({ pageContext }) => {
  const { candidateName } = pageContext;

  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const cameFromResults = state && state.origin === "results";

  const lastName =
    candidateName.split(" ")[candidateName.split(" ").length - 1];
  const candidateInfo = formatCandidateContent().find(
    (candidate) => candidate.name === candidateName
  );

  if (!candidateInfo) return <></>;

  const { website, bio, quotes } = candidateInfo;

  return (
    <PageLayout customMetadata={{ siteName: candidateName }}>
      <div className="container pt-6" style={{ maxWidth: "1100px" }}>
        <div className="eyebrow">
          <Link to={`/${cameFromResults ? "#results" : ""}`}>
            <div
              className="mr-1"
              style={{
                display: "inline-block",
                transform: "translateY(-2px) rotate(-135deg)",
              }}
            >
              ↗
            </div>
            {cameFromResults ? "Back to results" : "Meet your mayor"}
          </Link>
        </div>
        <h1 className="headline has-text-left mt-1">{candidateName}</h1>
        <div className="columns candidate-page-intro">
          <div className="column is-two-fifths-desktop is-half-tablet">
            <figure className="image">
              <LazyLoadImage
                src={`../photos/${kebabCase(candidateName)}-photo.jpg`}
                effect="blur"
                alt={candidateName}
                style={{
                  width: "350px",
                  height: "350px",
                  borderRadius: "100%",
                }}
              />
            </figure>
          </div>
          <div className="column">
            <CandidateSelectorMenu />
          </div>
        </div>
      </div>
      <div className="container pt-6" style={{ maxWidth: "600px" }}>
        <div className="field is-grouped">
          <OutboundLink to={website}>
            <button className="button">{lastName}'s Website</button>
          </OutboundLink>
          <Link to="/">
            <button className="button is-white">See if you're a match</button>
          </Link>
        </div>
        <div className="eyebrow has-text-left mt-5 mb-2 is-flex is-align-items-center">
          <div className="mr-3">Share this tool: </div> <SocialShareButtons />
        </div>

        <div className="copy my-5 py-5">{formatContent(bio)}</div>
      </div>
      <div className="container">
        <div className="columns">
          {quotes.map((quoteInfo, i) => {
            const { subject, quote, source } = quoteInfo;
            return (
              <div className="column" key={i}>
                <div
                  className="container px-6 pt-6 pb-5 has-color-background"
                  style={{
                    height: "100%",
                  }}
                >
                  <div className="tag has-white-background mb-4">
                    <div className="eyebrow">ON: {subject}</div>
                  </div>
                  <div className="mb-5">
                    <div className="copy">{formatContent(quote)}</div>
                    {source && (
                      <span>
                        {splitByFirstComma(source).map((text, i) => (
                          <p key={i} className="copy mb-0">
                            {text && convertToHtml(text)}
                          </p>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container pt-6 mb-6" style={{ maxWidth: "600px" }}>
        <h1 className="headline has-text-left mt-1">Positions on Key Issues</h1>
        <div className="copy my-5">
          THE CITY sent multiple-choice surveys to every mayoral candidate on
          the ballot for the June 22 primary, starting in April. See how Zohran
          Mamdani answered below.
        </div>
        <Link to="/" className="mb-5">
          <button className="button is-link">Take our quiz</button>
        </Link>
        <h1 className="headline has-text-left mt-6">Recent Coverage</h1>
        <RecentCoverage />
        <div className="mt-6">
          <NewsletterSignupBanner />
        </div>
      </div>
    </PageLayout>
  );
};

export default CandidatePage;
