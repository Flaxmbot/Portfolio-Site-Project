import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authorization = request.headers.get('Authorization');
    await verifyAdminToken(authorization);

    // Fetch chat history from Firestore using Admin SDK
    const chatHistorySnapshot = await adminDb.collection('chatHistory').orderBy('timestamp', 'desc').get();
    const chatHistoryList: any[] = [];
    
    chatHistorySnapshot.forEach((doc) => {
      const chatData = doc.data();
      chatHistoryList.push({
        id: doc.id,
        userId: chatData.userId || 'Anonymous',
        message: chatData.message || '',
        sender: chatData.sender || 'unknown',
        timestamp: chatData.timestamp?.toDate ? chatData.timestamp.toDate().getTime() : Date.now(),
        sessionId: chatData.sessionId || 'unknown'
      });
    });

    return NextResponse.json(chatHistoryList);
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    
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

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authorization = request.headers.get('Authorization');
    await verifyAdminToken(authorization);

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.message || !body.sender) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, message, sender' },
        { status: 400 }
      );
    }

    // Add new chat message to Firestore
    const newChatMessage = {
      userId: body.userId,
      message: body.message,
      sender: body.sender,
      timestamp: new Date(),
      sessionId: body.sessionId || 'unknown'
    };

    const docRef = await adminDb.collection('chatHistory').add(newChatMessage);

    return NextResponse.json({ 
      id: docRef.id, 
      ...newChatMessage,
      timestamp: newChatMessage.timestamp.getTime()
    });
  } catch (error: any) {
    console.error('Error adding chat message:', error);
    
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