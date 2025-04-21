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

  return isExpanded ? (
    <>
      {candidates.map((candidate, i) => {
        const { name, quote, source } = candidate;
        return (
          <span key={i}>
            <div className="tag mb-2">{name}</div>
            {i === 0 && (
              <div
                className="eyebrow is-link is-inline-block is-float-right"
                onClick={handleClick}
              >
                Hide responses -
              </div>
            )}
            <span></span>
            <div className="mb-5">
              <p>
                {quote ||
                  `${
                    // Candidate's Last Name:
                    name.split(" ")[name.split(" ").length - 1]
                  } selected this response in our survey to their team.`}
              </p>
              {source && (
                <div className="mt-1">{formatContent(" - From " + source)}</div>
              )}
            </div>
          </span>
        );
      })}
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
      {candidates.length > 0 && !dontShowResponses && (
        <span key="x" onClick={handleClick}>
          <div className="mx-2 eyebrow is-link is-inline-block">
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
                              <div className="mt-6">
                                <MatchingCandidates
                                  candidates={skipped.matchingCandidates}
                                  dontShowResponses
                                />
                                {skipped.matchingCandidates.length > 0 && (
                                  <p className="is-inline-block mb-6">
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
                  marginBottom: "60vh", // To avoid overlap with the next section
                  maxWidth: "220px",
                }}
              >
                <p className="has-text-left eyebrow mb-2">SECTIONS:</p>
                {Object.entries(formatQuestionContent()).map(
                  (questionGroup, i) => (
                    <div className="has-text-left" key={i}>
                      <SmoothScroll
                        key={i}
                        enableActiveClass
                        className="m-0 mr-2"
                        to={`section-${questionGroup[0].toLowerCase()}`}
                      >
                        {questionGroup[0]}
                      </SmoothScroll>
                      {questionGroup[1].map((question, i) => {
                        const questionAnswered = answers.find(
                          (answer) => answer.questionNumber === question.number
                        )?.answer;
                        return (
                          <span key={i} className="has-text-weight-bold">
                            {!!questionAnswered ? "☑" : "☐"}
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
