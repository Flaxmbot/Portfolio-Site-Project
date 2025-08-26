import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminToken, adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { Project } from '@/types';

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  tags: z.string().min(1, "At least one tag is required."),
  imageUrl: z.string().url("Must be a valid URL."),
  projectUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  "data-ai-hint": z.string().optional(),
  caseStudyProblem: z.string().min(10, "Problem description is required."),
  caseStudySolution: z.string().min(10, "Solution description is required."),
  caseStudyOutcome: z.string().min(10, "Outcome description is required."),
});

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authorization = request.headers.get('Authorization');
    await verifyAdminToken(authorization);

    const payload = await request.json();
    
    // Validate input data
    const validatedFields = projectSchema.safeParse(payload);
    
    if (!validatedFields.success) {
      return NextResponse.json({
        status: 'error',
        message: "Validation failed. Check your inputs.",
        errors: validatedFields.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const { id, ...projectData } = validatedFields.data;
    const tagsArray = projectData.tags.split(',').map(tag => tag.trim());

    const projectToSave: Omit<Project, 'id'> = {
      title: projectData.title,
      description: projectData.description,
      tags: tagsArray,
      imageUrl: projectData.imageUrl,
      projectUrl: projectData.projectUrl || '#',
      'data-ai-hint': projectData['data-ai-hint'] || '',
      caseStudy: {
        problem: projectData.caseStudyProblem,
        solution: projectData.caseStudySolution,
        outcome: projectData.caseStudyOutcome,
      }
    };

    if (id) {
      // Update existing project
      await adminDb.collection('projects').doc(id).set(projectToSave, { merge: true });
    } else {
      // Add new project
      await adminDb.collection('projects').add(projectToSave);
    }

    // Revalidate cached pages
    revalidatePath('/admin');
    revalidatePath('/projects');
    revalidatePath('/');

    return NextResponse.json({
      status: 'success',
      message: `Project "${projectData.title}" saved successfully!`
    });

  } catch (error: any) {
    console.error('API route error:', error);
    
    if (error.message.includes('Admin verification failed')) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication failed. Please log in again.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}