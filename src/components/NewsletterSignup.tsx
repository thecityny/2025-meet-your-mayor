import React, { useState, FormEvent, ChangeEvent } from "react";
import { OutboundLink } from "./Links";
import { useLocation } from "@reach/router";
import classnames from "classnames";

const GOTHAMIST_EMAIL_LIST_NAME =
  "Gothamist Membership++Politics Brief Newsletter";

const THE_CITY_FALLBACK_NEWSLETTER_LINK =
  "https://www.thecity.nyc/newsletter-mayoral-election-2025-eric-adams/";

const GOTHAMIST_FALLBACK_NEWSLETTER_LINK = "https://gothamist.com/newsletters";

export type RequestStatus = "idle" | "loading" | "success" | "error";

export const NewsletterSignupBanner: React.FC<{
  isOnLandingPage?: boolean;
}> = ({ isOnLandingPage }) => {
  const [email, setEmail] = useState<string>("");
  const [statusTheCity, setStatusTheCity] = useState<RequestStatus>("idle");
  const [statusGothamist, setStatusGothamist] = useState<RequestStatus>("idle");

  const location = useLocation();
  /**
   * Let's use the DEMO API from Gothamist if we are in local development or
   * on the staging site:
   */
  const isTestingSite =
    location?.origin?.includes("localhost") ||
    location?.origin?.includes("qa-project.thecity.nyc");
  const gothamistApiUrl = isTestingSite
    ? "https://api.demo.nypr.digital/email-proxy/subscribe"
    : "https://api.prod.nypr.digital/email-proxy/subscribe";

  /**
   * Sign up for THE CITY's Ranked Choices newsletter via Netlify email proxy
   */
  const submitTheCity = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusTheCity("loading");
    try {
      const response = await fetch(
        "https://rankedchoices-proxy.netlify.app/.netlify/functions/subscribe",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      if (response.ok) {
        setStatusTheCity("success");
        setEmail("");
      } else {
        setStatusTheCity("error");
      }
    } catch (error) {
      setStatusTheCity("error");
    }
  };

  /**
   * Sign up for Gothamist's politics newsletter via their custom email proxy
   */
  const submitGothamist = async (e: FormEvent<HTMLFormElement>) => {
    try {
      const response = await fetch(gothamistApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "meet_your_mayor",
          list: GOTHAMIST_EMAIL_LIST_NAME,
          email,
        }),
      });

      if (response.ok) {
        setStatusGothamist("success");
      } else {
        setStatusGothamist("error");
      }
    } catch (error) {
      setStatusGothamist("error");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatusTheCity("loading");
    setStatusGothamist("loading");

    submitTheCity(e);
    submitGothamist(e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div
      className="newsletter-signup"
      style={{ maxWidth: isOnLandingPage ? "350px" : "unset" }}
    >
      <div
        className={classnames("container", "py-4", isOnLandingPage && "px-4")}
      >
        <form
          onSubmit={handleSubmit}
          className={classnames(
            "is-flex",
            !isOnLandingPage && "is-justify-content-center"
          )}
        >
          <div className="field">
            <div
              className={classnames(
                "eyebrow",
                "mb-2",
                !isOnLandingPage && "has-text-centered"
              )}
            >
              Remind me when it's time to vote:
            </div>
            <div
              className={classnames(
                "is-flex",
                !isOnLandingPage && "is-align-items-center"
              )}
            >
              <div className="control mr-3 is-flex-grow-1">
                <input
                  className="input is-small"
                  type="email"
                  aria-label="Input your email for election updates"
                  placeholder="e.g. mayor@nyc.gov"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="control">
                <button
                  className="button is-small is-white mt-1"
                  type="submit"
                  disabled={
                    statusTheCity === "loading" || statusGothamist === "loading"
                  }
                >
                  {statusTheCity === "loading" ||
                  statusGothamist === "loading" ? (
                    <>
                      Submitting
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                    </>
                  ) : (
                    <>Sign Up</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
        {statusTheCity === "success" && statusGothamist === "success" ? (
          <p
            className={classnames(
              "label mt-2",
              !isOnLandingPage && "has-text-centered"
            )}
          >
            You're signed up!
          </p>
        ) : statusTheCity === "success" && statusGothamist === "error" ? (
          <p
            className={classnames(
              "label mt-2",
              !isOnLandingPage && "has-text-centered"
            )}
          >
            You're signed up with THE CITY! Something went wrong with Gothamist.{" "}
            <OutboundLink to={GOTHAMIST_FALLBACK_NEWSLETTER_LINK}>
              Sign up manually
            </OutboundLink>
            .
          </p>
        ) : statusTheCity === "error" && statusGothamist === "success" ? (
          <p
            className={classnames(
              "label mt-2",
              !isOnLandingPage && "has-text-centered"
            )}
          >
            You're signed up with Gothamist! Something went wrong with THE CITY.{" "}
            <OutboundLink to={THE_CITY_FALLBACK_NEWSLETTER_LINK}>
              Sign up manually
            </OutboundLink>
            .
          </p>
        ) : statusTheCity === "error" && statusGothamist === "error" ? (
          <p
            className={classnames(
              "label mt-2",
              !isOnLandingPage && "has-text-centered"
            )}
          >
            Something went wrong. Sign up manually via{" "}
            <OutboundLink to={THE_CITY_FALLBACK_NEWSLETTER_LINK}>
              THE CITY
            </OutboundLink>{" "}
            and{" "}
            <OutboundLink to={GOTHAMIST_FALLBACK_NEWSLETTER_LINK}>
              Gothamist
            </OutboundLink>
            .
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
