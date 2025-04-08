import React from "react";
import { NumberLabel, QUESTION_ANCHOR_LINK_OFFSET } from "./Quiz";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { groupBy } from "../utils";
import {
  formatQuestionContent,
  generateBlankScorecard,
  QuizInput,
} from "./QuizContent";

type ResultsProps = {
  favoriteTopics: Set<string>;
  changeFavoriteTopics: (topic: string) => void;
  answers: QuizInput[];
  resetAnswers: () => void;
};

const calculateScore = (answers: QuizInput[], favoriteTopics: Set<string>) => {
  let scorecard = generateBlankScorecard();
  const questionContent = formatQuestionContent();
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
 * Total matching candidates we should show users in their quiz results.
 */
const MATCHES_TO_SHOW = 5;

const Results: React.FC<ResultsProps> = ({
  answers,
  resetAnswers,
  favoriteTopics,
  changeFavoriteTopics,
}) => {
  const score = calculateScore(answers, favoriteTopics);
  const totalPossiblePoints = answers.length + favoriteTopics.size;
  let questionsLeftToAnswer = getQuestionsLeftToAnswer(
    answers,
    favoriteTopics.size > 0
  );

  return (
    <>
      <div
        id={`question-${answers.length + 1}`}
        className="container mb-5"
        style={{ minHeight: "100vh", maxWidth: "600px" }}
      >
        <NumberLabel number={answers.length + 1} />
        <h2 className="headline has-text-left">
          Now, pick which topics matter most to you
        </h2>
        <h3 className="deck has-text-left mb-2">
          Choose up to 3. These will impact your matching score more
        </h3>
        <div className="buttons">
          Selected: {Array.from(favoriteTopics).join(", ")}
          {Object.entries(formatQuestionContent()).map((questionGroup, i) => (
            <div style={{ width: "100%" }} key={i}>
              <button
                className="button"
                onClick={() => {
                  changeFavoriteTopics(questionGroup[0]);
                }}
              >
                {favoriteTopics.has(questionGroup[0]) && (
                  <span className="icon is-small mr-1">✕</span>
                )}
                {questionGroup[0]}
              </button>
            </div>
          ))}
        </div>
        {favoriteTopics.size > 0 && (
          <AnchorLink
            href="#results"
            offset={QUESTION_ANCHOR_LINK_OFFSET}
            className="button is-large mt-6"
          >
            See my Results
          </AnchorLink>
        )}
      </div>
      <div
        className="container has-background-light p-6"
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
            <AnchorLink
              href={`#question-${questionsLeftToAnswer[0]}`}
              offset={QUESTION_ANCHOR_LINK_OFFSET}
              className="button is-dark mt-4"
            >
              Go back
            </AnchorLink>
          </div>
        ) : (
          <div>
            <div className="level">
              <h1 className="headline has-text-left is-inline-block">
                Results
              </h1>
              <div className="field is-grouped">
                <AnchorLink
                  href="#quiz"
                  offset={QUESTION_ANCHOR_LINK_OFFSET}
                  className="button is-link is-outlined"
                  onClick={() => resetAnswers()}
                >
                  Take Quiz Again
                </AnchorLink>
              </div>
            </div>
            <hr />
            {score.slice(0, MATCHES_TO_SHOW).map((candidate, i) => (
              <div className="copy has-text-black-bis" key={i}>
                <details>
                  <summary
                    className="is-inline-flex is-justify-content-space-between"
                    style={{ width: "100%" }}
                  >
                    <h2 className="headline has-text-left">
                      {candidate.candidateName}
                    </h2>
                    <h2 className="headline">
                      {Math.round(
                        (candidate.totalScore / totalPossiblePoints) * 100
                      )}
                      % Match ▼
                    </h2>
                  </summary>
                  {Object.entries(groupBy(candidate.scoreList, "subject")).map(
                    (questionGroup, i) => (
                      <div className="mb-2 p-2" key={i}>
                        <h3 className="has-text-weight-semibold">
                          {favoriteTopics.has(questionGroup[0]) && "★"}{" "}
                          {questionGroup[0]}{" "}
                          {favoriteTopics.has(questionGroup[0]) && "★"}
                        </h3>
                        {questionGroup[1].map((question, i) => (
                          <div key={i}>
                            Question {question.questionNumber}:{" "}
                            {question.points} points
                            <br />
                          </div>
                        ))}
                      </div>
                    )
                  )}
                  <span className="has-text-weight-semibold">
                    {" "}
                    Total Score: {candidate.totalScore}/{totalPossiblePoints}
                  </span>
                </details>
                <br />

                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Results;
