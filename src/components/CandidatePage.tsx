import React from "react";
import { PageLayout } from "./PageLayout";
import { Link } from "gatsby";
import { OutboundLink } from "./OutboundLink";
import { formatCandidateContent } from "./QuizContent";
import { convertToHtml, formatContent } from "../utils";
import { CandidateSelectorMenu } from "./CandidateSelectorMenu";
import { SocialShareButtons } from "./SocialShareButtons";

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
        <Link to="/" className="byline is-underlined">
          Meet your mayor
        </Link>
        <h1 className="headline has-text-left mt-1">{candidateName}</h1>
        <div className="columns">
          <div className="column">
            <div
              style={{
                width: "350px",
                height: "350px",
                borderRadius: "100%",
                backgroundColor: "#BBBBBB",
              }}
            ></div>{" "}
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
        <p className="byline has-text-left mt-4 mb-2">Share this page</p>
        <SocialShareButtons />
        <div className="my-5 py-5">{formatContent(bio)}</div>
      </div>
      <div className="columns has-background-info has-text-black">
        {quotes.map((quoteInfo, i) => {
          const { subject, quote, source } = quoteInfo;
          return (
            <div className="column" key={i}>
              <div className="container px-6 pt-6 pb-5">
                <div className="mb-2">ON: {subject}</div>
                <div className="mb-5">
                  <p className="copy">{formatContent(quote)}</p>
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
      </div>
    </PageLayout>
  );
};

export default CandidatePage;
