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
import { NewsletterSignupBanner } from "./NewsletterSignup";
import { useAppStore } from "../useAppStore";
import { getQuestionsLeftToAnswer } from "./Results";

const CANDIDATE_PAGE_DESCRIPTION =
  "Who should you rank on your ballot to be the next mayor of New York City? Take our quiz to find your closest match.";

const CandidatePage: React.FC<{ pageContext: any }> = ({ pageContext }) => {
  const { candidateName } = pageContext;
  const score = useAppStore((state) => state.score);

  const candidateInfo = formatCandidateContent().find(
    (candidate) => candidate.name === candidateName
  );

  const candidateStats =
    score &&
    score.find((candidate) => candidate.candidateName === candidateName);

  const questionsLeftToAnswer = getQuestionsLeftToAnswer();

  const candidateScore =
    questionsLeftToAnswer.length === 0
      ? !!candidateStats
        ? Math.round(
            (candidateStats.totalScore / candidateStats.totalPossibleScore) *
              100
          )
        : 0
      : null;

  if (!candidateInfo) return <></>;

  const { website, bio, quotes } = candidateInfo;

  return (
    <PageLayout
      customMetadata={{
        shareImageFilename: `composites/${kebabCase(candidateName)}-social.jpg`,
        siteName: `${candidateName} | ${process.env.GATSBY_SITE_NAME}`,
        seoHeadline: `${candidateName}: Meet Your Mayor`,
        socialHeadline: `${candidateName}: Meet Your Mayor`,
        socialDescription: CANDIDATE_PAGE_DESCRIPTION,
        seoDescription: CANDIDATE_PAGE_DESCRIPTION,
      }}
    >
      <div className="container pt-6" style={{ maxWidth: "1100px" }}>
        <div className="eyebrow">
          <Link to="/">
            <div
              className="mr-1"
              style={{
                display: "inline-block",
                transform: "translateY(-2px) rotate(-135deg)",
              }}
            >
              ↗
            </div>
            Meet your mayor
          </Link>
        </div>
        <h1 className="headline has-text-left mt-1">{candidateName}</h1>
        <div className="columns candidate-page-intro">
          <div className="column is-two-fifths-desktop is-half-tablet">
            <figure
              className="image"
              style={{
                // This reduces the flickr affect when the photo is still loading
                // by maintaining a certain height on the container
                minHeight: "325px",
              }}
            >
              <LazyLoadImage
                src={`../photos/${kebabCase(candidateName)}-photo.jpg`}
                effect="blur"
                alt={candidateName}
                style={{
                  maxWidth: "350px",
                  maxHeight: "350px",
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
        {questionsLeftToAnswer.length === 0 && (
          <div className="eyebrow is-align-items-center mb-5">
            Based on your quiz results, you're a <b>{candidateScore}% match</b>
          </div>
        )}
        <div className="field is-grouped">
          <OutboundLink to={website}>
            <button className="button mb-1">Campaign Website</button>
          </OutboundLink>
          <Link to="/">
            <button className="button is-white mb-1">
              {questionsLeftToAnswer.length === 0
                ? `Revisit the quiz`
                : "See if you're a match"}
            </button>
          </Link>
        </div>
        <div className="eyebrow has-text-left mt-5 mb-2 is-flex is-align-items-center">
          <div className="mr-3 is-flex-shrink-2">Share Meet Your Mayor:</div>{" "}
          <SocialShareButtons />
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
                  <div
                    className="eyebrow has-white-background mb-4 px-1 is-inline-flex"
                    style={{ borderRadius: "10%" }}
                  >
                    ON: {subject}
                  </div>
                  <div className="mb-5">
                    <div className="copy">{formatContent(quote)}</div>
                    {source && (
                      <p key={i} className="copy mb-0">
                        {
                          convertToHtml(source.replace("</a>", "</a><br/>")) // Add a line break after each hyperlink
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container pt-5 mb-5" style={{ maxWidth: "600px" }}>
        <h1 className="headline has-text-left mt-6">Election Coverage</h1>
        <RecentCoverage />
        <div className="mt-6">
          <NewsletterSignupBanner />
        </div>
      </div>
    </PageLayout>
  );
};

export default CandidatePage;
