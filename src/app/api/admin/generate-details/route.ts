import { NextRequest, NextResponse } from 'next/server';
import { generateCaseStudy } from '@/ai/flows/generate-case-study';
import { verifyAdminToken } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authorization = request.headers.get('Authorization');
    await verifyAdminToken(authorization);
    
    const body = await request.json();
    const { projectName, projectDescription, projectUrl, technologiesUsed } = body;

    if (!projectName || !projectDescription) {
      return NextResponse.json(
        { error: 'Project name and description are required' },
        { status: 400 }
      );
    }

    const result = await generateCaseStudy({
      projectName,
      projectDescription,
      projectUrl: projectUrl || '#',
      technologiesUsed: technologiesUsed || '',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI generation error:', error);
    
    if (error.message.includes('Admin verification failed')) {
      return NextResponse.json(
        { error: 'Authentication failed. Please log in again.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate case study details' },
      { status: 500 }
    );
  }
}