import React, { useEffect, useMemo } from "react";
import { arrayToNiceList, groupBy, kebabCase, shuffleArray } from "../utils";
import { formatQuestionContent, generateBlankScorecard } from "./QuizContent";
import { SocialShareButtons } from "./SocialShareButtons";
import { SmoothScroll } from "./Links";
import classnames from "classnames";
import { Link } from "gatsby";
import { CircleIcon } from "./Quiz";
import { Bobblehead } from "./Illustration";
import { useAppStore } from "../useAppStore";
import { track } from "@amplitude/analytics-browser";
import { EmailMeMyResults } from "./EmailMeMyResults";

export const getQuestionsLeftToAnswer = () => {
  const favoriteTopics = useAppStore((state) => state.favoriteTopics);
  const answers = useAppStore((state) => state.answers);

  const pickedFavoriteTopics = favoriteTopics.length > 0;

  let remainingQuestions = answers
    .filter((question) => question.answer === null)
    .map((question) => question.questionNumber);

  // If the user hasn't selected their favorite quiz topics, make sure that
  // question number is included in the list of questions left to answer:
  if (!pickedFavoriteTopics) {
    remainingQuestions.push(answers.length + 1);
  }

  return remainingQuestions;
};

/**
 * Maximum number of favorite topics a user can select.
 */
const MAX_FAVORITE_TOPICS = 3;

/**
 * Minimum number of matching candidates we should show users in their quiz results.
 */
const MINIMUM_MATCHES_TO_SHOW = 5;

