import React, { forwardRef } from 'react';

const ProjectCard = forwardRef(({ project, index, ...props }, ref) => {
  const { title, description, image, githubLink } = project;
  
  // Generate a placeholder image if no image is provided
  const projectImageUrl = image 
    ? (typeof image === 'string' ? image : URL.createObjectURL(image))
    : `https://via.placeholder.com/600x400?text=Project+${index + 1}`;

  return (
    <div 
      ref={ref}
      className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
      {...props}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={projectImageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/600x400?text=Project+${index + 1}`;
          }}
        />
      </div>
      
      {/* Project Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-medium mb-2">{title || `Project ${index + 1}`}</h3>
        
        <p className="text-foreground/70 mb-4 flex-1">
          {description || 'No description provided.'}
        </p>
        
        {/* GitHub Link */}
        {githubLink && (
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary/80 mt-auto"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            View on GitHub
          </a>
        )}
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;