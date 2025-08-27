// src/app/proposal/actions.ts
"use server";

import { generateProposal } from "@/ai/flows/generate-proposal";
import { z } from "zod";

const formSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters."),
  projectName: z.string().min(2, "Project name must be at least 2 characters."),
  projectDescription: z.string().min(20, "Project description must be at least 20 characters."),
  projectGoals: z.string().min(10, "Project goals must be at least 10 characters."),
  projectTimeline: z.string().min(2, "Project timeline is required."),
  projectBudget: z.string().min(2, "Project budget is required."),
});

export type FormState = {
  message: string | null;
  proposal: {
    proposalTitle: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  } | null;
  errors?: {
    clientName?: string[];
    projectName?: string[];
    projectDescription?: string[];
    projectGoals?: string[];
    projectTimeline?: string[];
    projectBudget?: string[];
  };
};

export async function handleGenerateProposal(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    clientName: formData.get("clientName"),
    projectName: formData.get("projectName"),
    projectDescription: formData.get("projectDescription"),
    projectGoals: formData.get("projectGoals"),
    projectTimeline: formData.get("projectTimeline"),
    projectBudget: formData.get("projectBudget"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      proposal: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateProposal(validatedFields.data);
    
    return {
      message: "Proposal generated successfully!",
      proposal: {
        proposalTitle: result.proposalTitle,
        sections: result.sections.map(section => ({
          title: section.title,
          content: section.content
        }))
      },
      errors: {},
    };
  } catch (error) {
    console.error("Error generating proposal:", error);
    const message = error instanceof Error && error.message.includes('timed out')
      ? "Proposal generation timed out. Please try again."
      : "An unexpected error occurred. Please try again later.";
      
    return {
      message,
      proposal: null,
      errors: {},
    };
  }
}
