import React from "react";
import { PageLayout } from "./PageLayout";
import { Link } from "gatsby";
import { OutboundLink } from "./Links";
import { formatCandidateContent, kebabCase } from "./QuizContent";
import { convertToHtml, formatContent } from "../utils";
import { CandidateSelectorMenu } from "./CandidateSelectorMenu";
import { SocialShareButtons } from "./SocialShareButtons";
import { RecentCoverage } from "./RecentCoverage";
import { LazyLoadImage } from "react-lazy-load-image-component";

const splitByFirstComma = (text: string) => {
  let textSplit = text.split(",");
  const firstBit = textSplit.shift();
  return [firstBit, textSplit.join(",")];
};

const CandidatePage: React.FC<{ pageContext: any }> = ({ pageContext }) => {
  const { candidateName } = pageContext;
  const firstName = candidateName.split(" ")[0];
  const candidateInfo = formatCandidateContent().find(
    (candidate) => candidate.name === candidateName
  );

  if (!candidateInfo) return <></>;

  const { website, bio, quotes } = candidateInfo;

  return (
    <PageLayout customMetadata={{ siteName: candidateName }}>
      <div className="container pt-6" style={{ maxWidth: "1100px" }}>
        <div className="eyebrow">
          <Link to="/">
            <div
              className="mr-2"
              style={{
                display: "inline-block",
                transform: "rotate(-135deg)",
              }}
            >
              ↗
            </div>
            Meet your mayor
          </Link>
        </div>
        <h1 className="headline has-text-left mt-1">{candidateName}</h1>
        <div className="columns">
          <div className="column">
            <figure className="image">
              <LazyLoadImage
                src={`../photos/${kebabCase(candidateName)}-photo.jpg`}
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
          <OutboundLink to={website} className="control">
            <button className="button is-link">{firstName}'s Website</button>
          </OutboundLink>
          <Link to="/" className="button is-link is-outlined">
            See if you're a match
          </Link>
        </div>
        <div className="eyebrow has-text-left mt-5 mb-2 is-flex is-align-items-center">
          <div className="mr-3">Share this tool: </div> <SocialShareButtons />
        </div>

        <div className="copy my-5 py-5">{formatContent(bio)}</div>
      </div>
      <div className="container">
        <div className="columns  has-text-black">
          {quotes.map((quoteInfo, i) => {
            const { subject, quote, source } = quoteInfo;
            return (
              <div className="column" key={i}>
                <div
                  className="container px-6 pt-6 pb-5 has-background-info"
                  style={{
                    height: "100%",
                  }}
                >
                  <div className="tag is-light mb-4">
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
      <div className="container pt-6" style={{ maxWidth: "600px" }}>
        <h1 className="headline has-text-left mt-1">Positions on Key Issues</h1>
        <div className="copy my-5">
          THE CITY sent three multiple-choice surveys to every Democratic and
          Republican mayoral candidate on the ballot for the June 22 primary,
          starting in March. See how Zohran Mamdani answered below.
        </div>
        <Link to="/" className="button is-link">
          Take our quiz
        </Link>
        <h1 className="headline has-text-left mt-6">Recent Coverage</h1>
        <RecentCoverage />
      </div>
    </PageLayout>
  );
};

export default CandidatePage;
