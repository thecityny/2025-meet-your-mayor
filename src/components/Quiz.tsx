import React, { FC, useEffect } from "react";
import classnames from "classnames";
import Results, { getQuestionsLeftToAnswer } from "./Results";
import { formatContent } from "../utils";
import {
  createBlankAnswersList,
  formatQuestionContent,
  QuizInput,
} from "./QuizContent";
import { QUESTION_ANCHOR_LINK_OFFSET, SmoothScroll } from "./Links";
import { MatchingCandidates } from "./MatchingCandidates";

export type Party = "Democrat" | "Independent" | null;

const CircleIcon: FC<{ filledIn?: boolean }> = ({ filledIn }) => (
  <div
    className="is-inline-block"
    style={{
      width: "12px",
      height: "12px",
      borderRadius: "100%",
      backgroundColor: !!filledIn ? "#111111" : "transparent",
      border: !!filledIn ? "none" : "1px solid #111111",
    }}
  />
);

const Quiz = () => {
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

  const questions = formatQuestionContent(party);

  return (
    <>
      <div className="hero is-fullheight mb-6" id="quiz">
        <div className="hero-body">
          <div className="container" style={{ maxWidth: "600px" }}>
            <div>
              <h1 className="headline has-text-left">
                The Ultimate Match Quiz
              </h1>
              <p className="copy has-text-left mt-5">
                Voters of New York City: It’s time to pick your nominee for
                mayor, with primary day approaching on June 22. Since March, THE
                CITY has been presenting the candidates’ positions, issue by
                issue. Meet Your Mayor shows you how the contenders' stands fit
                with your take on what matters most to New Yorkers.
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
                      <SmoothScroll
                        to="quiz"
                        extraOffset={QUESTION_ANCHOR_LINK_OFFSET * -1} // Remove offset
                        onClick={() => resetAnswers()}
                      >
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
                        <SmoothScroll
                          to="quiz"
                          extraOffset={QUESTION_ANCHOR_LINK_OFFSET * -1} // Remove offset
                          onClick={() => resetAnswers()}
                        >
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
                        <button className="button is-outlined">
                          All Candidates
                        </button>
                      </SmoothScroll>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section p-0" id="questions">
        <div style={{ display: !!party ? "block" : "none" }}>
          <div>
            <div
              className="container is-hidden-desktop has-light-grey-background"
              style={{
                position: "sticky",
                top: 0,
                height: "30px",
                width: "100vw",
                zIndex: "100",
              }}
            >
              <div className="is-flex is-justify-content-center pt-1">
                {Object.entries(formatQuestionContent()).map(
                  (questionGroup, i) => (
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
                  )
                )}
              </div>
            </div>
            <div className="columns is-desktop ml-0">
              <div className="column is-one-quarter" />
              <div className="column is-half" style={{ maxWidth: "600px" }}>
                <div className="container">
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

                        const optionSkipped = {
                          text: "Skip this question",
                          matchingCandidates: skipped.matchingCandidates,
                        };

                        const isFirstQuestionInSection = i === 0;

                        const answerSelected = answers.find(
                          (answer) => answer.questionNumber === number
                        )?.answer;

                        return (
                          <div
                            key={number}
                            id={`question-${number}`}
                            style={{
                              minHeight: "100vh",
                              margin: isFirstQuestionInSection
                                ? "0 0 50vh 0"
                                : "50vh 0",
                            }}
                          >
                            <h3 className="deck has-text-left mb-2">
                              <div className="tag question-number-tag">
                                {number}
                              </div>
                              {title}
                            </h3>

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
                              return !!optionInfo.text ? (
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
                                          ? answerSelected == optionNumber
                                            ? "is-selected"
                                            : "is-disabled"
                                          : "is-active"
                                      )}
                                      onClick={() =>
                                        recordAnswer(number, optionNumber)
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
                                        dontShowResponses={optionNumber === "0"}
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div key={i} />
                              );
                            })}

                            {!!answerSelected && (
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
                                  className="control"
                                  onClick={() => clearAnswer(number)}
                                >
                                  <button className="button is-link is-outlined">
                                    Change answer
                                  </button>
                                </SmoothScroll>
                              </div>
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
                  className="has-light-grey-background is-flex is-flex-direction-column has-text-right p-3"
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
                          className="button-link mr-1 copy"
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
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <Results
            favoriteTopics={favoriteTopics}
            changeFavoriteTopics={changeFavoriteTopics}
            answers={answers}
            resetAnswers={resetAnswers}
            party={party}
          />
        </div>
      </div>
    </>
  );
};

export default Quiz;
