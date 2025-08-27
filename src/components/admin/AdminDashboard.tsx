'use client';

import { useState, useMemo, useEffect } from 'react';
import { Project, Contact, Proposal } from '@/types';
import { useAdminData } from '@/hooks/use-admin-data';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, FolderOpen, Users, BarChart3, UserCog, MessageSquare, FileText, Mail, Calendar, DollarSign, Eye, Trash2, BookOpen, File, MessageCircle } from 'lucide-react';
import { ProjectForm } from './ProjectForm';
import { BlogPostForm } from './BlogPostForm';
import { ResourceForm } from './ResourceForm';
import { ProjectList } from './ProjectList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ProposalModal } from '@/components/proposal/ProposalModal';

interface AdminDashboardProps {
  projects: Project[];
  loading: boolean;
}

interface TagData {
  name: string;
  count: number;
}

export function AdminDashboard({ projects, loading }: AdminDashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'users' | 'analytics' | 'contacts' | 'proposals' | 'chat' | 'blog' | 'resources'>('projects');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Blog posts state
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogPostsLoading, setBlogPostsLoading] = useState(true);
  const [selectedBlogPost, setSelectedBlogPost] = useState<any | null>(null);
  const [isBlogPostFormOpen, setIsBlogPostFormOpen] = useState(false);
  
  // Resources state
  const [resources, setResources] = useState<any[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  
  const { idToken } = useAuth();
  
  const {
    users,
    usersLoading,
    contacts,
    contactsLoading,
    proposals,
    proposalsLoading,
    setContacts,
    setProposals
  } = useAdminData();
  
  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      setBlogPostsLoading(true);
      try {
        const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const posts: any[] = [];
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setBlogPostsLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, [activeTab]);
  
  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      setResourcesLoading(true);
      try {
        const q = query(collection(db, 'resources'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const resourcesList: any[] = [];
        querySnapshot.forEach((doc) => {
          resourcesList.push({ id: doc.id, ...doc.data() });
        });
        setResources(resourcesList);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setResourcesLoading(false);
      }
    };
    
    fetchResources();
  }, [activeTab]);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
      setIsFormOpen(false);
      setSelectedProject(null);
  }
  
  const handleDeleteProject = async (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      // Call the delete API
      const response = await fetch(`/api/admin/delete-project?id=${projectToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      // Close the dialog and refresh the projects list
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting project:', error);
      // Close the dialog and show error
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
      alert('Failed to delete project. Please try again.');
    }
  };

  const cancelDeleteProject = () => {
    setIsDeleteDialogOpen(false);
    setProjectToDelete(null);
  };
  
  const handleViewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsProposalModalOpen(true);
  };

  // Update contact status
  const updateContactStatus = async (contactId: string, status: Contact['status']) => {
    try {
      await updateDoc(doc(db, 'contacts', contactId), { status });
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? { ...contact, status } : contact
      ));
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  // Update proposal status
  const updateProposalStatus = async (proposalId: string, status: Proposal['status']) => {
    try {
      await updateDoc(doc(db, 'proposals', proposalId), { status });
      setProposals(prev => prev.map(proposal => 
        proposal.id === proposalId ? { ...proposal, status } : proposal
      ));
    } catch (error) {
      console.error('Error updating proposal status:', error);
    }
  };

  // Delete blog post
  const deleteBlogPost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'blog', postId));
      setBlogPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Failed to delete blog post. Please try again.');
    }
  };

  // Delete resource
  const deleteResource = async (resourceId: string) => {
    try {
      await deleteDoc(doc(db, 'resources', resourceId));
      setResources(prev => prev.filter(resource => resource.id !== resourceId));
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource. Please try again.');
    }
  };


  // Calculate statistics
  const totalProjects = projects.length;
  const totalTags = [...new Set(projects.flatMap(project => project.tags))].length;
  const latestProject = projects.length > 0 ? projects[projects.length - 1] : null;
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.admin).length;
  const totalContacts = contacts.length;
  const newContacts = contacts.filter(contact => contact.status === 'new').length;
  const totalProposals = proposals.length;
  const newProposals = proposals.filter(proposal => proposal.status === 'new').length;

  // Prepare data for charts
  const tagDistributionData = useMemo(() => {
    const tagCount: Record<string, number> = {};
    
    projects.forEach(project => {
      project.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [projects]);

  const projectTimelineData = useMemo(() => {
    // For simplicity, we'll create a timeline based on index
    // In a real app, you would use actual creation dates
    const data = [];
    for (let i = 0; i < Math.min(projects.length, 12); i++) {
      data.push({
        month: `Project ${i + 1}`,
        count: i + 1
      });
    }
    return data;
  }, [projects]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <>
    <div className="space-y-8">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">Projects in portfolio</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">{newContacts} new</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProposals}</div>
            <p className="text-xs text-muted-foreground">{newProposals} new</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Tags</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTags}</div>
            <p className="text-xs text-muted-foreground">Different categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">Admin accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'projects'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } whitespace-nowrap`}
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Projects
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'users'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } whitespace-nowrap`}
        >
          <Users className="mr-2 h-4 w-4" />
          Users
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'contacts'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } whitespace-nowrap`}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Contacts
          {newContacts > 0 && (
            <span className="ml-1 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
              {newContacts}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'proposals'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } whitespace-nowrap`}
        >
          <FileText className="mr-2 h-4 w-4" />
          Proposals
          {newProposals > 0 && (
            <span className="ml-1 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
              {newProposals}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'chat'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } whitespace-nowrap`}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat History
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'analytics'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } whitespace-nowrap`}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'blog'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } whitespace-nowrap`}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Blog Posts
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'resources'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } whitespace-nowrap`}
        >
          <File className="mr-2 h-4 w-4" />
          Resources
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'projects' ? (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex justify-end">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{selectedProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                </DialogHeader>
                <ProjectForm project={selectedProject} onFormSubmit={handleFormClose} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Projects List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDeleteProject} />
          )}
        </div>
      ) : activeTab === 'users' ? (
        <div className="space-y-6">
          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage registered users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No users found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">No users have registered yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.admin 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                          }`}>
                            {user.admin ? 'Admin' : 'User'}
                          </span>
                        </TableCell>
                        <TableCell>{user.createdAt || 'Unknown'}</TableCell>
                        <TableCell className="text-right">
                          <button
                            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                          >
                            Edit
                          </button>
                          <button
                            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed text-destructive hover:text-destructive"
                            disabled
                          >
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : activeTab === 'contacts' ? (
        <div className="space-y-6">
          {/* Contacts List */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
              <CardDescription>Manage contact form submissions and inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              {contactsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No contacts found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">No contact messages have been received yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {contact.email}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate" title={contact.message}>
                            {contact.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {contact.createdAt.toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            contact.status === 'new' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                              : contact.status === 'read'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          }`}>
                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {contact.status === 'new' && (
                              <button
                                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                                onClick={() => updateContactStatus(contact.id, 'read')}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                              onClick={() => updateContactStatus(contact.id, contact.status === 'replied' ? 'read' : 'replied')}
                            >
                              {contact.status === 'replied' ? 'Unmark' : 'Mark Replied'}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : activeTab === 'proposals' ? (
        <div className="space-y-6">
          {/* Proposals List */}
          <Card>
            <CardHeader>
              <CardTitle>Project Proposals</CardTitle>
              <CardDescription>Manage generated proposals and client requests</CardDescription>
            </CardHeader>
            <CardContent>
              {proposalsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : proposals.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No proposals found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">No proposals have been generated yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposals.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell className="font-medium">{proposal.clientName}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{proposal.projectName}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs" title={proposal.projectDescription}>
                              {proposal.projectDescription}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            {proposal.projectBudget}
                          </div>
                        </TableCell>
                        <TableCell>{proposal.projectTimeline}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {proposal.createdAt.toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            proposal.status === 'new' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                              : proposal.status === 'reviewed'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          }`}>
                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {proposal.status === 'new' && (
                              <button
                                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                                onClick={() => updateProposalStatus(proposal.id, 'reviewed')}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                              onClick={() => updateProposalStatus(proposal.id, proposal.status === 'sent' ? 'reviewed' : 'sent')}
                            >
                              {proposal.status === 'sent' ? 'Mark Unsent' : 'Mark Sent'}
                            </button>
                            <button
                              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                              onClick={() => handleViewProposal(proposal)}
                            >
                              View
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : activeTab === 'blog' ? (
        <div className="space-y-6">
          {/* Blog Posts Action Bar */}
          <div className="flex justify-end">
            <Dialog open={isBlogPostFormOpen} onOpenChange={setIsBlogPostFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setSelectedBlogPost(null);
                  setIsBlogPostFormOpen(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{selectedBlogPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
                </DialogHeader>
                <BlogPostForm blogPost={selectedBlogPost} onFormSubmit={() => {
                  setIsBlogPostFormOpen(false);
                  setSelectedBlogPost(null);
                }} />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Blog Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Manage your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              {blogPostsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No blog posts found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Get started by creating a new blog post.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                              onClick={() => {
                                setSelectedBlogPost(post);
                                setIsBlogPostFormOpen(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this blog post?')) {
                                  deleteBlogPost(post.id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : activeTab === 'resources' ? (
        <div className="space-y-6">
          {/* Resources Action Bar */}
          <div className="flex justify-end">
            <Dialog open={isResourceFormOpen} onOpenChange={setIsResourceFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setSelectedResource(null);
                  setIsResourceFormOpen(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{selectedResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
                </DialogHeader>
                <ResourceForm resource={selectedResource} onFormSubmit={() => {
                  setIsResourceFormOpen(false);
                  setSelectedResource(null);
                }} />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Resources List */}
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Manage your resources</CardDescription>
            </CardHeader>
            <CardContent>
              {resourcesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : resources.length === 0 ? (
                <div className="text-center py-8">
                  <File className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No resources found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Get started by creating a new resource.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell>{resource.author}</TableCell>
                        <TableCell>{resource.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                              onClick={() => {
                                setSelectedResource(resource);
                                setIsResourceFormOpen(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this resource?')) {
                                  deleteResource(resource.id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tag Distribution Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Projects by Tag</CardTitle>
                <CardDescription>Distribution of projects across different categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {tagDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tagDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={(props) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`}
                      >
                        {tagDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Timeline Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Project Growth</CardTitle>
                <CardDescription>Cumulative number of projects over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {projectTimelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectTimelineData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Total Projects" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tag Distribution Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tag Distribution</CardTitle>
              <CardDescription>Number of projects per tag</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {tagDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tagDistributionData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 40,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Projects" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    
    <ProposalModal
      proposal={isProposalModalOpen ? selectedProposal : null}
      open={isProposalModalOpen}
      onClose={() => setIsProposalModalOpen(false)}
    />
    
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the project and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDeleteProject}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}