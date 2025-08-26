import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authorization = request.headers.get('Authorization');
    await verifyAdminToken(authorization);

    // Fetch contacts from Firestore using Admin SDK
    const contactsSnapshot = await adminDb.collection('contacts').orderBy('createdAt', 'desc').get();
    const contactsList: any[] = [];
    
    contactsSnapshot.forEach((doc) => {
      const contactData = doc.data();
      contactsList.push({
        id: doc.id,
        name: contactData.name || 'Unknown',
        email: contactData.email || 'No email',
        message: contactData.message || 'No message',
        status: contactData.status || 'new',
        createdAt: contactData.createdAt?.toDate ? contactData.createdAt.toDate().getTime() : Date.now()
      });
    });

    return NextResponse.json(contactsList);
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    
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