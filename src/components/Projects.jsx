import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';

const Projects = ({ projects = [], gitHubUsername }) => {
  const [projectList, setProjectList] = useState(projects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Reset project list when projects prop changes
  useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  // Fetch GitHub projects if username is provided (for real-time updates)
  useEffect(() => {
    const fetchGitHubProjects = async () => {
      if (!gitHubUsername) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(
          `https://api.github.com/users/${gitHubUsername}/repos?sort=updated&per_page=4`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub repositories');
        }
        
        const repos = await response.json();
        
        // Transform GitHub repos to project format
        const updatedProjects = repos.map(repo => ({
          id: repo.id,
          title: repo.name,
          description: repo.description || 'No description provided',
          image: null, // No image from GitHub API
          githubLink: repo.html_url
        }));
        
        setProjectList(updatedProjects);
      } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        setError('Error loading GitHub projects. Using cached project data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGitHubProjects();
  }, [gitHubUsername]);

  return (
    <div className="section bg-secondary/30">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
            My Work
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-4">
            Featured Projects
          </h2>
          {gitHubUsername && (
            <p className="text-foreground/70">
              Showing latest projects from GitHub (@{gitHubUsername})
            </p>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8 max-w-2xl mx-auto text-center">
            {error}
          </div>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Projects Grid */}
        {projectList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectList.map((project, index) => (
              <div
                key={project.id || index}
                className="transition-all duration-200"
              >
                <div className="group relative h-full border-2 border-transparent hover:border-primary/30 rounded-lg">
                  <ProjectCard 
                    project={project}
                    index={index}
                    className="h-full transition-all hover:shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70">No projects added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;