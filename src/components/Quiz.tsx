import React, { FC } from "react";
import { questionContent } from "../question-content";
import { candidateContent } from "../candidate-content";
import parse from "html-react-parser";
import AnchorLink from "react-anchor-link-smooth-scroll";
import classnames from "classnames";

/**
 * Groups an array of objects by a specified key.
 * @param array - The array to group.
 * @param key - The key to group by.
 * @returns An object where each key is a unique value from the specified key,
 *           and the value is an array of objects that share that key value.
 */
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

/**
 * Converts a string containing HTML to a React component.
 *
 * @param text - The string containing HTML to convert.
 * @returns A React component representing the HTML.
 */
const convertToHtml = (text: string) => {
  let formattedText = text;

  // Make links outbound:
  formattedText = formattedText.replace(
    "<a href=",
    '<a target="_blank" rel="noopener noreferrer" href='
  );

  // Fix double spaces and non-spaced commas:
  formattedText = formattedText.replace("  ", " ").replace(",", ", ");

  return parse(formattedText);
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
  const findMatchingCandidates = (questionIndex: number, quizOption: string) =>
    candidates
      .filter((c) => c.responses[questionIndex].optionNumber === quizOption)
      .map((c) => ({
        name: c.name,
        quote: c.responses[questionIndex].quote,
        source: c.responses[questionIndex].source,
      }));
  const questonsArray = Object.values(questions).map((question, i) => ({
    ...question,
    number: i + 1,
    option1: {
      text: question.option1,

      matchingCandidates: findMatchingCandidates(i, "1"),
    },
    option2: {
      text: question.option2,
      matchingCandidates: findMatchingCandidates(i, "2"),
    },
    option3: {
      text: question.option3,
      matchingCandidates: findMatchingCandidates(i, "3"),
    },
    option4: {
      text: question.option4,
      matchingCandidates: findMatchingCandidates(i, "4"),
    },
    skipped: {
      matchingCandidates: candidates
        .filter((c) => !c.responses[i].optionNumber)
        .map((c) => ({
          name: c.name,
          quote: null,
          source: null,
        })),
    },
  }));

  return groupBy(questonsArray, "subject");
};

type QuizInput = {
  questionNumber: number;
  numberOfOptions: number;
  answer: string | null;
};

const createBlankAnswersList = (): QuizInput[] => {
  const { questionX, ...questions } = questionContent;
  return Object.entries(questions).map((question, i) => ({
    questionNumber: i + 1,
    numberOfOptions: !!question[1].option4 ? 4 : 3,
    answer: null,
  }));
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
  quote: string | null;
  source: string | null;
};

const MatchingCandidates: FC<{ candidates: MatchingCandidate[] }> = ({
  candidates,
}) => {
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
            {quote && (
              <div className="mb-5">
                <p className="copy">{quote}</p>
                {source && <span> - From {convertToHtml(source)}</span>}
              </div>
            )}
          </span>
        );
      })}
      <p className="is-inline-block is-underlined" onClick={handleClick}>
        Hide responses -
      </p>
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
      {candidates.length > 0 && candidates.filter((c) => !!c.quote).length > 0 && (
        <span key="x" onClick={handleClick}>
          <div className="mx-2 is-inline-block is-underlined">
            See responses +
          </div>
        </span>
      )}
    </>
  );
};

const Quiz = () => {
  const questions = formatQuestionContent();
  const [answers, setAnswers] = React.useState(createBlankAnswersList());

  const recordAnswer = (questionNumber: number, answer: string | null) => {
    const updatedAnswers = answers.map((answerObj) => {
      if (answerObj.questionNumber === questionNumber) {
        return { ...answerObj, answer };
      }
      return answerObj;
    });
    setAnswers(updatedAnswers);
  };

  const clearAnswer = (questionNumber: number) =>
    recordAnswer(questionNumber, null);

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
              <AnchorLink href="#questions" className="control">
                <button className="button is-link">Democrat</button>
              </AnchorLink>
              <AnchorLink href="#questions" className="control">
                <button className="button is-link">Republican</button>
              </AnchorLink>
              <AnchorLink href="#questions" className="control">
                <button className="button is-link">All</button>
              </AnchorLink>
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ maxWidth: "600px" }} id="questions">
        {Object.entries(questions).map((questionGroup, i) => (
          <div key={i} className="py-5">
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
                skipped,
              } = question;
              const answerSelected = answers.find(
                (answer) => answer.questionNumber === number
              )?.answer;
              return (
                <div
                  key={number}
                  id={`question-${number}`}
                  className="mb-5"
                  style={{ minHeight: "100vh" }}
                >
                  <NumberLabel number={number} />
                  <h3 className="deck has-text-left mb-2">{title}</h3>

                  <details className="mb-5">
                    <summary>Tell me more</summary>
                    {tellMeMore}
                  </details>

                  <button
                    className={classnames(
                      "button",
                      "is-link",
                      "my-5",
                      !!answerSelected && answerSelected !== "1" && "is-dark"
                    )}
                    onClick={() => recordAnswer(number, "1")}
                    disabled={!!answerSelected}
                  >
                    {option1.text}
                  </button>

                  {!!answerSelected && (
                    <div>
                      <MatchingCandidates
                        candidates={option1.matchingCandidates}
                      />
                    </div>
                  )}
                  <button
                    className={classnames(
                      "button",
                      "is-link",
                      "my-5",
                      !!answerSelected && answerSelected !== "2" && "is-dark"
                    )}
                    onClick={() => recordAnswer(number, "2")}
                    disabled={!!answerSelected}
                  >
                    {option2.text}
                  </button>
                  {!!answerSelected && (
                    <div>
                      <MatchingCandidates
                        candidates={option2.matchingCandidates}
                      />
                    </div>
                  )}
                  <button
                    className={classnames(
                      "button",
                      "is-link",
                      "my-5",
                      !!answerSelected && answerSelected !== "3" && "is-dark"
                    )}
                    onClick={() => recordAnswer(number, "3")}
                    disabled={!!answerSelected}
                  >
                    {option3.text}
                  </button>
                  {!!answerSelected && (
                    <div>
                      <MatchingCandidates
                        candidates={option3.matchingCandidates}
                      />
                    </div>
                  )}
                  {option4?.text && (
                    <>
                      <button
                        className={classnames(
                          "button",
                          "is-link",
                          "my-5",
                          !!answerSelected &&
                            answerSelected !== "4" &&
                            "is-dark"
                        )}
                        onClick={() => recordAnswer(number, "4")}
                        disabled={!!answerSelected}
                      >
                        {option4.text}
                      </button>
                      {!!answerSelected && (
                        <div>
                          <MatchingCandidates
                            candidates={option4.matchingCandidates}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {!!answerSelected ? (
                    <>
                      <div className="mb-6">
                        <MatchingCandidates
                          candidates={skipped.matchingCandidates}
                        />
                        {skipped.matchingCandidates.length > 0 && (
                          <p className="is-inline-block mt-6">
                            didn't respond to this question
                          </p>
                        )}
                      </div>
                      <div className="field is-grouped">
                        <AnchorLink
                          href={`#question-${number + 1}`}
                          offset={120}
                          className="control"
                        >
                          <button className="button is-link">
                            Next Question
                          </button>
                        </AnchorLink>
                        <button
                          className="button is-link is-outlined"
                          onClick={() => clearAnswer(number)}
                        >
                          Change answer
                        </button>
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
    </>
  );
};

export default Quiz;
