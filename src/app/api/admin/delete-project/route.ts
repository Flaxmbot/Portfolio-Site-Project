import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const authorization = request.headers.get('Authorization');
    await verifyAdminToken(authorization);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Error: Project ID is missing.' },
        { status: 400 }
      );
    }

    // Delete the project from Firestore
    await adminDb.collection('projects').doc(id).delete();

    // Revalidate cached pages
    revalidatePath('/admin');
    revalidatePath('/projects');
    revalidatePath('/');

    return NextResponse.json({
      message: 'Project deleted successfully.'
    });

  } catch (error: any) {
    console.error('Delete project error:', error);
    
    if (error.message.includes('Admin verification failed')) {
      return NextResponse.json(
        { message: 'Authentication Error: Admin verification failed' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: 'Error: An unexpected error occurred.' },
      { status: 500 }
    );
  }
}