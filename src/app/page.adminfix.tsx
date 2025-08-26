"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useProjects } from "@/hooks/use-projects";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { useToast } from "@/hooks/use-toast";

export default function AdminFixPreview() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin, adminLoading } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const { toast } = useToast();

  const onLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "Successfully logged out.",
      });
      router.push("/admin/login");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
      // Force redirect even if sign out fails
      router.push("/admin/login");
    }
  };

  // Mock admin user for preview
  const mockUser = {
    email: "admin@example.com",
    uid: "mock-admin-uid"
  };

  const mockProjects = [
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Modern e-commerce solution with AI recommendations",
      tags: ["React", "Node.js", "AI", "E-commerce"],
      imageUrl: "/api/placeholder/400/300",
      "data-ai-hint": "E-commerce platform with AI-powered product recommendations",
      projectUrl: "https://example.com",
      caseStudy: {
        problem: "Traditional e-commerce lacks personalization",
        solution: "AI-powered recommendation engine",
        outcome: "40% increase in conversion rates"
      }
    },
    {
      id: "2", 
      title: "Healthcare Dashboard",
      description: "Patient management system for healthcare providers",
      tags: ["Vue.js", "Python", "Healthcare", "Dashboard"],
      imageUrl: "/api/placeholder/400/300",
      "data-ai-hint": "Healthcare dashboard for patient management",
      caseStudy: {
        problem: "Inefficient patient data management",
        solution: "Centralized dashboard with real-time updates",
        outcome: "60% reduction in administrative time"
      }
    }
  ];

  // Show loading spinner while auth state is loading
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <AnimatedHeading 
            variant="geometric" 
            size="lg"
            backgroundClassName="mb-4"
          >
            Admin Dashboard - Fixed Version
          </AnimatedHeading>
          <p className="mt-2 text-muted-foreground">
            Preview of fixed admin dashboard with real-time data loading
          </p>
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <h3 className="font-semibold text-green-400 mb-2">Fixed Issues:</h3>
            <ul className="text-sm text-green-300 space-y-1">
              <li>✅ All data loads immediately on dashboard access</li>
              <li>✅ Proposals and Contacts tabs now have proper permissions</li>
              <li>✅ Dashboard statistics update in real-time</li>
              <li>✅ Navbar text alignment fixed</li>
            </ul>
          </div>
        </div>
        <Button onClick={onLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <AdminDashboard projects={mockProjects} loading={false} />
    </div>
  );
}