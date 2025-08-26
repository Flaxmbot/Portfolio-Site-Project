
"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleGenerateProposal, type FormState } from "@/app/proposal/actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Send, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ProfessionalProposalDisplay } from "./ProfessionalProposalDisplay";

const formSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters."),
  projectName: z.string().min(2, "Project name must be at least 2 characters."),
  projectDescription: z.string().min(20, "Project description must be at least 20 characters."),
  projectGoals: z.string().min(10, "Project goals must be at least 10 characters."),
  projectTimeline: z.string().min(2, "Project timeline is required."),
  projectBudget: z.string().min(2, "Project budget is required."),
});

type FormData = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Proposal
        </>
      )}
    </Button>
  );
}

export function ProposalForm() {
  const { toast } = useToast();
  const initialState: FormState = { message: null, proposal: null, errors: {} };
  const [state, formAction] = useActionState(handleGenerateProposal, initialState);
  const [isSending, setIsSending] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);
  const [editableProposal, setEditableProposal] = useState("");
  const [formValues, setFormValues] = useState({
    clientName: "",
    projectName: "",
    projectDescription: "",
    projectGoals: "",
    projectTimeline: "",
    projectBudget: "",
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      projectName: "",
      projectDescription: "",
      projectGoals: "",
      projectTimeline: "",
      projectBudget: "",
    },
  });

  const handleSendToFirestore = async () => {
    if (!state.proposal) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, "proposals"), {
        clientName: formValues.clientName,
        projectName: formValues.projectName,
        projectDescription: formValues.projectDescription,
        projectGoals: formValues.projectGoals,
        projectTimeline: formValues.projectTimeline,
        projectBudget: formValues.projectBudget,
        generatedProposal: editableProposal, // Use the editable proposal content
        status: "sent",
        createdAt: serverTimestamp(),
      });

      setProposalSent(true);
      toast({
        title: "Proposal Sent!",
        description: "Your proposal has been sent to our team for review.",
      });
    } catch (error) {
      console.error("Error sending proposal:", error);
      toast({
        variant: "destructive",
        title: "Send Failed",
        description: "Failed to send proposal. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (state.errors) {
      // Clear all previous errors
      form.clearErrors();
      // Set new errors
      for (const [field, messages] of Object.entries(state.errors)) {
        if (messages && messages.length > 0) {
            form.setError(field as keyof FormData, {
                type: "manual",
                message: messages[0],
            });
        }
      }
    }
  }, [state.errors, form]);

  useEffect(() => {
    if (state.message && state.message.startsWith("An unexpected error")) {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        });
    }
  }, [state.message, toast]);

  // Set editable proposal when state.proposal changes
  useEffect(() => {
    if (state.proposal) {
      setEditableProposal(state.proposal);
    }
  }, [state.proposal]);

  // Update form values when form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as any);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  if (state.proposal) {
    // Try to parse the generated proposal as JSON, fallback to plain text
    let parsedProposal = null;
    try {
      parsedProposal = JSON.parse(state.proposal);
    } catch (e) {
      // If parsing fails, use the proposal as plain text
      parsedProposal = {
        proposalTitle: formValues.projectName || "Project Proposal",
        sections: [
          {
            title: "Introduction",
            content: state.proposal
          }
        ]
      };
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-headline font-bold text-primary">Your Professional Proposal</h2>
            </div>
            
            <div className="mb-6">
              <ProfessionalProposalDisplay
                proposalTitle={parsedProposal.proposalTitle}
                sections={parsedProposal.sections}
                clientName={formValues.clientName}
                projectName={formValues.projectName}
                projectBudget={formValues.projectBudget}
                projectTimeline={formValues.projectTimeline}
              />
            </div>
            
            <Textarea
              value={editableProposal}
              onChange={(e) => setEditableProposal(e.target.value)}
              className="min-h-[200px] mb-6 p-4 bg-muted/20 rounded-lg border resize-y"
              placeholder="Edit the JSON proposal content here..."
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              {!proposalSent && (
                <Button
                  onClick={handleSendToFirestore}
                  disabled={isSending}
                  className="flex-1"
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Proposal to Team
                    </>
                  )}
                </Button>
              )}
              
              {proposalSent && (
                <div className="flex-1 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-center text-green-400">
                  ✓ Proposal sent successfully!
                </div>
              )}
              
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Create Another Proposal
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
 }

  return (
    <Card>
      <CardContent className="p-8">
        <Form {...form}>
          <form
            action={formAction}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Project Phoenix" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the project, its background, and what you want to achieve."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What are the main objectives? e.g., Increase user engagement, boost sales."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="projectTimeline"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Timeline</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 3-4 months" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="projectBudget"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., $10,000 - $15,000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}