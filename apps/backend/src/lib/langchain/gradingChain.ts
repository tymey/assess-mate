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

function buildFewShotPrompt({
    toneContext,
    examples,
}: {
    toneContext: string;
    examples: {
        rubric: string;
        boxedAnswer: string;
        text: string;
        score: string;
        feedback: string;
    }[];
}) {
    const messages: [string, string][] = [];

    // System
    messages.push([
        "system",
        `
You are an AI grading assistant. Match the tone and logic of the teacher's grading style.

Teacher's tone context:
${toneContext}
        `.trim()
    ]);

    // Few-shot examples
    for (let ex of examples) {
        // Human
        messages.push([
            "human",
            `
Rubric for Question:
${ex.rubric}

Student's Boxed Answer:
${ex.boxedAnswer}

Student's Work:
${ex.text}

Grade this and return a JSON with "score" and "feedback".
            `.trim()
        ]);

        // AI example response
        messages.push([
            "ai",
            JSON.stringify({ score: ex.score, feedback: ex.feedback }, null, 2).replaceAll("{", ``).replaceAll("}", ``),
        ]);
    }

    // Final prompt placeholder
    messages.push([
        "human",
        `
Rubric for Question {questionNum}:
{rubric}

Student's Boxed Answer:
{boxedAnswer}

Student's Work:
{text}

Grade this and return a JSON like:
{{ "{{" }} "score": "X/Y", "feedback": "..." {{ "}}" }}
        `.trim()
    ]);

    return ChatPromptTemplate.fromMessages(messages);
}

// Main function to create chain dynamically
export function createGradingChain({
    toneContext,
    examples,
}: {
    toneContext: string;
    examples: {
        rubric: string;
        boxedAnswer: string;
        text: string;
        score: string;
        feedback: string;
    }[];
}) {
    const prompt = buildFewShotPrompt({ toneContext, examples });

    const model = new ChatOpenAI({
        temperature: 0.1,
        modelName: "gpt-4o",
    });

    return RunnableSequence.from([prompt, model, parser]);
}