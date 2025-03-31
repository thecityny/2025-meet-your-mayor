import React, { FC } from "react";
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

  return groupBy(questonsArray, "subject");
};

const NumberLabel: FC<{ number: number }> = ({ number }) => (
  <div
    className="tag is-light"
    style={{
      position: "absolute",
      left: "-20px",
      borderRadius: "100%",
    }}
  >
    {number}
  </div>
);

type MatchingCandidate = {
  name: string;
  quote: string;
  source: string;
};

const MatchingCandidates: FC<{ candidates: MatchingCandidate[] }> = ({
  candidates,
}) => (
  <>
    {candidates.map((candidate, i) => {
      const { name, quote, source } = candidate;
      return (
        <span key={i}>
          <div className="tag">{name}</div>
          {!!quote && `(${quote})`} {!!source && <a href={source}>source</a>}
        </span>
      );
    })}
  </>
);

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
      <div className="container" style={{ maxWidth: "600px" }}>
        {Object.entries(questions).map((questionGroup, i) => (
          <div key={i} className="question-group">
            <h2 className="headline has-text-left">{questionGroup[0]}</h2>
            {questionGroup[1].map((question) => {
              const {
                number,
                title,
                tellMeMore,
                option1,
                option2,
                option3,
                option4,
              } = question;
              return (
                <div key={number} className="question">
                  <NumberLabel number={number} />
                  <h3 className="deck has-text-left mb-2">{title}</h3>

                  <details className="mb-5">
                    <summary>Tell me more</summary>
                    {tellMeMore}
                  </details>

                  <button className="button is-link is-light mb-5">
                    {option1.text}
                  </button>

                  <p>
                    <MatchingCandidates
                      candidates={option1.matchingCandidates}
                    />
                  </p>
                  <button className="button is-link is-light mb-5">
                    {option2.text}
                  </button>
                  <p>
                    <MatchingCandidates
                      candidates={option2.matchingCandidates}
                    />
                  </p>
                  <button className="button is-link is-light mb-5">
                    {option3.text}
                  </button>
                  <p>
                    <MatchingCandidates
                      candidates={option3.matchingCandidates}
                    />
                  </p>
                  {option4?.text && (
                    <>
                      <button className="button is-link is-light mb-5">
                        {option4.text}
                      </button>
                      <p>
                        <MatchingCandidates
                          candidates={option4.matchingCandidates}
                        />
                      </p>
                    </>
                  )}
                  <button className="button is-link is-outlined mb-5">
                    Skip this question.
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default Quiz;
