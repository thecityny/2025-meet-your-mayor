import React from "react";
import {
  formatQuestionContent,
  QUESTION_ANCHOR_LINK_OFFSET,
  QuizInput,
} from "./Quiz";
import { candidateContent } from "../candidate-content";
import AnchorLink from "react-anchor-link-smooth-scroll";

type ResultsProps = {
  answers: QuizInput[];
  resetAnswers: () => void;
};

type ScoreCard = {
  candidateName: string;
  scoreList: { questionNumber: number; points: number }[];
  totalScore: number;
}[];

const generateBlankScorecard = (): ScoreCard => {
  const { candidateX, ...candidates } = candidateContent;
  return Object.entries(candidates).map((candidate) => {
    return {
      candidateName: candidate[1].name,
      scoreList: [],
      totalScore: 0,
    };
  });
};

const calculateScore = (answers: QuizInput[]) => {
  let scorecard = generateBlankScorecard();
  const questionContent = formatQuestionContent();
  Object.entries(questionContent).forEach((questionGroup) => {
    const [subject, questions] = questionGroup;
    console.log(subject);
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
            points: 1,
          });
        } else if (
          userAnswer?.answer === "2" &&
          option2.matchingCandidates.find(
            (c) => c.name === candidate.candidateName
          )
        ) {
          scorecard[i].scoreList.push({
            questionNumber: number,
            points: 1,
          });
        } else if (
          userAnswer?.answer === "3" &&
          option3.matchingCandidates.find(
            (c) => c.name === candidate.candidateName
          )
        ) {
          scorecard[i].scoreList.push({
            questionNumber: number,
            points: 1,
          });
        } else if (
          userAnswer?.answer === "4" &&
          option4.matchingCandidates.find(
            (c) => c.name === candidate.candidateName
          )
        ) {
          scorecard[i].scoreList.push({
            questionNumber: number,
            points: 1,
          });
        } else {
          scorecard[i].scoreList.push({
            questionNumber: number,
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

export const getQuestionsLeftToAnswer = (answers: QuizInput[]) =>
  answers
    .filter((question) => question.answer === null)
    .map((question) => question.questionNumber);

/**
 * Total matching candidates we should show users in their quiz results.
 */
const MATCHES_TO_SHOW = 5;

const Results: React.FC<ResultsProps> = ({ answers, resetAnswers }) => {
  const score = calculateScore(answers);
  const totalPossiblePoints = answers.length;
  const questionsLeftToAnswer = getQuestionsLeftToAnswer(answers);

  return (
    <div
      className="container has-background-light p-6"
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
            <h1 className="headline has-text-left is-inline-block">Results</h1>
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
                    % Match
                  </h2>
                </summary>
              </details>
              <br />
              <span>
                {candidate.scoreList.map((question) => (
                  <span key={question.questionNumber}>
                    Question {question.questionNumber}: {question.points} points
                    <br />
                  </span>
                ))}
              </span>
              Total Score: {candidate.totalScore}
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
