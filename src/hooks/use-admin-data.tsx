"use client";

import { useState, useEffect } from 'react';
import { Contact, Proposal } from '@/types';
import { getAuthHeader } from '@/hooks/use-auth';

interface User {
  id: string;
  email: string;
  admin: boolean;
  createdAt?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sessionId: string;
}

export function useAdminData() {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatHistoryLoading, setChatHistoryLoading] = useState(true);

  const fetchAllData = async () => {
    const authHeader = await getAuthHeader();
    
    // Fetch users
    setUsersLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          ...authHeader
        }
      });
      
      if (response.ok) {
        const usersList = await response.json();
        setUsers(usersList);
      } else {
        console.error('Error fetching users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }

    // Fetch contacts
    setContactsLoading(true);
    try {
      const response = await fetch('/api/admin/contacts', {
        headers: {
          ...authHeader
        }
      });
      
      if (response.ok) {
        const contactsList = await response.json();
        // Convert timestamps back to Date objects
        const processedContacts = contactsList.map((contact: any) => ({
          ...contact,
          createdAt: new Date(contact.createdAt)
        }));
        setContacts(processedContacts);
      } else {
        console.error('Error fetching contacts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setContactsLoading(false);
    }

    // Fetch proposals
    setProposalsLoading(true);
    try {
      const response = await fetch('/api/admin/proposals', {
        headers: {
          ...authHeader
        }
      });
      
      if (response.ok) {
        const proposalsList = await response.json();
        // Convert timestamps back to Date objects
        const processedProposals = proposalsList.map((proposal: any) => ({
          ...proposal,
          createdAt: new Date(proposal.createdAt)
        }));
        setProposals(processedProposals);
      } else {
        console.error('Error fetching proposals:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setProposalsLoading(false);
    }
    
    // Fetch chat history
    setChatHistoryLoading(true);
    try {
      const response = await fetch('/api/admin/chat-history', {
        headers: {
          ...authHeader
        }
      });
      
      if (response.ok) {
        const chatHistoryList = await response.json();
        // Convert timestamps back to Date objects
        const processedChatHistory = chatHistoryList.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp)
        }));
        setChatHistory(processedChatHistory);
      } else {
        console.error('Error fetching chat history:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setChatHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refetchData = () => {
    fetchAllData();
  };

  return {
    users,
    usersLoading,
    contacts,
    contactsLoading,
    proposals,
    proposalsLoading,
    chatHistory,
    chatHistoryLoading,
    refetchData,
    setContacts,
    setProposals,
    setChatHistory
  };
}