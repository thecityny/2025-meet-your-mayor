import React from "react";
import { formatQuestionContent, QuizInput } from "./Quiz";
import { candidateContent } from "../candidate-content";

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

const Results: React.FC<ResultsProps> = ({ answers, resetAnswers }) => {
  const score = calculateScore(answers);
  console.log(score[0]);

  return (
    <div
      className="container has-background-light"
      style={{ maxWidth: "900px" }}
    >
      <h2>Results</h2>
      {score.map((candidate, i) => (
        <div className="copy has-text-black-bis" key={i}>
          <h1 className="headline has-text-left">{candidate.candidateName}</h1>
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
  );
};

export default Results;
