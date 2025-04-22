import React, { FC, useEffect } from "react";
import classnames from "classnames";
import Results, { getQuestionsLeftToAnswer } from "./Results";
import { formatContent } from "../utils";
import {
  createBlankAnswersList,
  formatQuestionContent,
  QuizInput,
} from "./QuizContent";
import { SmoothScroll } from "./Links";
import { StaticImage } from "gatsby-plugin-image";

export const NumberLabel: FC<{ number: number }> = ({ number }) => (
  <div
    className="tag is-light"
    style={{
      position: "absolute",
      marginLeft: "-35px",
      marginTop: "2px",
      borderRadius: "100%",
    }}
  >
    {number}
  </div>
);

type MatchingCandidate = {
  name: string;
  quote: string | null;
  source: string | null;
};

const MatchingCandidates: FC<{
  candidates: MatchingCandidate[];
  dontShowResponses?: boolean;
}> = ({ candidates, dontShowResponses }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={classnames(
        "is-flex",
        isExpanded ? "is-flex-direction-column" : "is-flex-direction-row"
      )}
    >
      {candidates.map((candidate, i) => {
        const { name, quote, source } = candidate;
        const firstName = name.split(" ")[0];
        return isExpanded ? (
          <div key={i} className="is-flex is-flex-direction-row mb-4">
            <div className="is-flex is-flex-direction-column is-align-items-center mr-3">
              <figure className="image is-48x48">
                <StaticImage
                  src="../assets/images/sample-bobblehead.png"
                  alt="CandidateBobblehead"
                  placeholder="blurred"
                  layout="constrained"
                />
              </figure>
              <span className="label">{firstName}</span>
            </div>

            <div className="mb-5 mt-4">
              <p className="label">
                {quote ||
                  `${
                    // Candidate's First Name:
                    name.split(" ")[0]
                  } selected this response in our survey to their team.`}
              </p>
              {source && (
                <div className="label mt-1">
                  {formatContent(" - From " + source)}
                </div>
              )}
            </div>
            {i === 0 && (
              <div
                className="eyebrow is-link is-inline-block is-float-right mt-3 ml-3 no-wrap"
                onClick={handleClick}
              >
                Hide -
              </div>
            )}
          </div>
        ) : (
          <div key={i}>
            <div
              key={i}
              className="is-flex is-flex-direction-column is-align-items-center mr-3"
            >
              <figure className="image is-48x48">
                <StaticImage
                  src="../assets/images/sample-bobblehead.png"
                  alt="candidate bobblehead"
                  placeholder="blurred"
                  layout="constrained"
                />
              </figure>
              <span className="label has-text-centered">{firstName}</span>
            </div>
          </div>
        );
      })}
      {!isExpanded && candidates.length > 0 && !dontShowResponses && (
        <span key="x" onClick={handleClick}>
          <div className="mx-2 eyebrow is-link is-inline-block mt-3">
            See <span className="no-wrap">responses +</span>
          </div>
        </span>
      )}
    </div>
  );
};

type Party = "Democrat" | "Independent" | null;

