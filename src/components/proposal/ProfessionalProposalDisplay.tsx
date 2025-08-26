'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProposalSection {
  title: string;
  content: string;
}

interface ProfessionalProposalDisplayProps {
  proposalTitle: string;
  sections: ProposalSection[];
  clientName?: string;
  projectName?: string;
  projectBudget?: string;
  projectTimeline?: string;
}

export function ProfessionalProposalDisplay({
  proposalTitle,
  sections,
  clientName,
  projectName,
  projectBudget,
  projectTimeline
}: ProfessionalProposalDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Proposal Header */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-headline text-primary">
                {proposalTitle}
              </CardTitle>
              {clientName && (
                <p className="text-lg text-muted-foreground mt-2">
                  Prepared for <span className="font-semibold">{clientName}</span>
                </p>
              )}
            </div>
            {(projectName || projectBudget || projectTimeline) && (
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
                <div className="space-y-2">
                  {projectName && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Project:</span>
                      <span>{projectName}</span>
                    </div>
                  )}
                  {projectBudget && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Budget:</span>
                      <Badge variant="secondary">{projectBudget}</Badge>
                    </div>
                  )}
                  {projectTimeline && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Timeline:</span>
                      <Badge variant="outline">{projectTimeline}</Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Proposal Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card 
            key={index} 
            className="border-2 border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-xl font-headline text-primary flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {section.content.split('\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Proposal Footer */}
      <Card className="border-2 border-primary/10">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} - Confidential Proposal</p>
          <p className="mt-2 text-sm">
            This document contains proprietary information and is intended solely for the use of the recipient.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}