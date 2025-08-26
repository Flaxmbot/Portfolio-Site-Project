export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  "data-ai-hint": string;
  projectUrl?: string;
  caseStudy: {
    problem: string;
    solution: string;
    outcome: string;
    aiGeneratedDescription?: string;
  };
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'read' | 'replied';
};

export type Proposal = {
  id: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  projectGoals: string;
  projectTimeline: string;
  projectBudget: string;
  generatedProposal: string;
  createdAt: Date;
  status: 'new' | 'reviewed' | 'sent';
};
