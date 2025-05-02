import { questionContent } from "../question-content";
import { candidateContent } from "../candidate-content";
import { groupBy, kebabCase } from "../utils";
import { Party } from "./Quiz";

/**
 * This function takes our raw JSON content from `candidate-content.js`
 * and formats it into a organized JS object that keeps track of all
 * candidates' responses to quiz questions, with explanations.
 */
export const formatCandidateContent = (party?: Party) => {
  const { candidateX, ...candidatesAll } = candidateContent;

  // Filter candidates by party (if selected):
  const candidates =
    party === "Democrat"
      ? Object.fromEntries(
          Object.entries(candidatesAll).filter(
            (candidate) => candidate[1].party === "democrat"
          )
        )
      : candidatesAll;

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

export const generateListOfCandidates = () => {
  const { candidateX, ...candidates } = candidateContent;
  return Object.values(candidates)
    .sort((a, b) => (a.name > b.name ? 1 : -1)) // Sort alphabetically by name
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
export const formatQuestionContent = (party?: Party) => {
  const candidates = formatCandidateContent(party);
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

export type QuizInput = {
  questionNumber: number;
  answer: string | null;
};

/**
 * This function creates a blank template to keep track of user's
 * responses to quiz questions.
 */
export const createBlankAnswersList = (): QuizInput[] => {
  const { questionX, ...questions } = questionContent;
  return Object.entries(questions).map((question, i) => ({
    questionNumber: i + 1,
    answer: null,
  }));
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
  const { candidateX, ...candidates } = candidateContent;
  return Object.entries(candidates).map((candidate) => {
    return {
      candidateName: candidate[1].name,
      scoreList: [],
      totalScore: 0,
      totalPossibleScore: 0,
    };
  });
};
