import React, { useEffect } from "react";
import { PageLayout } from "../components/PageLayout";
import Quiz from "../components/Quiz";
import { CandidateSelectorMenu } from "../components/CandidateSelectorMenu";
import { SocialShareButtons } from "../components/SocialShareButtons";
import { QUESTION_ANCHOR_LINK_OFFSET, SmoothScroll } from "../components/Links";
import { RecentCoverage } from "../components/RecentCoverage";
import { IntroAnimation } from "../components/IntroAnimation";
import { NewsletterSignupBanner } from "../components/NewsletterSignup";
import { useLocation } from "@reach/router";
import { navigate } from "gatsby";

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

export type LocationState = {
  origin?: string;
};

const Homepage = () => {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const headedToResults = state && state.origin === "results";

  // Add a special scroll effect if user is headed to results section from
  // a candidate page (to make sure results container has rendered first)
  useEffect(() => {
    if (headedToResults && location.hash) {
      const id = "results";
      const scrollToElement = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // Try again later if not found yet
          setTimeout(scrollToElement, 100);
        }
      };
      setTimeout(scrollToElement, 100);
    }
  }, [location]);

  return (
    <PageLayout>
      <div className="hero is-fullheight-with-navbar has-color-background">
        <IntroAnimation isMobile />
        <div className="hero-body pt-6">
          <div className="columns" style={{ width: "100%" }}>
            <div className="column is-half">
              <h1 className="headline has-text-left mt-0">
                Meet Your Mayor 2025
              </h1>
              <div className="attribution">
                <p className="eyebrow has-text-left mb-2">
                  Updated: {getDateUpdated()}
                </p>
                <p className="deck has-text-left" style={{ maxWidth: "600px" }}>
                  Who should you rank on your ballot to be the next mayor of New
                  York City? Take the same quiz the candidates did and find your
                  closest match.
                </p>
                <div className="is-flex is-flex-direction-column my-6">
                  <SmoothScroll
                    className="mb-5"
                    to="quiz"
                    extraOffset={QUESTION_ANCHOR_LINK_OFFSET * -1} // Remove offset
                  >
                    <button
                      className="button is-extra-dark"
                      style={{ width: "100%", maxWidth: "350px" }}
                    >
                      Take the quiz
                    </button>
                  </SmoothScroll>

                  <button
                    className="button is-white"
                    onClick={() =>
                      // Since we use the #learn container to smooth scroll to the #results
                      // section from a Candidate page, we need to make sure this button here
                      // clears the location state so that it indeed goes to #learn.
                      navigate("#learn", { replace: true })
                    }
                    style={{ width: "100%", maxWidth: "350px" }}
                  >
                    See the candidates{" "}
                  </button>
                </div>
                <div className="eyebrow has-text-left mt-4 mb-2 is-flex is-align-items-center">
                  <div className="mr-3 is-flex-shrink-2">
                    Share Meet Your Mayor:
                  </div>{" "}
                  <SocialShareButtons />
                </div>
              </div>
            </div>
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
