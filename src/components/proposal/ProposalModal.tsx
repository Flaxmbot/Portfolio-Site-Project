"use client";

import { Proposal } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ProfessionalProposalDisplay } from "./ProfessionalProposalDisplay";

interface ProposalModalProps {
  proposal: Proposal | null;
  open: boolean;
  onClose: () => void;
}

export function ProposalModal({ proposal, open, onClose }: ProposalModalProps) {
  if (!proposal) return null;

  // Try to parse the generated proposal as JSON, fallback to plain text
  let parsedProposal = null;
  try {
    parsedProposal = JSON.parse(proposal.generatedProposal);
  } catch (e) {
    // If parsing fails, use the proposal as plain text
    parsedProposal = {
      proposalTitle: proposal.projectName,
      sections: [
        {
          title: "Introduction",
          content: proposal.generatedProposal
        }
      ]
    };
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-5xl md:max-w-6xl lg:max-w-7xl">
        <DialogHeader className="flex flex-row justify-between items-start">
          <div>
            <DialogTitle className="text-3xl font-headline">{proposal.projectName}</DialogTitle>
            <DialogDescription className="mt-2">
              Proposal for {proposal.clientName}
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <ProfessionalProposalDisplay
            proposalTitle={parsedProposal.proposalTitle}
            sections={parsedProposal.sections}
            clientName={proposal.clientName}
            projectName={proposal.projectName}
            projectBudget={proposal.projectBudget}
            projectTimeline={proposal.projectTimeline}
          />
          
          <div className="text-sm text-muted-foreground">
            Created: {proposal.createdAt.toLocaleDateString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}