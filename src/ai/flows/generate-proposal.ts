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
  proposalTitle: z.string().describe('The title of the proposal.'),
  sections: z.array(z.object({
    title: z.string().describe('The title of the section.'),
    content: z.string().describe('The content of the section.')
  })).describe('An array of sections with titles and content.'),
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
  prompt: `You are an expert proposal writer. Your job is to take the project details provided and create a comprehensive, professional proposal in a structured format.

  Client Name: {{{clientName}}}
  Project Name: {{{projectName}}}
  Project Description: {{{projectDescription}}}
  Project Goals: {{{projectGoals}}}
  Project Timeline: {{{projectTimeline}}}
  Project Budget: {{{projectBudget}}}

  Generate a professional proposal with the following structure:

  Proposal Title: "Professional Project Proposal for [Project Name]"
  
  Sections:
  1. Executive Summary - Brief overview and value proposition
  2. Project Understanding - Demonstration of understanding client needs and project requirements
  3. Proposed Solution - Detailed technical approach and methodology
  4. Timeline & Milestones - Structured project timeline with key deliverables
  5. Investment & Budget - Clear budget breakdown with payment terms
  6. Why Choose Us - Our expertise and commitment to success
  7. Next Steps - Clear call to action and contact information

  CRITICAL REQUIREMENTS:
  1. Return ONLY valid JSON with proposalTitle and sections array - no additional text or explanations
  2. Use professional language without brackets, placeholders, or template text
  3. Make content specific to the client and project details provided
  4. Replace all placeholder content with real, tailored information
  5. Each section should be 2-4 substantial paragraphs of professional prose
  6. Reference specific client name, project name, and requirements throughout
  7. Budget section should reference the provided budget range
  8. Timeline should align with the provided timeline
  9. Use industry-appropriate technical terms and methodologies
  10. End with concrete next steps and professional contact approach

  Write as Aether Portfolio, a professional technology consultancy specializing in innovative digital solutions. Demonstrate expertise in modern web technologies, AI integration, and user experience design. Make this a compelling, professional proposal that would actually win the project.`,
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
