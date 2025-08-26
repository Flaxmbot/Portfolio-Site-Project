'use server';

/**
 * @fileOverview An AI agent for generating case study descriptions.
 *
 * - generateCaseStudy - A function that generates a case study description.
 * - GenerateCaseStudyInput - The input type for the generateCaseStudy function.
 * - GenerateCaseStudyOutput - The return type for the generateCaseStudy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaseStudyInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectDescription: z.string().describe('A detailed description of the project.'),
  projectUrl: z.string().describe('The URL of the project.'),
  technologiesUsed: z.string().describe('A comma-separated list of technologies used in the project.'),
});
export type GenerateCaseStudyInput = z.infer<typeof GenerateCaseStudyInputSchema>;

const GenerateCaseStudyOutputSchema = z.object({
  caseStudyDescription: z.string().describe('A compelling case study description for the project.'),
});
export type GenerateCaseStudyOutput = z.infer<typeof GenerateCaseStudyOutputSchema>;

export async function generateCaseStudy(input: GenerateCaseStudyInput): Promise<GenerateCaseStudyOutput> {
  // Add a timeout to prevent long-running requests
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Case study generation timed out after 30 seconds')), 30000);
  });

  try {
    const result = await Promise.race([
      generateCaseStudyFlow(input),
      timeoutPromise
    ]);
    return result;
  } catch (error) {
    if (error instanceof Error && error.message === 'Case study generation timed out after 30 seconds') {
      throw error;
    }
    // Re-throw other errors
    throw error;
  }
}

const prompt = ai.definePrompt({
  name: 'generateCaseStudyPrompt',
  input: {schema: GenerateCaseStudyInputSchema},
  output: {schema: GenerateCaseStudyOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in creating engaging case studies for software development projects.

  Based on the following project information, write a compelling case study description that highlights the key achievements, technologies used, and the overall impact of the project.

  Project Name: {{{projectName}}}
  Project Description: {{{projectDescription}}}
  Project URL: {{{projectUrl}}}
  Technologies Used: {{{technologiesUsed}}}

  Focus on making the case study interesting and easy to read, suitable for inclusion in a portfolio website. The description should be no more than 3 paragraphs.
  `,
});

const generateCaseStudyFlow = ai.defineFlow(
  {
    name: 'generateCaseStudyFlow',
    inputSchema: GenerateCaseStudyInputSchema,
    outputSchema: GenerateCaseStudyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
