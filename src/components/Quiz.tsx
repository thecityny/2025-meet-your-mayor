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

// type AnyObject = Record<string, any>;

// const modifyValuesByPrefix = <T extends AnyObject>(
//   obj: T,
//   prefix: string,
//   fn: (value: any) => any
// ): T => {
//   return Object.fromEntries(
//     Object.entries(obj).map(([key, value]) =>
//       key.startsWith(prefix) ? [key, fn(value)] : [key, value]
//     )
//   ) as T;
// };

const formatCandidateContent = () => {
  const { candidateX, ...candidates } = candidateContent;
  const splitCandidateInfo = (text: string) => text.split(" | ");

  return Object.values(candidates).map((candidate) => {
    const quizResponses = Object.entries(candidate)
      .filter(([key]) => key.startsWith("quizResponse"))
      .map(([, value]) => ({
        optionNumber: splitCandidateInfo(value)[0],
        quote: splitCandidateInfo(value)[1],
        source: splitCandidateInfo(value)[2],
      }));

    const quotes = Object.entries(candidate)
      .filter(([key]) => key.startsWith("quote"))
      .map(([, value]) => ({
        subject: splitCandidateInfo(value)[0],
        quote: splitCandidateInfo(value)[1],
        source: splitCandidateInfo(value)[2],
      }));

    return { responses: quizResponses, quotes, ...candidate };
  });
};

const formatQuestionContent = () => {
  const candidates = formatCandidateContent();
  const { questionX, ...questions } = questionContent;
  const questonsArray = Object.values(questions).map((question, i) => ({
    ...question,
    number: i + 1,
    option1: {
      text: question.option1,
      matchingCandidates: candidates
        .filter((c) => c.responses[i].optionNumber === "1")
        .map((c) => ({
          name: c.name,
          quote: c.responses[i].quote,
          source: c.responses[i].source,
        })),
    },
    option2: {
      text: question.option2,
      matchingCandidates: candidates
        .filter((c) => c.responses[i].optionNumber === "2")
        .map((c) => ({
          name: c.name,
          quote: c.responses[i].quote,
          source: c.responses[i].source,
        })),
    },
    option3: {
      text: question.option3,
      matchingCandidates: candidates
        .filter((c) => c.responses[i].optionNumber === "3")
        .map((c) => ({
          name: c.name,
          quote: c.responses[i].quote,
          source: c.responses[i].source,
        })),
    },
    option4: {
      text: question.option4,
      matchingCandidates: candidates
        .filter((c) => c.responses[i].optionNumber === "4")
        .map((c) => ({
          name: c.name,
          quote: c.responses[i].quote,
          source: c.responses[i].source,
        })),
    },
  }));

  const questionsGroupedBySubject = groupBy(questonsArray, "subject");
  return questionsGroupedBySubject;
};

const Quiz = () => {
  const questions = formatQuestionContent();

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
                <p>1: {question.option1.text}</p>
                <p>
                  {question.option1.matchingCandidates.map((candidate) => (
                    <span key={candidate.name}>
                      {candidate.name} ({candidate.quote}){" "}
                      <a href={candidate.source}>source</a>
                    </span>
                  ))}
                </p>
                <p>2: {question.option2.text}</p>
                <p>
                  {question.option2.matchingCandidates.map((candidate) => (
                    <span key={candidate.name}>
                      {candidate.name} ({candidate.quote}){" "}
                      <a href={candidate.source}>source</a>
                    </span>
                  ))}
                </p>
                <p>3: {question.option3.text}</p>
                <p>
                  {question.option3.matchingCandidates.map((candidate) => (
                    <span key={candidate.name}>
                      {candidate.name} ({candidate.quote}){" "}
                      <a href={candidate.source}>source</a>
                    </span>
                  ))}
                </p>
                {question.option4?.text && <p>4: {question.option4.text}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Quiz;
