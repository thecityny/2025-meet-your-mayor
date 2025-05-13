import React from "react";
import { PageLayout } from "../components/PageLayout";
import Quiz from "../components/Quiz";
import { CandidateSelectorMenu } from "../components/CandidateSelectorMenu";
import { SocialShareButtons } from "../components/SocialShareButtons";
import { SmoothScroll } from "../components/Links";
import { RecentCoverage } from "../components/RecentCoverage";
import { IntroAnimation } from "../components/IntroAnimation";
import { NewsletterSignupBanner } from "../components/NewsletterSignup";
import { navigate } from "gatsby";
import { getQuestionsLeftToAnswer } from "../components/Results";
import { useAppStore } from "../useAppStore";

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

const Homepage = () => {
  const party = useAppStore((state) => state.party);
  const questionsLeftToAnswer = getQuestionsLeftToAnswer();

  return (
    <PageLayout>
      <div className="hero is-fullheight-with-navbar has-color-background">
        <IntroAnimation isMobile />
        <div className="hero-body pt-6">
          <div className="columns" style={{ width: "100%", height: "80vh" }}>
            <div className="column is-half" />
            <IntroAnimation />
          </div>
        </div>
      </div>
      <NewsletterSignupBanner />
      <Quiz />
      <NewsletterSignupBanner />
      <div className="hero is-fullheight-with-navbar pt-6">
        <div className="container mt-6 pt-5" id="learn">
          <div className="columns">
            <div className="column is-two-thirds">
              <div className="eyebrow">
                <a href="#quiz">
                  <div
                    className="mr-1"
                    style={{
                      display: "inline-block",
                      transform: "translateY(-2px) rotate(-90deg)",
                    }}
                  >
                    ↗
                  </div>
                  Take our quiz
                </a>
              </div>
              <h1
                className="headline has-text-left mt-2"
                style={{ maxWidth: "500px" }}
              >
                About the Candidates
              </h1>
              <CandidateSelectorMenu />
            </div>
            <div className="column">
              <div className="eyebrow is-inline-block"> </div>
              <h1 className="headline has-text-left mt-1">Recent News</h1>
              <RecentCoverage />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Homepage;
