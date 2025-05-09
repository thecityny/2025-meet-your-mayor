import { questionContent } from "../question-content";
import { candidateContent } from "../candidate-content";
import { groupBy, kebabCase } from "../utils";
import { Party, useAppStore } from "../useAppStore";

/**
 * This function takes our raw JSON content from `candidate-content.js`
 * and formats it into a organized JS object that keeps track of all
 * candidates' responses to quiz questions, with explanations.
 */
export const formatCandidateContent = (party?: Party) => {
  // Filter candidates by party (if selected):
  const candidates =
    party === "democrat"
      ? Object.fromEntries(
          Object.entries(candidateContent).filter(
            (candidate) => candidate[1].party === "democrat"
          )
        )
      : candidateContent;

  const splitCandidateInfo = (text: string) => text.split("|");

  return Object.values(candidates).map((candidate) => {
    const quizResponses = Object.entries(candidate)
      .filter(([key]) => key.startsWith("quizResponse"))
      .map(([, value]) => ({
        optionNumber: splitCandidateInfo(value)[0]?.trim(),
        quote: splitCandidateInfo(value)[1]?.trim(),
        source: splitCandidateInfo(value)[2]?.trim(),
      }));

    const quotes = Object.entries(candidate)
      .filter(([key]) => key.startsWith("quote"))
      .map(([, value]) => ({
        subject: splitCandidateInfo(value)[0]?.trim(),
        quote: splitCandidateInfo(value)[1]?.trim(),
        source: splitCandidateInfo(value)[2]?.trim(),
      }));

    return { responses: quizResponses, quotes, ...candidate };
  });
};

/**
 * This function can be used to test the formatting of the candidate content array.
 * For example: test to make sure each entry has no more than two `|` delimiters.
 */
export const testCandidateContentFormat = () => {
  for (const outerKey in candidateContent) {
    const innerObj =
      candidateContent[outerKey as keyof typeof candidateContent];
    for (const innerKey in innerObj) {
      const value = innerObj[innerKey as keyof typeof innerObj];
      const pipeCount = (value.match(/\|/g) || []).length;
      const noSpaceBeforeParenthesis = (value.match(/\S\(/) || []).length > 0;
      if (pipeCount > 2) {
        console.log(`Too many pipes in ${outerKey}.${innerKey}: "${value}"`);
      }
      if (noSpaceBeforeParenthesis) {
        console.log(
          `Improper parentesis spacing in ${outerKey}.${innerKey}: "${value}"`
        );
      }
    }
  }
};

export const generateListOfCandidatesByParty = (party?: Party) => {
  return Object.values(candidateContent)
    .sort((a, b) => (a.name > b.name ? 1 : -1)) // Sort alphabetically by name
    .filter((candidate) =>
      party === "democrat"
        ? candidate.party === "democrat"
        : party === "other"
        ? candidate.party !== "democrat"
        : true
    ) // Filter by party, if specified
    .map((candidate) => ({
      name: candidate.name,
      slug: kebabCase(candidate.name),
    }));
};

/**
 * This function takes our raw JSON content from `question-content.js`
 * and formats it into a organized JS object that keeps track of the quiz
 * questions and answers, joining on which candidates correspond to which
 * quiz question responses.
 */
export const formatQuestionContent = () => {
  const party = useAppStore((state) => state.party);
  const candidates = formatCandidateContent(party);
  const findMatchingCandidates = (questionIndex: number, quizOption: string) =>
    candidates
      .filter((c) => c.responses[questionIndex].optionNumber === quizOption)
      .map((c) => ({
        name: c.name,
        quote: c.responses[questionIndex].quote,
        source: c.responses[questionIndex].source,
      }));
  const questonsArray = Object.values(questionContent).map((question, i) => ({
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
      matchingCandidates: findMatchingCandidates(i, "0").concat(
        candidates
          .filter((c) => !c.responses[i].optionNumber)
          .map((c) => ({
            name: c.name,
            quote: "",
            source: "",
          }))
      ),
    },
  }));

  return groupBy(questonsArray, "subject");
};

export type QuizInput = {
  questionNumber: number;
  answer: string | null;
};

export type ScoreCard = {
  candidateName: string;
  scoreList: { questionNumber: number; subject: string; points: number }[];
  totalScore: number;
  totalPossibleScore: number;
}[];

/**
 * This function creates a blank template to keep track of which
 * candidates match up with user responses most closely.
 */
export const generateBlankScorecard = (): ScoreCard => {
  return Object.entries(candidateContent).map((candidate) => {
    return {
      candidateName: candidate[1].name,
      scoreList: [],
      totalScore: 0,
      totalPossibleScore: 0,
    };
  });
};
