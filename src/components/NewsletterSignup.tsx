import React, { useState, FormEvent, ChangeEvent } from "react";
import { OutboundLink } from "./Links";

const GOTHAMIST_EMAIL_LIST_NAME =
  "Gothamist Membership++Politics Brief Newsletter";

const THE_CITY_FALLBACK_NEWSLETTER_LINK =
  "https://www.thecity.nyc/newsletter-mayoral-election-2025-eric-adams/";

const GOTHAMIST_FALLBACK_NEWSLETTER_LINK = "https://gothamist.com/newsletters";

export const NewsletterSignupBanner: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // GOTHAMIST EMAIL SIGNUP:
      const response = await fetch(
        "https://api.demo.nypr.digital/email-proxy/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: "meet_your_mayor",
            list: GOTHAMIST_EMAIL_LIST_NAME,
            email,
          }),
        }
      );

      if (response.ok) {
        setStatus("success");

        try {
          // THE CITY EMAIL SIGNUP:
          const response = await fetch(
            "https://rankedchoices.netlify.app/.netlify/functions/subscribe",
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
            setStatus("success");
            setEmail("");
          } else {
            setStatus("error");
          }
        } catch (error) {
          setStatus("error");
        }
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="newsletter-signup">
      <div className="container py-4">
        <form
          onSubmit={handleSubmit}
          className="is-flex is-justify-content-center"
        >
          <div className="field ">
            <div className="eyebrow mb-2 has-text-centered">
              SEND ME ELECTION UPDATES FROM THE CITY AND GOTHAMIST:
            </div>
            <div className="is-flex is-align-items-center">
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
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Submitting..." : "Sign Up"}
                </button>
              </div>
            </div>
          </div>
        </form>
        {status === "success" && (
          <p className="label mt-2 has-text-centered">You're signed up!</p>
        )}
        {status === "error" && (
          <p className="label mt-2 has-text-centered">
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
        )}
      </div>
    </div>
  );
};
