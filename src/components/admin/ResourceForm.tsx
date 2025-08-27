'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Resource {
  id?: string;
  title: string;
  excerpt: string;
 content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
  readTime: string;
  category: string;
  downloadUrl?: string;
}

interface ResourceFormProps {
  resource?: Resource | null;
  onFormSubmit: () => void;
}

export function ResourceForm({ resource, onFormSubmit }: ResourceFormProps) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [readTime, setReadTime] = useState('');
  const [category, setCategory] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setExcerpt(resource.excerpt);
      setContent(resource.content);
      setAuthor(resource.author);
      setDate(resource.date);
      setImageUrl(resource.imageUrl);
      setTags(resource.tags.join(', '));
      setReadTime(resource.readTime);
      setCategory(resource.category);
      setDownloadUrl(resource.downloadUrl || '');
    }
  }, [resource]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resourceData = {
        title,
        excerpt,
        content,
        author,
        date: date || new Date().toISOString().split('T')[0],
        imageUrl,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        readTime,
        category,
        downloadUrl: downloadUrl || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (resource && resource.id) {
        // Update existing resource
        await updateDoc(doc(db, 'resources', resource.id), resourceData);
        toast({
          title: 'Success',
          description: 'Resource updated successfully!',
        });
      } else {
        // Create new resource
        await addDoc(collection(db, 'resources'), resourceData);
        toast({
          title: 'Success',
          description: 'Resource created successfully!',
        });
      }

      onFormSubmit();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast({
        title: 'Error',
        description: 'Failed to save resource. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{resource ? 'Edit Resource' : 'Create New Resource'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resource title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Enter a short excerpt"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the full resource content"
              rows={10}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., design, development, ai"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g., 5 min read"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., guides, templates, tools"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downloadUrl">Download URL (optional)</Label>
              <Input
                id="downloadUrl"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="Enter download URL if applicable"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onFormSubmit}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                resource ? 'Update Resource' : 'Create Resource'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}