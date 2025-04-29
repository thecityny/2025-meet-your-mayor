import React from "react";
import { PageLayout } from "../components/PageLayout";
import Quiz from "../components/Quiz";
import { CandidateSelectorMenu } from "../components/CandidateSelectorMenu";
import { SocialShareButtons } from "../components/SocialShareButtons";
import { QUESTION_ANCHOR_LINK_OFFSET, SmoothScroll } from "../components/Links";
import { RecentCoverage } from "../components/RecentCoverage";
import { Bobblehead } from "../components/Illustration";

const byline = process.env.GATSBY_AUTHOR
  ? JSON.parse(process.env.GATSBY_AUTHOR)
  : ([] as any);

const getDateUpdated = () => {
  const timestamp = process.env.GATSBY_UPDATE_DATE;
  if (!timestamp) {
    throw new Error("No publication date defined in .env file!");
  } else {
    const date = new Date(timestamp.replace(/-/g, "/"));
    const dateFormatted = date.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return dateFormatted;
  }
};

const Homepage = () => (
  <PageLayout>
    <div className="hero is-fullheight-with-navbar has-color-background">
      <div className="hero-body">
        <div className="columns" style={{ width: "100%" }}>
          <div className="column is-flex is-flex-direction-row is-half is-hidden-tablet">
            <Bobblehead
              candidateName="Eric Adams"
              size="is-128x128"
              showBustOnly={false}
            />
            <Bobblehead
              candidateName="Jessica Ramos"
              size="is-128x128"
              customClassNames="mt-1"
              showBustOnly={false}
            />
            <Bobblehead
              candidateName="Eric Adams"
              size="is-128x128"
              showBustOnly={false}
            />
          </div>
          <div className="column is-half">
            <h1 className="headline has-text-left mt-0">
              Meet your Mayor: 2025
            </h1>
            <div className="attribution">
              <p className="eyebrow has-text-left mb-2">
                Updated: {getDateUpdated()}
              </p>
              <p className="eyebrow has-text-left mb-0">
                By{" "}
                {byline.map((author: any, i: number) => (
                  <span key={i} className="author">
                    <a href={author.url}>{author.name}</a>
                    {i < byline.length - 2
                      ? ", "
                      : i < byline.length - 1
                      ? " and "
                      : ""}
                  </span>
                ))}
              </p>
              <p className="eyebrow has-text-left mt-0 mb-4">
                In partnership with Gothamist
              </p>
              <p className="deck has-text-left" style={{ maxWidth: "600px" }}>
                Candidates for NYC mayor told us where they stand on 8 big
                issues. Now you can pick your positions and see which contenders
                are the right ones for you.
              </p>
              <div className="is-flex is-flex-direction-column my-6">
                <SmoothScroll
                  to="quiz"
                  extraOffset={QUESTION_ANCHOR_LINK_OFFSET * -1} // Remove offset
                >
                  <button
                    className="button is-extra-dark mb-4"
                    style={{ width: "100%", maxWidth: "350px" }}
                  >
                    Take the quiz
                  </button>
                </SmoothScroll>
                <a href="#learn">
                  <button
                    className="button is-outlined"
                    style={{ width: "100%", maxWidth: "350px" }}
                  >
                    Learn on your own
                  </button>
                </a>
              </div>
              <div className="eyebrow has-text-left mt-4 mb-2 is-flex is-align-items-center">
                <div className="mr-3">Share this tool: </div>{" "}
                <SocialShareButtons />
              </div>
            </div>
          </div>
          <div className="column is-flex is-flex-direction-row is-half is-hidden-touch">
            <Bobblehead
              candidateName="Eric Adams"
              size="is-1by2"
              customClassNames="mb-5"
              showBustOnly={false}
            />
            <Bobblehead
              candidateName="Jessica Ramos"
              customClassNames="mt-5"
              size="is-1by2"
              showBustOnly={false}
            />
          </div>
        </div>
      </div>
    </div>
    <Quiz />
    <div className="hero is-fullheight-with-navbar pt-6">
      <div className="container mt-6" id="learn">
        <div className="columns">
          <div className="column is-two-thirds">
            <h1
              className="headline has-text-left"
              style={{ maxWidth: "500px" }}
            >
              Learn more about the candidates...
            </h1>
            <CandidateSelectorMenu />
          </div>
          <div className="column">
            <h1 className="headline has-text-left">
              ...or read recent news coverage
            </h1>
            <RecentCoverage />
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default Homepage;
