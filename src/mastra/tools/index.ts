import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  transcript: z.string(),
});

export const meetingReformerTool: any = createTool({
  id: "meetingSummarizerTool",
  inputSchema: z.object({}),
  description: "Summarizes meeting transcripts into structured summaries with key points and action items.",
  execute: async () => {
    console.log("I am working");
    return;
  },
});
