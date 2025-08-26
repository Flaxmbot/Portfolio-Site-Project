// src/ai/flows/generate-proposal.ts
'use server';
/**
 * @fileOverview A proposal generation AI agent.
 *
 * - generateProposal - A function that handles the proposal generation process.
 * - GenerateProposalInput - The input type for the generateProposal function.
 * - GenerateProposalOutput - The return type for the generateProposal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProposalInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  projectName: z.string().describe('The name of the project.'),
  projectDescription: z.string().describe('A detailed description of the project.'),
  projectGoals: z.string().describe('The goals of the project.'),
  projectTimeline: z.string().describe('The timeline for the project.'),
  projectBudget: z.string().describe('The budget for the project.'),
});
export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

const GenerateProposalOutputSchema = z.object({
  proposalOutline: z.string().describe('A detailed outline of the proposal.'),
});
export type GenerateProposalOutput = z.infer<typeof GenerateProposalOutputSchema>;

export async function generateProposal(input: GenerateProposalInput): Promise<GenerateProposalOutput> {
  // Add a timeout to prevent long-running requests
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Proposal generation timed out after 30 seconds')), 30000);
  });

  try {
    const result = await Promise.race([
      generateProposalFlow(input),
      timeoutPromise
    ]);
    return result;
  } catch (error) {
    if (error instanceof Error && error.message === 'Proposal generation timed out after 30 seconds') {
      throw error;
    }
    // Re-throw other errors
    throw error;
  }
}

const prompt = ai.definePrompt({
  name: 'generateProposalPrompt',
  input: {schema: GenerateProposalInputSchema},
  output: {schema: GenerateProposalOutputSchema},
  prompt: `You are an expert proposal writer. Your job is to take the project details provided and create a comprehensive, professional proposal outline.

  Client Name: {{{clientName}}}
  Project Name: {{{projectName}}}
  Project Description: {{{projectDescription}}}
  Project Goals: {{{projectGoals}}}
  Project Timeline: {{{projectTimeline}}}
  Project Budget: {{{projectBudget}}}

  Based on the information above, generate a detailed proposal outline that is clear, concise, and persuasive. 
  
  Structure the proposal with the following sections and content:

  1. Introduction
  Briefly introduce our company and our expertise in relevant technologies and solutions. Express enthusiasm for the client's project. State the purpose of the proposal: to outline our understanding, proposed solution, timeline, and budget.

  2. Project Understanding
  Demonstrate clear understanding of the client's vision and requirements. Highlight the key project goals and target audience. Acknowledge the importance of specific technical requirements mentioned. Restate the project requirements based on the provided information.

  3. Proposed Solution
  Present a comprehensive plan for developing the solution. Detail the technologies and methodologies we will employ. Describe the key features and functionality. Explain integration approaches and technical architecture. Emphasize user-friendly design and intuitive interface. Address scalability and maintainability considerations.

  4. Timeline
  Provide a detailed project timeline spanning the specified duration. Include key milestones and deliverables for each phase including requirements gathering, development, testing, and deployment. Account for potential contingencies and buffer time.

  5. Budget
  Present a clear and transparent breakdown of the project budget. Specify costs associated with each stage of development. Justify the budget allocation and demonstrate value for money. Outline payment terms and conditions.

  6. Conclusion
  Reiterate confidence in delivering a successful solution. Summarize the key benefits of our proposed approach. Express commitment to exceeding expectations and achieving project goals. Include a call to action inviting the client to move forward. Provide contact information for further discussion.

  Important formatting guidelines:
  - Use clean, professional language without parentheses, asterisks, or formatting artifacts
  - Structure content with clear section headers
  - Write in complete, natural paragraphs
  - Avoid bullet points with asterisks or special characters
  - Make the tone professional and geared towards securing the project
  `,
});

const generateProposalFlow = ai.defineFlow(
  {
    name: 'generateProposalFlow',
    inputSchema: GenerateProposalInputSchema,
    outputSchema: GenerateProposalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