const Results: React.FC = () => {
  const favoriteTopics = useAppStore((state) => state.favoriteTopics);
  const setFavoriteTopics = useAppStore((state) => state.setFavoriteTopics);

  const answers = useAppStore((state) => state.answers);
  const resetAnswers = useAppStore((state) => state.resetAnswers);

  const party = useAppStore((state) => state.party);

  const setScore = useAppStore((state) => state.setScore);

  const highestVisibleQuestion = useAppStore(
    (state) => state.highestVisibleQuestion
  );

  const showTopicsSelector = highestVisibleQuestion > answers.length;

  const changeFavoriteTopics = (topic: string) => {
    let newArray = favoriteTopics; // Create a copy of the previous Set
    favoriteTopics.includes(topic)
      ? (newArray = favoriteTopics.filter(
          (favoriteTopic) => favoriteTopic !== topic
        ))
      : (newArray = favoriteTopics.concat(topic)); // Add or remove the new element
    setFavoriteTopics(newArray);
  };

  const questionContent = formatQuestionContent();

  const calculateScore = () => {
    let scorecard = generateBlankScorecard();
    let totalPossibleScore = answers.length;

    Object.entries(questionContent).forEach((questionGroup) => {
      const [subject, questions] = questionGroup;

      // If the user has selected this topic as a favorite, set the point value to 2
      // and increase the total possible score by 1 for each question in this group:
      let pointValue = 1;
      if (favoriteTopics.includes(subject)) {
        pointValue = 2;
        totalPossibleScore += questions.length;
      }

      questions.forEach((question) => {
        const { number, option1, option2, option3, option4 } = question;
        const userAnswer = answers.find(
          (answer) => answer.questionNumber === number
        );
        scorecard.forEach((candidate, i) => {
          if (
            userAnswer?.answer === "1" &&
            option1.matchingCandidates.find(
              (c) => c.name === candidate.candidateName
            )
          ) {
            scorecard[i].scoreList.push({
              questionNumber: number,
              subject,
              points: pointValue,
            });
          } else if (
            userAnswer?.answer === "2" &&
            option2.matchingCandidates.find(
              (c) => c.name === candidate.candidateName
            )
          ) {
            scorecard[i].scoreList.push({
              questionNumber: number,
              subject,
              points: pointValue,
            });
          } else if (
            userAnswer?.answer === "3" &&
            option3.matchingCandidates.find(
              (c) => c.name === candidate.candidateName
            )
          ) {
            scorecard[i].scoreList.push({
              questionNumber: number,
              subject,
              points: pointValue,
            });
          } else if (
            userAnswer?.answer === "4" &&
            option4.matchingCandidates.find(
              (c) => c.name === candidate.candidateName
            )
          ) {
            scorecard[i].scoreList.push({
              questionNumber: number,
              subject,
              points: pointValue,
            });
          } else {
            scorecard[i].scoreList.push({
              questionNumber: number,
              subject,
              points: 0,
            });
          }
        });
      });
    });
    scorecard.forEach((candidate) => {
      candidate.totalScore = candidate.scoreList.reduce(
        (total, current) => total + current.points,
        0
      );
      candidate.totalPossibleScore = totalPossibleScore;
    });
    scorecard = shuffleArray(scorecard); // Randomize order of candidates before we sort them
    const scorecardSorted = scorecard.sort((a, b) => {
      return b.totalScore - a.totalScore;
    });

    return scorecardSorted;
  };

  const score = useMemo(() => calculateScore(), [answers, favoriteTopics]);
  let questionsLeftToAnswer = getQuestionsLeftToAnswer();

  useEffect(() => {
    setScore(score);
    if (!!questionsLeftToAnswer && questionsLeftToAnswer.length === 0) {
      score.forEach((candidate, i) => {
        track(`${candidate.candidateName} ranked #${i + 1} in final score`, {
          matchingPercentage: Math.round(
            (candidate.totalScore / candidate.totalPossibleScore) * 100
          ),
        });
      });
    }
  }, [score]);

  const totalPossiblePoints = score[0].totalPossibleScore;

  /**
   * Let's count how many candidates had the same score as the first candidate we're showing,
   * so we can list them all as the most matched candidates:
   */
  let candidatesTiedWithFirstPlace = 0;

  /**
   * Let's count how many candidates had the same score as the last candidate we're showing,
   * just to make sure we don't exclude any candidate that tied that score:
   */
  let candidatesTiedWithLastPlace = 0;
  score.forEach((candidate, i) => {
    if (candidate.totalScore === score[0].totalScore) {
      i > 0 && candidatesTiedWithFirstPlace++;
    }
    if (
      i >= MINIMUM_MATCHES_TO_SHOW &&
      candidate.totalScore === score[MINIMUM_MATCHES_TO_SHOW - 1].totalScore
    ) {
      candidatesTiedWithLastPlace++;
    }
  });

  return (
    <>
      {showTopicsSelector && (
        <div
          className="columns container favorite-topics"
          style={{
            margin: "30vh 0",
          }}
        >
          <div className="column is-one-quarter" />
          <div className="column is-half" style={{ maxWidth: "600px" }}>
            <div
              id={`question-${answers.length + 1}`}
              className="container p-0 mb-5"
              style={{ minHeight: "100vh" }}
            >
              <h2 className="headline has-text-left">
                Now, pick which topics matter most to you
              </h2>
              <h3 className="deck has-text-left">
                <div className="tag question-number-tag">★</div>
                Choose between 1 and {MAX_FAVORITE_TOPICS}. The candidates that
                matched with you on those questions will get extra points toward
                their total score.
              </h3>
              <div className="buttons mt-5">
                {Object.entries(questionContent).map((questionGroup, i) => (
                  <div key={i}>
                    <button
                      className={classnames(
                        "button",
                        "is-white",
                        "mb-2",
                        favoriteTopics.includes(questionGroup[0]) &&
                          "is-selected"
                      )}
                      onClick={() => {
                        track(
                          `${
                            favoriteTopics.includes(questionGroup[0])
                              ? "Removed"
                              : "Selected"
                          } favorite topic: ${questionGroup[0]}`
                        );
                        changeFavoriteTopics(questionGroup[0]);
                      }}
                      disabled={
                        !favoriteTopics.includes(questionGroup[0]) &&
                        favoriteTopics.length >= MAX_FAVORITE_TOPICS
                      }
                    >
                      {favoriteTopics.includes(questionGroup[0]) && (
                        <span className="icon is-small mr-1">✕</span>
                      )}
                      {questionGroup[0]}
                    </button>
                  </div>
                ))}
              </div>
              {favoriteTopics.length > 0 && (
                <div className="question-controls">
                  <SmoothScroll to="results">
                    <button className="button py-5 is-extra-dark see-my-results">
                      <span className="mr-1">★</span>
                      <span>S</span>
                      <span>E</span>
                      <span className="mr-1">E</span>
                      <span>M</span>
                      <span className="mr-1">Y</span>
                      <span>R</span>
                      <span>E</span>
                      <span>S</span>
                      <span>U</span>
                      <span>L</span>
                      <span>T</span>
                      <span className="mr-1">S</span>
                      <span>★</span>
                    </button>
                  </SmoothScroll>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div
        className="container has-color-background p-6 mb-6"
        id="results"
        style={{ maxWidth: "1100px" }}
      >
        {questionsLeftToAnswer.length > 0 ? (
          <div>
            <h1 className="headline has-text-left is-inline-block">Results</h1>
            <p className="copy">
              Oops! You're not finished with the quiz yet. Please go back to{" "}
              <b>
                {questionsLeftToAnswer[0] === 19
                  ? "select your most important topics"
                  : `question ${questionsLeftToAnswer[0]}`}
              </b>
              .
            </p>
            <SmoothScroll to={`question-${questionsLeftToAnswer[0]}`}>
              <button className="button is-white mt-4"> Go back</button>
            </SmoothScroll>
          </div>
        ) : (
          <div>
            <div className="level">
              <h1 className="headline has-text-left is-inline-block mt-5">
                Results
              </h1>
              <div className="field is-grouped is-flex is-align-items-center">
                <div className="eyebrow has-text-left mt-4 mb-2 is-flex is-align-items-center">
                  <div className="mr-3 is-flex-shrink-5">
                    Share my results:{" "}
                  </div>{" "}
                  <SocialShareButtons
                    results={{
                      topCandidate: score[0].candidateName,
                      matchScore: Math.round(
                        (score[0].totalScore / totalPossiblePoints) * 100
                      ),
                    }}
                  />
                </div>

                <EmailMeMyResults
                  topMatches={score.slice(
                    0,
                    MINIMUM_MATCHES_TO_SHOW + candidatesTiedWithLastPlace
                  )}
                />
                <a
                  href="#main"
                  className="is-hidden-tablet mt-4 mb-5"
                  onClick={() => resetAnswers()}
                >
                  <button className="button is-link is-white is-pulled-right mt-0">
                    Take Quiz Again
                  </button>
                </a>
              </div>
            </div>
            <a
              href="#main"
              className="is-hidden-mobile"
              onClick={() => resetAnswers()}
            >
              <button className="button is-link is-white is-pulled-right mt-0 ml-3">
                Take Quiz Again
              </button>
            </a>

            <div className="deck has-text-left ml-0 mt-5">
              You matched most closely with{" "}
              <span className="has-text-weight-semibold">
                {arrayToNiceList(
                  score
                    .slice(0, 1 + candidatesTiedWithFirstPlace)
                    .map((candidate) => candidate.candidateName)
                )}
              </span>
              .{" "}
              {party === "democrat" && (
                <span>
                  In the primary election you may choose up to five candidates,
                  so consider your runner-up matches:
                </span>
              )}
            </div>

            {score
              .slice(0, MINIMUM_MATCHES_TO_SHOW + candidatesTiedWithLastPlace)
              .map((candidate, i) => {
                const scoreBySubject = Object.entries(
                  groupBy(candidate.scoreList, "subject")
                );

                /**
                 * Question groups where the candidate scored a point with the user
                 * on every question in that group.
                 */
                const fullyMatchedSubjects = scoreBySubject.filter(
                  (subject) =>
                    subject[1].filter((question) => question.points > 0)
                      .length === subject[1].length
                );

                /**
                 * Question groups where the candidate scored at least one point
                 * on a question in that group.
                 */
                const partiallyMatchedSubjects = scoreBySubject.filter(
                  (subject) =>
                    subject[1].filter((question) => question.points > 0)
                      .length > 0 &&
                    subject[1].filter((question) => question.points > 0)
                      .length < subject[1].length
                );

                /**
                 * Question groups where the candidate didn't score any point
                 * on a question in that group.
                 */
                const nonMatchedSubjects = scoreBySubject.filter(
                  (subject) =>
                    subject[1].filter((question) => question.points > 0)
                      .length === 0
                );

                const resultsSections = [
                  {
                    title: "You agreed with them fully about...",
                    content: fullyMatchedSubjects,
                  },
                  {
                    title: "You agreed with them partially about...",
                    content: partiallyMatchedSubjects,
                  },
                  {
                    title: "You disagreed with them about...",
                    content: nonMatchedSubjects,
                  },
                ];

                return (
                  <div className="copy has-text-black-bis" key={i}>
                    <hr className="my-6" />
                    <details>
                      <summary
                        className="is-inline-flex is-justify-content-space-between"
                        style={{ width: "100%", cursor: "pointer" }}
                      >
                        <div
                          className="is-flex is-align-items-center"
                          style={{ maxWidth: "100%" }}
                        >
                          <span
                            className="headline"
                            style={{ minWidth: "3rem" }}
                          >
                            <span className="open-text">+</span>
                            <span className="close-text">-</span>
                          </span>
                          <Bobblehead
                            candidateName={candidate.candidateName}
                            size="is-128x128"
                            customClassNames="py-4 mr-4"
                          />
                          <div className="headline has-text-left is-size-3-mobile">
                            <span className="is-link">
                              {candidate.candidateName}
                            </span>{" "}
                            <span className="is-hidden-tablet">
                              <div className="mt-3">
                                {Math.round(
                                  (candidate.totalScore / totalPossiblePoints) *
                                    100
                                )}
                                % Match
                              </div>
                            </span>
                          </div>
                        </div>
                        <div className="is-flex is-align-items-center">
                          <h2 className="headline is-hidden-mobile">
                            {Math.round(
                              (candidate.totalScore / totalPossiblePoints) * 100
                            )}
                            % Match
                          </h2>
                        </div>
                      </summary>
                      <div className="details-content">
                        {resultsSections
                          .filter(
                            (resultsSection) =>
                              resultsSection.content.length > 0
                          )
                          .map((resultsSections, i) => (
                            <div key={i}>
                              <div className="copy mt-4 ml-4">
                                {resultsSections.title}
                              </div>
                              <div className="results-scorecard is-flex is-flex-direction-row is-flex-wrap-wrap ml-4">
                                {resultsSections.content.map(
                                  (questionGroup, i) => (
                                    <div key={i} className="mr-6">
                                      <h3
                                        className={classnames(
                                          favoriteTopics.includes(
                                            questionGroup[0]
                                          ) && "has-text-weight-semibold"
                                        )}
                                      >
                                        {favoriteTopics.includes(
                                          questionGroup[0]
                                        ) && "★"}{" "}
                                        {questionGroup[0]}{" "}
                                      </h3>
                                      <div className="copy">
                                        {questionGroup[1].map((question, i) => (
                                          <span className="mr-2" key={i}>
                                            <CircleIcon
                                              filledIn={question.points > 0}
                                            />
                                          </span>
                                        ))}
                                        {
                                          questionGroup[1].filter(
                                            (q) => q.points > 0
                                          ).length
                                        }
                                        /{questionGroup[1].length}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ))}

                        <div className="buttons mt-5 ml-4">
                          <button className="button">
                            <Link
                              to={kebabCase(candidate.candidateName)}
                              onClick={() =>
                                track(
                                  `Visit ${candidate.candidateName}'s page from results`
                                )
                              }
                            >
                              Learn more about {candidate.candidateName}
                            </Link>{" "}
                          </button>
                        </div>
                      </div>
                    </details>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
};

export default Results;
