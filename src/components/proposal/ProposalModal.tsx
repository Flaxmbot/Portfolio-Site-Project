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
import { X, Calendar, DollarSign } from "lucide-react";

interface ProposalModalProps {
  proposal: Proposal | null;
  open: boolean;
  onClose: () => void;
}

export function ProposalModal({ proposal, open, onClose }: ProposalModalProps) {
  if (!proposal) return null;

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
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Project Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Timeline: {proposal.projectTimeline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Budget: {proposal.projectBudget}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Project Goals</h3>
              <p className="text-muted-foreground">{proposal.projectGoals}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">Project Description</h3>
            <p className="text-muted-foreground">{proposal.projectDescription}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">Generated Proposal</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{proposal.generatedProposal}</p>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Created: {proposal.createdAt.toLocaleDateString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}