import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authorization = request.headers.get('Authorization');
    await verifyAdminToken(authorization);

    // Fetch proposals from Firestore using Admin SDK
    const proposalsSnapshot = await adminDb.collection('proposals').orderBy('createdAt', 'desc').get();
    const proposalsList: any[] = [];
    
    proposalsSnapshot.forEach((doc) => {
      const proposalData = doc.data();
      proposalsList.push({
        id: doc.id,
        clientName: proposalData.clientName || 'Unknown Client',
        projectName: proposalData.projectName || 'Untitled Project',
        projectDescription: proposalData.projectDescription || 'No description',
        projectGoals: proposalData.projectGoals || 'No goals specified',
        projectTimeline: proposalData.projectTimeline || 'No timeline',
        projectBudget: proposalData.projectBudget || 'No budget',
        generatedProposal: proposalData.generatedProposal || 'No proposal content',
        status: proposalData.status || 'new',
        createdAt: proposalData.createdAt?.toDate ? proposalData.createdAt.toDate().getTime() : Date.now()
      });
    });

    return NextResponse.json(proposalsList);
  } catch (error: any) {
    console.error('Error fetching proposals:', error);
    
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