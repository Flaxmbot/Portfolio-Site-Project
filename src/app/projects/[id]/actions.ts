
'use server';

import { z } from 'zod';
import { generateCaseStudy } from '@/ai/flows/generate-case-study';

const formSchema = z.object({
  projectName: z.string(),
  projectDescription: z.string(),
  projectUrl: z.string(),
  technologiesUsed: z.string(),
});

export type FormState = {
  message: string | null;
  caseStudyDescription: string | null;
  errors?: {
    projectName?: string[];
    projectDescription?: string[];
    projectUrl?: string[];
    technologiesUsed?: string[];
  };
};

export async function handleGenerateCaseStudy(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    projectName: formData.get('projectName'),
    projectDescription: formData.get('projectDescription'),
    projectUrl: formData.get('projectUrl'),
    technologiesUsed: formData.get('technologiesUsed'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      caseStudyDescription: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateCaseStudy(validatedFields.data);
    return {
      message: 'Case study generated successfully!',
      caseStudyDescription: result.caseStudyDescription,
      errors: {},
    };
  } catch (error) {
    console.error('Error generating case study:', error);
    const message = error instanceof Error && error.message.includes('timed out')
      ? 'Case study generation timed out. Please try again.'
      : 'An unexpected error occurred. Please try again later.';
      
    return {
      message,
      caseStudyDescription: null,
      errors: {},
    };
  }
}
