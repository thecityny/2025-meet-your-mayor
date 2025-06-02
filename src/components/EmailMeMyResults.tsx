import React, { useState, FormEvent, ChangeEvent } from "react";
import { RequestStatus } from "./NewsletterSignup";
import { ScoreCard } from "./QuizContent";

export const EmailMeMyResults: React.FC<{ topMatches: ScoreCard }> = ({
  topMatches,
}) => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<RequestStatus>("idle");

  const topMatchesFormatted = topMatches
    .map(
      (match, i) =>
        `${i + 1}. ${match.candidateName} (${Math.round(
          (match.totalScore / match.totalPossibleScore) * 100
        )}% match)`
    )
    .join("\n");

  /**
   * Sign up for THE CITY's Ranked Choices newsletter via Netlify email proxy
   */
  const submitTheCity = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
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
            quizResults: topMatchesFormatted,
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
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus("loading");
    submitTheCity(e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="is-flex is-justify-content-center"
      >
        <div className="field">
          <div className="is-flex is-align-items-center">
            <div className="control mr-3 is-flex-grow-1">
              <input
                className="input is-small"
                type="email"
                aria-label="Input an email to send your results to"
                placeholder="Email them to me"
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
                {status === "loading" ? (
                  <>
                    Sending
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                  </>
                ) : (
                  <>Send</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      {status === "success" ? (
        <p className="label mt-2 has-text-centered">
          Results sent to your email!
        </p>
      ) : status === "error" ? (
        <p className="label mt-2 has-text-centered">
          Something went wrong. Please try again later.
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};
