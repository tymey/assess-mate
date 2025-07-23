import { Rubric } from "@prisma/client";

type OCRQuestion = {
  questionNum: number | null;
  text: string;
  boxedAnswer: string | null;
};

export function matchRubricsToQuestions(
  questions: OCRQuestion[],
  rubrics: Rubric[]
) {
  return questions.map((q) => {
    let matchedRubric: Rubric | null = null;

    if (q.questionNum != null) {
      matchedRubric =
        rubrics.find((r) => r.questionNum === q.questionNum) || null;
    }

    return {
      ...q,
      rubric: matchedRubric
    };
  });
}
