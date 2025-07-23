import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

export const toneSchema = z.object({
    toneContext: z.string().describe("A prompt that guides the AI to give feedback in the teacher's tone")
});

const parser = StructuredOutputParser.fromZodSchema(toneSchema as any);

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an expert tone analyst. A teacher has edited AI feedback for a set of student responses and rated how well the AI's tone aligned with theirs.
        
        Use this data to generate a clear prompt that can help the AI match the teacher's preferred tone, clarity, and style in future grading.`
    ],
    [
        "human",
        `Here are up to 5 samples:
        
        {examples}
        
        Return a JSON object:
        {{ "{{" }} "toneContext": "..." {{ "}}" }}`
    ]
]);

const model = new ChatOpenAI({
    temperature: 0.1,
    modelName: "gpt-4o",
});

export const toneRefinementChain = RunnableSequence.from([
    prompt,
    model,
    parser,
]);