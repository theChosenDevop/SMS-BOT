import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { meetingReformerTool } from "../tools/index";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = google("gemini-1.5-pro");

export const contextEnrichment: any = new Agent({
  name: 'Meeting Summarizer Agent',
  instructions: `
      You are a helpful AI-enhanced messaging assistant.
      
      Your primary function is to reformat and summarize user-provided messages based on the desired tone (e.g., Friendly, Professional, Urgent, Casual).

      When given a message and tone, do the following:
      - Reformat the message into an SMS-friendly version
      - Adjust the tone as requested
      - Be concise, polite, and clear
      - Avoid asking the user questions
      - Return the reformatted message directly.`,
      model: model,
      tools: { meetingReformerTool },
})
