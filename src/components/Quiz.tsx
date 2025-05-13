import React, { FC, useState } from "react";
import classnames from "classnames";
import Results, { getQuestionsLeftToAnswer } from "./Results";
import { formatContent, smoothScrollToCenter } from "../utils";
import {
  formatQuestionContent,
  generateListOfCandidatesByParty,
} from "./QuizContent";
import {
  ANCHOR_LINK_DURATION,
  QUESTION_ANCHOR_LINK_OFFSET,
  SmoothScroll,
} from "./Links";
import { abbreviateName, MatchingCandidates } from "./MatchingCandidates";
import { Bobblehead } from "./Illustration";
import { Party, useAppStore } from "../useAppStore";
import { Methodology } from "./Methodology";
import { scroller } from "react-scroll";
import { track } from "@amplitude/analytics-browser";

export const CircleIcon: FC<{ filledIn?: boolean }> = ({ filledIn }) => (
  <div
    className="is-inline-block"
    style={{
      width: "12px",
      height: "12px",
      borderRadius: "100%",
      backgroundColor: !!filledIn ? "#111111" : "transparent",
      boxShadow: !!filledIn ? "none" : "0px 0px 0px 1px #111111 inset",
    }}
  />
);

const Quiz = () => {
  const party = useAppStore((state) => state.party);
  const setParty = useAppStore((state) => state.setParty);

  const answers = useAppStore((state) => state.answers);
  const setAnswers = useAppStore((state) => state.setAnswers);

  const resetAnswers = useAppStore((state) => state.resetAnswers);

  const highestVisibleQuestion = useAppStore(
    (state) => state.highestVisibleQuestion
  );
  const setHighestVisibleQuestion = useAppStore(
    (state) => state.setHighestVisibleQuestion
  );

  const questions = formatQuestionContent();

  const [methodologyVisible, setMethodologyVisible] = useState(false);
  const toggleMethodology = () => {
    const currentVisibility = methodologyVisible;
    setMethodologyVisible(!currentVisibility);
  };

  const democraticCandidates = generateListOfCandidatesByParty("democrat");
  const otherCandidates = generateListOfCandidatesByParty("other");

  type PartySelectorButton = {
    label: string;
    party: Party;
    candidates: { name: string; slug: string }[];
  };

  const partySelectorButtons: PartySelectorButton[] = [
    {
      label: "Democratic Primary",
      party: "democrat",
      candidates: democraticCandidates,
    },
    {
      label: "All Candidates",
      party: "other",
      candidates: otherCandidates,
    },
  ];

  const recordAnswer = (questionNumber: number, answer: string | null) => {
    const updatedAnswers = answers.map((answerObj) => {
      if (answerObj.questionNumber === questionNumber) {
        return { ...answerObj, answer };
      }
      return answerObj;
    });
    setAnswers(updatedAnswers);

    if (highestVisibleQuestion === questionNumber) {
      const prev = highestVisibleQuestion;
      setHighestVisibleQuestion(prev + 1);
    }
  };

  const questionsLeftToAnswer = getQuestionsLeftToAnswer();

  return (
    <>
      <div
        className="hero mb-6"
        id="quiz"
        style={{
          minHeight: "110vh", // Make sure this section stays a consistent height
          // even when the content changes
        }}
      >
        <div className="hero-body">
          <div className="container" style={{ maxWidth: "600px" }}>
            <div>
              <h1 className="headline has-text-left">
                The Meet Your Mayor Quiz
              </h1>
              <p className="copy has-text-left mt-5">
                Voters of New York City: Can’t decide who to put on your ballot
                for mayor? This quiz will help you decide by matching your
                responses to 18 questions with how candidates answered the same
                questions on urgent issues facing New Yorkers. The primary is on
                June 24, and early voting starts on June 14. The general
                election is on November 4, 2025.
              </p>

              <div
                className="pt-3 pb-3"
                style={{
                  minHeight: "500px",
                }}
              >
                {questionsLeftToAnswer.length === 0 ? (
                  <div className="my-4">
                    <h2 className="deck has-text-left">
                      You completed the quiz already!
                    </h2>

                    <div className="field is-grouped">
                      <SmoothScroll to="results" className="control">
                        <button className="button mb-1">See my Results</button>
                      </SmoothScroll>
                      <SmoothScroll to="quiz" onClick={() => resetAnswers()}>
                        <button className="button is-white mb-1">
                          Reset Answers
                        </button>
                      </SmoothScroll>
                    </div>
                  </div>
                ) : !!party ? (
                  <div className="my-4">
                    <>
                      <h2 className="deck has-text-left">
                        You started the quiz already!
                      </h2>

                      <div className="field is-grouped">
                        <SmoothScroll
                          to={`question-${questionsLeftToAnswer[0]}`}
                          className="control"
                        >
                          <button className="button mb-1">Continue</button>
                        </SmoothScroll>
                        <SmoothScroll to="quiz" onClick={() => resetAnswers()}>
                          <button className="button is-white mb-1">
                            Reset Answers
                          </button>
                        </SmoothScroll>
                      </div>
                    </>
                  </div>
                ) : (
                  <>
                    <h2 className="deck has-text-left">Choose a contest:</h2>

                    {partySelectorButtons.map((button, i) => (
                      <div key={i} className="mt-5 mb-4">
                        <button
                          className="control"
                          onClick={() => {
                            setMethodologyVisible(false);

                            setTimeout(() => {
                              scroller.scrollTo("question-1", {
                                duration: ANCHOR_LINK_DURATION,
                                delay: 0,
                                smooth: true,
                                offset: QUESTION_ANCHOR_LINK_OFFSET, // optional, to adjust for headers etc.
                              });
                            }, 100); // wait until content has re-rendered

                            // If the user is selecting a party, we want to scroll to the first question
                            // after a short delay, so that the user doesn't see the content change
                            // inside the quiz intro section

                            setParty(button.party, ANCHOR_LINK_DURATION);
                          }}
                        >
                          <div
                            className="button"
                            onClick={() => setMethodologyVisible(false)}
                          >
                            {button.label}
                          </div>
                          <div className="is-flex is-flex-wrap-wrap is-flex-direction-row is-align-items-center my-3">
                            {button.party === "other" && (
                              <span className="copy is-inline-block m-0 mr-2">
                                Add
                              </span>
                            )}
                            {button.candidates.map((candidate, i) => (
                              <div key={i}>
                                <div
                                  key={i}
                                  className="is-flex is-flex-direction-column is-align-items-center mr-1"
                                >
                                  <Bobblehead
                                    candidateName={candidate.name}
                                    size="is-48x48"
                                    showBustOnly
                                  />
                                  <span className="label has-text-centered">
                                    {abbreviateName(candidate.name)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </button>
                      </div>
                    ))}
                  </>
                )}
                <div className="mb-5">
                  <button
                    key="x"
                    className="eyebrow is-link is-inline-block"
                    onClick={() => toggleMethodology()}
                  >
                    How Meet Your Mayor Works{" "}
                    <span>{methodologyVisible ? "-" : "+"}</span>
                  </button>

                  {methodologyVisible && <Methodology />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section p-0" id="questions">
        {highestVisibleQuestion > 0 && (
          <div>
            <div>
              <div
                className="container is-hidden-desktop has-color-background p-0"
                style={{
                  position: "sticky",
                  top: 0,
                  height: "30px",
                  width: "100vw",
                  zIndex: "100",
                  overflowX: "hidden",
                }}
              >
                <div className="is-flex is-justify-content-center pt-1">
                  {Object.entries(questions).map((questionGroup, i) => (
                    <div key={i} className="is-inline-block">
                      {questionGroup[1].map((question, i) => {
                        const questionAnswered = answers.find(
                          (answer) => answer.questionNumber === question.number
                        )?.answer;
                        return (
                          <span
                            key={i}
                            style={{
                              marginRight: "3px",
                            }}
                          >
                            {!!questionAnswered ? (
                              <CircleIcon filledIn />
                            ) : (
                              <CircleIcon />
                            )}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="columns ml-0">
                <div className="column is-one-quarter" />
                <div className="column is-half" style={{ maxWidth: "600px" }}>
                  <div className="container">
                    {Object.entries(questions).map((questionGroup, i) => (
                      <div
                        key={i}
                        id={`section-${questionGroup[0].toLowerCase()}`}
                      >
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

                          const optionSkipped = {
                            text: "Skip this question",
                            matchingCandidates: skipped.matchingCandidates,
                          };

                          const isFirstQuestionInSection = i === 0;

                          const answerSelected = answers.find(
                            (answer) => answer.questionNumber === number
                          )?.answer;

                          const isQuestionVisible =
                            highestVisibleQuestion >= number;

                          return (
                            <div key={i}>
                              {isFirstQuestionInSection &&
                                isQuestionVisible && (
                                  <h2 className="headline has-text-left pt-5">
                                    {questionGroup[0]}
                                  </h2>
                                )}
                              <div
                                key={number}
                                id={`question-${number}`}
                                style={{
                                  display: isQuestionVisible ? "block" : "none",
                                  minHeight: "100vh",
                                  margin: isFirstQuestionInSection
                                    ? "0 0 30vh 0"
                                    : "30vh 0",
                                }}
                              >
                                <h3 className="deck has-text-left mb-2">
                                  <div className="tag question-number-tag">
                                    {number}
                                  </div>
                                  {title}
                                </h3>

                                {!!tellMeMore && (
                                  <details className="mb-5">
                                    <summary className="eyebrow is-link">
                                      Tell me{" "}
                                      <span className="open-text">more +</span>
                                      <span className="close-text">less -</span>
                                    </summary>
                                    <div className="details-content copy mt-2">
                                      {formatContent(tellMeMore)}
                                    </div>
                                  </details>
                                )}
                                {[
                                  option1,
                                  option2,
                                  option3,
                                  option4,
                                  optionSkipped,
                                ].map((optionInfo, i) => {
                                  const optionNumber =
                                    optionInfo.text === optionSkipped.text
                                      ? "0"
                                      : `${i + 1}`;
                                  /**
                                   * Unique id for smooth scrolling purposes:
                                   */
                                  const optionSlug = `question-${number}-option-${optionNumber}`;
                                  return !!optionInfo.text ? (
                                    <div key={i} id={optionSlug}>
                                      <div style={{ width: "100%" }}>
                                        <button
                                          aria-label={
                                            !!answerSelected
                                              ? `Change answer: ${optionInfo.text}`
                                              : `Select answer: ${optionInfo.text}`
                                          }
                                          className={classnames(
                                            "quiz-selection-button",
                                            "is-flex",
                                            "is-flex-direction-row",
                                            "is-align-items-start",
                                            "has-text-left",
                                            "mt-4",
                                            !!answerSelected
                                              ? answerSelected == optionNumber
                                                ? "is-selected"
                                                : "is-disabled"
                                              : "is-active"
                                          )}
                                          onClick={() => {
                                            recordAnswer(number, optionNumber);
                                            track(
                                              `Question ${number}: ${
                                                !!answerSelected
                                                  ? "changed"
                                                  : "recorded"
                                              } answer`,
                                              {
                                                answer: optionNumber,
                                              }
                                            );
                                            const id =
                                              document.getElementById(
                                                optionSlug
                                              );
                                            if (!!id) {
                                              smoothScrollToCenter(id);
                                            }
                                          }}
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
                                            "matching-candidates",
                                            "mb-5",
                                            `option-number-${optionNumber}`,
                                            answerSelected == optionNumber
                                              ? "is-selected"
                                              : "is-disabled"
                                          )}
                                        >
                                          <MatchingCandidates
                                            candidates={
                                              optionInfo.matchingCandidates
                                            }
                                            isUserSelection={
                                              answerSelected == optionNumber
                                            }
                                            isSkipped={optionNumber === "0"}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div key={i} />
                                  );
                                })}

                                {!!answerSelected && (
                                  <div className="field is-grouped mt-6 question-controls is-flex is-flex-direction-column">
                                    <SmoothScroll
                                      to={`question-${number + 1}`}
                                      className="control"
                                    >
                                      <button
                                        className="button is-link"
                                        style={{
                                          width: "100%",
                                          maxWidth: "350px",
                                        }}
                                      >
                                        Next Question
                                      </button>
                                    </SmoothScroll>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="column is-hidden-touch is-one-quarter">
                  <div
                    className="has-color-background is-flex is-flex-direction-column has-text-right p-3"
                    style={{
                      position: "sticky",
                      top: "6rem",
                      left: "100vw",
                      marginBottom: "60vh", // To avoid overlap with the next section
                      maxWidth: "235px",
                    }}
                  >
                    <p className="has-text-left eyebrow mb-2">PROGRESS:</p>
                    {Object.entries(questions).map((questionGroup, i) => {
                      const questionGroupSeen =
                        questionGroup[1][0].number <= highestVisibleQuestion;

                      return (
                        <div
                          className="has-text-left"
                          key={i}
                          style={{ opacity: questionGroupSeen ? 1 : 0.4 }}
                        >
                          <SmoothScroll
                            key={i}
                            enableActiveClass
                            className="button-link mr-1 copy"
                            style={{
                              pointerEvents: questionGroupSeen ? "all" : "none",
                            }}
                            to={`section-${questionGroup[0].toLowerCase()}`}
                          >
                            {questionGroup[0]}
                          </SmoothScroll>
                          {questionGroup[1].map((question, i) => {
                            const questionAnswered = answers.find(
                              (answer) =>
                                answer.questionNumber === question.number
                            )?.answer;
                            return (
                              <span
                                key={i}
                                style={{
                                  marginRight: "1px",
                                }}
                              >
                                {!!questionAnswered ? (
                                  <CircleIcon filledIn />
                                ) : (
                                  <CircleIcon />
                                )}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <Results />
          </div>
        )}
      </div>
    </>
  );
};

export default Quiz;
