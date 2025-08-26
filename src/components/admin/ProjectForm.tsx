"use client";

import { useState } from 'react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProjectFormProps {
  project?: Project | null;
  onFormSubmit: () => void;
}

export function ProjectForm({ project, onFormSubmit }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    tags: project?.tags?.join(', ') || '',
    imageUrl: project?.imageUrl || '',
    projectUrl: project?.projectUrl || '',
    problem: project?.caseStudy?.problem || '',
    solution: project?.caseStudy?.solution || '',
    outcome: project?.caseStudy?.outcome || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onFormSubmit();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter project title"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter project description"
            required
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="React, Node.js, AI"
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <Label htmlFor="projectUrl">Project URL</Label>
          <Input
            id="projectUrl"
            value={formData.projectUrl}
            onChange={(e) => handleChange('projectUrl', e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Case Study</h3>
          
          <div>
            <Label htmlFor="problem">Problem</Label>
            <Textarea
              id="problem"
              value={formData.problem}
              onChange={(e) => handleChange('problem', e.target.value)}
              placeholder="What problem did this project solve?"
            />
          </div>

          <div>
            <Label htmlFor="solution">Solution</Label>
            <Textarea
              id="solution"
              value={formData.solution}
              onChange={(e) => handleChange('solution', e.target.value)}
              placeholder="How did you solve it?"
            />
          </div>

          <div>
            <Label htmlFor="outcome">Outcome</Label>
            <Textarea
              id="outcome"
              value={formData.outcome}
              onChange={(e) => handleChange('outcome', e.target.value)}
              placeholder="What was the result?"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onFormSubmit}>
          Cancel
        </Button>
        <Button type="submit">
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}