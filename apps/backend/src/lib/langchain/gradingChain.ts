import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

// Define the expected structure of the LLM's response
export const gradingSchema = z.object({
    score: z.string().describe("Score in the format X/Y"),
    feedback: z.string().describe("Feedback for the student"),
});

const parser = StructuredOutputParser.fromZodSchema(gradingSchema as any);

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are an AI grading assistant. Your job is to assign a score and give helpful feedback based on the rubric."],
    ["human", `
        Grade the following boxed answer based on the rubric. Use the rubric's point values to decide the score.

        Rubric for Question {questionNum}:
        {rubric}

        Student's Boxed Answer:
        {boxedAnswer}

        Student's Work:
        {text}

        Evaluate if the boxed answer is correct. Deduct points for missing steps and explain why.

        Respond strictly in this JSON format:
        {{ "{{" }} "score": "X/Y", "feedback": "..." {{ "}}" }}
    `],
]);

const model = new ChatOpenAI({
    temperature: 0.3,
    modelName: "gpt-4o",
});

export const gradingChain = RunnableSequence.from([
    prompt,
    model,
    parser,
]);