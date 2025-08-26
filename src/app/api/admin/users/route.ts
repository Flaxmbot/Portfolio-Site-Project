import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authorization = request.headers.get('Authorization');
    await verifyAdminToken(authorization);

    // Fetch users from Firestore using Admin SDK
    const usersSnapshot = await adminDb.collection('users').get();
    const usersList: any[] = [];
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      usersList.push({
        id: doc.id,
        email: userData.email || 'No email',
        admin: userData.admin || false,
        createdAt: userData.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString() : 'Unknown'
      });
    });

    return NextResponse.json(usersList);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    
    if (error.message.includes('Admin verification failed')) {
      return NextResponse.json(
        { error: 'Authentication Error: Admin verification failed' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error: An unexpected error occurred.' },
      { status: 500 }
    );
  }
}