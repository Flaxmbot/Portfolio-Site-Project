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

export default function AdminPage() {
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

  // Redirect non-authenticated or non-admin users
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        router.push("/admin/login");
      } else if (!isAdmin) {
        router.push("/admin/login");
      }
    }
  }, [user, authLoading, isAdmin, adminLoading, router]);

  // Show loading spinner while auth state is loading
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show loading if user is not authenticated or not admin
  if (!user || !isAdmin) {
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
              Admin Dashboard
            </AnimatedHeading>
            <p className="mt-2 text-muted-foreground">
                Welcome, {user?.email}. Manage your projects here.
            </p>
        </div>
        <Button onClick={onLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <AdminDashboard projects={projects} loading={projectsLoading} />
    </div>
  );
}