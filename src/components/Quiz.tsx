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

export const NumberLabel: FC<{ number: number }> = ({ number }) => (
  <div
    className="tag is-light"
    style={{
      position: "absolute",
      left: "-20px",
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

const MatchingCandidates: FC<{ candidates: MatchingCandidate[] }> = ({
  candidates,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return isExpanded ? (
    <>
      {candidates.map((candidate, i) => {
        const { name, quote, source } = candidate;
        return (
          <span key={i}>
            <div className="tag mb-2">{name}</div>
            {quote && (
              <div className="mb-5">
                <p className="copy">{quote}</p>
                {source && <span> - From {formatContent(source)}</span>}
              </div>
            )}
          </span>
        );
      })}
      <p className="is-inline-block is-underlined" onClick={handleClick}>
        Hide responses -
      </p>
    </>
  ) : (
    <>
      {candidates.map((candidate, i) => {
        const { name } = candidate;

        return (
          <span key={i}>
            <div className="tag mr-2">{name}</div>
          </span>
        );
      })}
      {candidates.length > 0 && candidates.filter((c) => !!c.quote).length > 0 && (
        <span key="x" onClick={handleClick}>
          <div className="mx-2 is-inline-block is-underlined">
            See responses +
          </div>
        </span>
      )}
    </>
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

            {questionsLeftToAnswer().length === 0 ? (
              <>
                <h2 className="deck has-text-left">
                  You completed the quiz already!
                </h2>

                <div className="field is-grouped">
                  <SmoothScroll to="results" className="control">
                    <button className="button is-link">See my Results</button>
                  </SmoothScroll>
                  <SmoothScroll
                    to="quiz"
                    className="button is-link is-outlined"
                    onClick={() => resetAnswers()}
                  >
                    Reset Answers
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
                      <button className="button is-link">Continue</button>
                    </SmoothScroll>
                    <SmoothScroll
                      to="quiz"
                      className="button is-link is-outlined"
                      onClick={() => resetAnswers()}
                    >
                      Reset Answers
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
                  <SmoothScroll to="questions" className="control">
                    <button
                      className="button is-link"
                      onClick={() => saveParty("Democrat")}
                    >
                      Democrat
                    </button>
                  </SmoothScroll>
                  <SmoothScroll
                    to="questions"
                    onClick={() => saveParty("Independent")}
                    className="control"
                  >
                    <button className="button is-link">All Candidates</button>
                  </SmoothScroll>
                </div>
              </>
            )}
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
                    {questionGroup[1].map((question) => {
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

                      const answerSelected = answers.find(
                        (answer) => answer.questionNumber === number
                      )?.answer;

                      return (
                        <div
                          key={number}
                          id={`question-${number}`}
                          className="mb-5"
                          style={{ minHeight: "100vh" }}
                        >
                          <NumberLabel number={number} />
                          <h3 className="deck has-text-left mb-2">{title}</h3>

                          <details className="mb-5">
                            <summary>Tell me more</summary>
                            {formatContent(tellMeMore)}
                          </details>
                          {[option1, option2, option3, option4].map(
                            (optionInfo, i) =>
                              !!optionInfo.text ? (
                                <div key={i}>
                                  <div style={{ width: "100%" }}>
                                    <button
                                      className={classnames(
                                        "button",
                                        "is-link",
                                        "is-multiline",
                                        "my-4",
                                        !!answerSelected &&
                                          answerSelected !== `${i + 1}` &&
                                          "is-dark"
                                      )}
                                      onClick={() =>
                                        recordAnswer(number, `${i + 1}`)
                                      }
                                      disabled={!!answerSelected}
                                    >
                                      {optionInfo.text}
                                    </button>
                                  </div>
                                  {!!answerSelected && (
                                    <div>
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
                              <div className="mb-6">
                                <MatchingCandidates
                                  candidates={skipped.matchingCandidates}
                                />
                                {skipped.matchingCandidates.length > 0 && (
                                  <p className="is-inline-block mt-6">
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
                                <button
                                  className="button is-link is-outlined"
                                  onClick={() => clearAnswer(number)}
                                >
                                  Change answer
                                </button>
                              </div>
                            </>
                          ) : (
                            <button
                              className="button is-link is-outlined my-5"
                              onClick={() => recordAnswer(number, "0")}
                            >
                              Skip this question.
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
                  maxWidth: "180px",
                }}
              >
                <p className="eyebrow mb-2">SECTIONS:</p>
                {["Streets", "Housing", "Law Enforcement"].map((section, i) => (
                  <SmoothScroll
                    key={i}
                    className="mb-2"
                    to={`section-${section.toLowerCase()}`}
                  >
                    {section}
                  </SmoothScroll>
                ))}{" "}
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