const Quiz = () => {
  const questions = formatQuestionContent();
  const [party, setParty] = React.useState<Party>(null);
  const [answers, setAnswers] = React.useState(createBlankAnswersList());
  const [favoriteTopics, setFavoriteTopics] = React.useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const savedParty = localStorage.getItem(`party`);
    saveParty(savedParty as Party);

    const userAnswers = localStorage.getItem(`userAnswers`);
    if (!!userAnswers) {
      const recordedAnswers = JSON.parse(userAnswers) as QuizInput[];
      setAnswers(recordedAnswers);
    }

    const savedFavoriteTopics = localStorage.getItem(`favoriteTopics`);
    setFavoriteTopics(new Set(JSON.parse(savedFavoriteTopics || "[]")));
  }, []);

  const saveParty = (party: Party) => {
    setParty(party);
    localStorage.setItem(`party`, party || "");
  };

  const recordAnswer = (questionNumber: number, answer: string | null) => {
    const updatedAnswers = answers.map((answerObj) => {
      if (answerObj.questionNumber === questionNumber) {
        return { ...answerObj, answer };
      }
      return answerObj;
    });
    setAnswers(updatedAnswers);
    localStorage.setItem(`userAnswers`, `${JSON.stringify(updatedAnswers)}`);
  };

  const clearAnswer = (questionNumber: number) =>
    recordAnswer(questionNumber, null);

  const changeFavoriteTopics = (topic: string) =>
    setFavoriteTopics((prevSet) => {
      let newSet = new Set(prevSet); // Create a copy of the previous Set
      prevSet.has(topic) ? newSet.delete(topic) : newSet.add(topic); // Add or remove the new element
      localStorage.setItem(
        `favoriteTopics`,
        JSON.stringify(Array.from(newSet))
      );
      return newSet; // Return the updated Set
    });

  const resetAnswers = () => {
    setAnswers(createBlankAnswersList());
    localStorage.setItem(`userAnswers`, "");
    setFavoriteTopics(new Set());
    localStorage.setItem(`favoriteTopics`, "");
    saveParty(null);
  };

  const questionsLeftToAnswer = () =>
    getQuestionsLeftToAnswer(answers, favoriteTopics.size > 0);

  return (
    <>
      <div className="hero is-fullheight-with-navbar" id="quiz">
        <div className="container" style={{ maxWidth: "600px" }}>
          <div>
            <h1 className="headline has-text-left">The Ultimate Match Quiz</h1>
            <p className="copy has-text-left mt-5">
              Voters of New York City: It’s time to pick your nominee for mayor,
              with primary day approaching on June 22. Since March, THE CITY has
              been presenting the candidates’ positions, issue by issue. Meet
              Your Mayor shows you how the contenders' stands fit with your take
              on what matters most to New Yorkers.
            </p>
            <p className="copy has-text-left my-5">
              Now we’ve pulled all 15 Meet Your Mayor editions into one final,
              supersized superquiz that will show you your ultimate match.
              Actually, your top matches, since voters will be ranking up to
              five selections at the polls.
            </p>

            <div className="pt-5">
              {questionsLeftToAnswer().length === 0 ? (
                <>
                  <h2 className="deck has-text-left">
                    You completed the quiz already!
                  </h2>

                  <div className="field is-grouped">
                    <SmoothScroll to="results" className="control">
                      <button className="button">See my Results</button>
                    </SmoothScroll>
                    <SmoothScroll to="quiz" onClick={() => resetAnswers()}>
                      <button className="button is-outlined">
                        Reset Answers
                      </button>
                    </SmoothScroll>
                  </div>
                </>
              ) : !!party ? (
                <>
                  <>
                    <h2 className="deck has-text-left">
                      You started the quiz already!
                    </h2>

                    <div className="field is-grouped">
                      <SmoothScroll
                        to={`question-${questionsLeftToAnswer()[0]}`}
                        className="control"
                      >
                        <button className="button">Continue</button>
                      </SmoothScroll>
                      <SmoothScroll to="quiz" onClick={() => resetAnswers()}>
                        <button className="button is-outlined">
                          Reset Answers
                        </button>
                      </SmoothScroll>
                    </div>
                  </>
                </>
              ) : (
                <>
                  <h2 className="deck has-text-left">
                    To start, pick your party:
                  </h2>

                  <div className="field is-grouped">
                    <SmoothScroll
                      to="questions"
                      className="control"
                      onClick={() => saveParty("Democrat")}
                      extraOffset={80}
                    >
                      <button className="button">Democrat</button>
                    </SmoothScroll>
                    <SmoothScroll
                      to="questions"
                      onClick={() => saveParty("Independent")}
                      extraOffset={80}
                      className="control"
                    >
                      <button className="button">All Candidates</button>
                    </SmoothScroll>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="section" id="questions">
        <div style={{ display: !!party ? "block" : "none" }}>
          <div className="columns">
            <div className="column is-one-quarter" />
            <div className="column is-half" style={{ maxWidth: "600px" }}>
              <div>
                {Object.entries(questions).map((questionGroup, i) => (
                  <div
                    key={i}
                    className="py-5"
                    id={`section-${questionGroup[0].toLowerCase()}`}
                  >
                    <h2 className="headline has-text-left">
                      {questionGroup[0]}
                    </h2>
                    {questionGroup[1].map((question, i) => {
                      const {
                        number,
                        title,
                        tellMeMore,
                        option1,
                        option2,
                        option3,
                        option4,
                        skipped,
                      } = question;

                      const isFirstQuestionInSection = i === 0;

                      const answerSelected = answers.find(
                        (answer) => answer.questionNumber === number
                      )?.answer;

                      return (
                        <div
                          key={number}
                          id={`question-${number}`}
                          className="mb-5"
                          style={{
                            minHeight: "100vh",
                            margin: isFirstQuestionInSection
                              ? "0 0 50vh 0"
                              : "50vh 0",
                          }}
                        >
                          <h3 className="deck has-text-left mb-2">
                            <NumberLabel number={number} />
                            {title}
                          </h3>

                          <details className="mb-5">
                            <summary className="eyebrow is-link">
                              Tell me <span className="open-text">more +</span>
                              <span className="close-text">less -</span>
                            </summary>
                            <div className="copy">
                              {formatContent(tellMeMore)}
                            </div>
                          </details>
                          {[option1, option2, option3, option4].map(
                            (optionInfo, i) =>
                              !!optionInfo.text ? (
                                <div key={i}>
                                  <div style={{ width: "100%" }}>
                                    <button
                                      className={classnames(
                                        "quiz-selection-button",
                                        "is-flex",
                                        "is-flex-direction-row",
                                        "is-align-items-start",
                                        "has-text-left",
                                        "my-4",
                                        !!answerSelected
                                          ? answerSelected == `${i + 1}`
                                            ? "is-selected"
                                            : "is-disabled"
                                          : "is-active"
                                      )}
                                      onClick={() =>
                                        recordAnswer(number, `${i + 1}`)
                                      }
                                      disabled={!!answerSelected}
                                    >
                                      <div className="quiz-selection-oval mr-4" />
                                      <div className="copy">
                                        {optionInfo.text}
                                      </div>
                                    </button>
                                  </div>
                                  {!!answerSelected && (
                                    <div
                                      className={classnames(
                                        "matching-candidates mb-6",
                                        answerSelected == `${i + 1}`
                                          ? "is-selected"
                                          : "is-disabled"
                                      )}
                                    >
                                      <MatchingCandidates
                                        candidates={
                                          optionInfo.matchingCandidates
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div key={i} />
                              )
                          )}

                          {!!answerSelected ? (
                            <>
                              <div
                                className={classnames(
                                  "mt-6",
                                  "matching-candidates",
                                  answerSelected == "0"
                                    ? "is-selected"
                                    : "is-disabled"
                                )}
                              >
                                <MatchingCandidates
                                  candidates={skipped.matchingCandidates}
                                  dontShowResponses
                                />
                                {skipped.matchingCandidates.length > 0 && (
                                  <p className="copy is-inline-block mb-6">
                                    didn't respond to this question
                                  </p>
                                )}
                              </div>
                              <div className="field is-grouped">
                                <SmoothScroll
                                  to={`question-${number + 1}`}
                                  className="control"
                                >
                                  <button className="button is-link">
                                    Next Question
                                  </button>
                                </SmoothScroll>
                                <SmoothScroll
                                  to={`question-${number}`}
                                  className="button is-link is-outlined"
                                  onClick={() => clearAnswer(number)}
                                >
                                  Change answer
                                </SmoothScroll>
                              </div>
                            </>
                          ) : (
                            <button
                              className="quiz-selection-button is-active is-flex is-flex-direction-row is-align-items-start has-text-left my-4"
                              onClick={() => recordAnswer(number, "0")}
                            >
                              <div className="quiz-selection-oval mr-4" />
                              <div className="copy">Skip this question.</div>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="column is-hidden-touch is-one-quarter">
              <div
                className="is-hidden-touch has-background-white-ter is-flex is-flex-direction-column has-text-right p-3"
                style={{
                  position: "sticky",
                  top: "6rem",
                  left: "100vw",
                  marginBottom: "60vh", // To avoid overlap with the next section
                  maxWidth: "235px",
                }}
              >
                <p className="has-text-left eyebrow mb-2">SECTIONS:</p>
                {Object.entries(formatQuestionContent()).map(
                  (questionGroup, i) => (
                    <div className="has-text-left" key={i}>
                      <SmoothScroll
                        key={i}
                        enableActiveClass
                        className="button-link mr-1"
                        to={`section-${questionGroup[0].toLowerCase()}`}
                      >
                        {questionGroup[0]}
                      </SmoothScroll>
                      {questionGroup[1].map((question, i) => {
                        const questionAnswered = answers.find(
                          (answer) => answer.questionNumber === question.number
                        )?.answer;
                        return (
                          <span
                            key={i}
                            style={{
                              marginRight: "1px",
                            }}
                          >
                            {!!questionAnswered ? (
                              <div
                                className="is-inline-block"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "100%",
                                  backgroundColor: "#111111",
                                }}
                              />
                            ) : (
                              <div
                                className="is-inline-block"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "100%",
                                  border: "1px solid #111111",
                                }}
                              />
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <Results
            favoriteTopics={favoriteTopics}
            changeFavoriteTopics={changeFavoriteTopics}
            answers={answers}
            resetAnswers={resetAnswers}
          />
        </div>
      </div>
    </>
  );
};

export default Quiz;
