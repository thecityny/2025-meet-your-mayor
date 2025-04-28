import React from "react";
import { groupBy, kebabCase } from "../utils";
import {
  formatQuestionContent,
  generateBlankScorecard,
  QuizInput,
} from "./QuizContent";
import { SocialShareButtons } from "./SocialShareButtons";
import { QUESTION_ANCHOR_LINK_OFFSET, SmoothScroll } from "./Links";
import classnames from "classnames";
import { Link } from "gatsby";
import { Party } from "./Quiz";
import { Bobblehead } from "./Illustration";

type ResultsProps = {
  favoriteTopics: Set<string>;
  changeFavoriteTopics: (topic: string) => void;
  answers: QuizInput[];
  resetAnswers: () => void;
  party?: Party;
};

const calculateScore = (
  answers: QuizInput[],
  favoriteTopics: Set<string>,
  party?: Party
) => {
  let scorecard = generateBlankScorecard();
  const questionContent = formatQuestionContent(party);
  Object.entries(questionContent).forEach((questionGroup) => {
    const [subject, questions] = questionGroup;
    const pointValue = favoriteTopics.has(subject) ? 2 : 1;
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
  });
  return scorecard.sort((a, b) => {
    return b.totalScore - a.totalScore;
  });
};

export const getQuestionsLeftToAnswer = (
  answers: QuizInput[],
  pickedFavoriteTopics: boolean
) => {
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
 * Total matching candidates we should show users in their quiz results.
 */
const MATCHES_TO_SHOW = 5;

const Results: React.FC<ResultsProps> = ({
  answers,
  resetAnswers,
  favoriteTopics,
  changeFavoriteTopics,
  party,
}) => {
  const score = calculateScore(answers, favoriteTopics, party);
  const totalPossiblePoints = answers.length + favoriteTopics.size;
  let questionsLeftToAnswer = getQuestionsLeftToAnswer(
    answers,
    favoriteTopics.size > 0
  );

  return (
    <>
      <div className="columns" style={{ margin: "50vh 0" }}>
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
              Choose up to {MAX_FAVORITE_TOPICS}. These will impact your
              matching score more
            </h3>
            <div className="buttons mt-5">
              {Object.entries(formatQuestionContent()).map(
                (questionGroup, i) => (
                  <div style={{ width: "100%", maxWidth: "300px" }} key={i}>
                    <button
                      className={classnames(
                        "button",
                        favoriteTopics.has(questionGroup[0]) && "is-selected"
                      )}
                      onClick={() => {
                        changeFavoriteTopics(questionGroup[0]);
                      }}
                      disabled={
                        !favoriteTopics.has(questionGroup[0]) &&
                        favoriteTopics.size >= MAX_FAVORITE_TOPICS
                      }
                    >
                      {favoriteTopics.has(questionGroup[0]) && (
                        <span className="icon is-small mr-1">✕</span>
                      )}
                      {questionGroup[0]}
                    </button>
                  </div>
                )
              )}
            </div>
            {favoriteTopics.size > 0 && (
              <SmoothScroll to="results">
                <button className="button is-large mt-6">See my Results</button>
              </SmoothScroll>
            )}
          </div>
        </div>
      </div>
      <div
        className="container has-light-grey-background p-6"
        id="results"
        style={{ maxWidth: "1100px" }}
      >
        {questionsLeftToAnswer.length > 0 ? (
          <div>
            <h1 className="headline has-text-left is-inline-block">Results</h1>
            <p className="copy">
              Oops! You're not finished with the quiz yet! Please go back and
              answer{" "}
              {questionsLeftToAnswer.length > 1 ? (
                <>
                  questions{" "}
                  <b>
                    {questionsLeftToAnswer.slice(0, -1).join(", ")} and{" "}
                    {questionsLeftToAnswer.slice(-1)}
                  </b>
                </>
              ) : (
                <>
                  question <b>{questionsLeftToAnswer}</b>
                </>
              )}
              .
            </p>
            <SmoothScroll to={`question-${questionsLeftToAnswer[0]}`}>
              <button className="button is-outlined mt-4"> Go back</button>
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
                  <div className="mr-3">Share my results: </div>{" "}
                  <SocialShareButtons
                    results={{
                      topCandidate: score[0].candidateName,
                      matchScore: Math.round(
                        (score[0].totalScore / totalPossiblePoints) * 100
                      ),
                    }}
                  />
                </div>

                <SmoothScroll
                  to="quiz"
                  extraOffset={QUESTION_ANCHOR_LINK_OFFSET * -1} // Remove offset
                  onClick={() => resetAnswers()}
                >
                  <button className="button is-link is-outlined">
                    Take Quiz Again
                  </button>
                </SmoothScroll>
              </div>
            </div>
            <div
              className="copy has-text-left ml-0 mt-5"
              style={{ maxWidth: "600px" }}
            >
              Here are your top 5 matches. On election day, you are allowed to
              rank up to 5 candidates, or however many you like.
            </div>

            {score.slice(0, MATCHES_TO_SHOW).map((candidate, i) => (
              <div className="copy has-text-black-bis" key={i}>
                <hr className="my-6" />
                <details>
                  <summary
                    className="is-inline-flex is-justify-content-space-between"
                    style={{ width: "100%", cursor: "pointer" }}
                  >
                    <div className="is-flex is-align-items-center">
                      <span className="headline">
                        <span className="open-text">+</span>
                        <span className="close-text">-</span>
                      </span>
                      <Bobblehead
                        candidateName={candidate.candidateName}
                        size="is-96x96"
                        customClassNames="py-4 mr-4"
                        showBustOnly
                      />
                      <h2 className="headline has-text-left is-size-3-touch">
                        {candidate.candidateName}
                      </h2>
                    </div>
                    <h2 className="headline is-size-3-touch">
                      {Math.round(
                        (candidate.totalScore / totalPossiblePoints) * 100
                      )}
                      % Match
                    </h2>
                  </summary>
                  <div className="copy mt-4 ml-4">
                    You agreed with them on...
                  </div>
                  <div className="results-scorecard is-flex is-flex-direction-row is-flex-wrap-wrap ml-4">
                    {Object.entries(
                      groupBy(candidate.scoreList, "subject")
                    ).map((questionGroup, i) => (
                      <div key={i} className="mb-5">
                        {questionGroup[1].map((question, i) => (
                          <div
                            key={i}
                            className={classnames(
                              "quiz-selection-oval",
                              question.points > 0 && "is-filled"
                            )}
                          />
                        ))}
                        <h3 className="has-text-weight-semibold">
                          {favoriteTopics.has(questionGroup[0]) && "★"}{" "}
                          {questionGroup[0]}{" "}
                          {favoriteTopics.has(questionGroup[0]) && "★"}
                        </h3>
                        <p className="copy">
                          {questionGroup[1].filter((q) => q.points > 0).length}{" "}
                          out of {questionGroup[1].length}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="buttons mt-4 ml-4">
                    <button className="button">
                      <Link to={kebabCase(candidate.candidateName)}>
                        Learn more about {candidate.candidateName}
                      </Link>{" "}
                    </button>
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Results;
