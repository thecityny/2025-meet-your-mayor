import React from "react";
import { questionContent } from "../question-content";
import { candidateContent } from "../candidate-content";

const groupBy = <T, K extends keyof any>(
  array: T[],
  key: keyof T
): Record<K, T[]> => {
  return array.reduce((acc, item) => {
    const groupKey = item[key] as K; // Ensure the key is treated as the correct type

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }

    acc[groupKey].push(item);
    return acc;
  }, {} as Record<K, T[]>);
};

type AnyObject = Record<string, any>;

const modifyValuesByPrefix = <T extends AnyObject>(
  obj: T,
  prefix: string,
  fn: (value: any) => any
): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      key.startsWith(prefix) ? [key, fn(value)] : [key, value]
    )
  ) as T;
};

const formatQuestionContent = () => {
  const { questionX, ...questions } = questionContent;
  const questonsArray = Object.values(questions).map((question, i) => ({
    number: i + 1,
    ...question,
  }));

  const questionsGroupedBySubject = groupBy(questonsArray, "subject");
  return questionsGroupedBySubject;
};

const formatCandidateContent = () => {
  const { candidateX, ...candidates } = candidateContent;
  const splitCandidateInfo = (text: string) => text.split(" | ");
  const candidatesArray = Object.values(candidates)
    .map((candidate, i) => ({
      ...candidate,
      number: i + 1,
    }))
    .map((candidate) =>
      modifyValuesByPrefix(candidate, "quote", splitCandidateInfo)
    )
    .map((candidate) =>
      modifyValuesByPrefix(candidate, "quizResponse", splitCandidateInfo)
    );

  return candidatesArray;
};

const Quiz = () => {
  const questions = formatQuestionContent();
  const candidates = formatCandidateContent();
  console.log(candidates);

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

            <h2 className="deck has-text-left">To start, pick your party:</h2>

            <div className="field is-grouped">
              <p className="control">
                <button className="button is-link">Democrat</button>
              </p>
              <p className="control">
                <button className="button is-link">Republican</button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {Object.entries(questions).map((questionGroup, i) => (
          <div key={i} className="question-group">
            <h2 className="deck has-text-left">{questionGroup[0]}</h2>
            {questionGroup[1].map((question) => (
              <div key={question.number} className="question">
                {question.number} <h1>{question.title}</h1>
                <p>{question.tellMeMore}</p>
                <p>1: {question.option1}</p>
                <p>2: {question.option2}</p>
                <p>3: {question.option3}</p>
                {question.option4 && <p>4: {question.option4}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Quiz;
