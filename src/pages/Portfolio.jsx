import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPortfolioData(parsedData);
      setProjects(parsedData.projects || []);
    } else {
      // Redirect to edit page if no data exists
      navigate('/edit');
    }
  }, [navigate]);
  
  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Handle drag start event
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    // Set drag data for cross-browser compatibility
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    
    // Set a ghost image for dragging (optional)
    const dragEl = e.target;
    if (dragEl) {
      // Add a dragging class for visual feedback
      dragEl.classList.add('opacity-50');
    }
  };
  
  // Handle drag over event
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Mark the target element to show drop intention
    const targetElement = e.currentTarget;
    if (targetElement) {
      targetElement.classList.add('border-2', 'border-primary');
    }
    
    return false;
  };
  
  // Handle drag leave event
  const handleDragLeave = (e) => {
    // Remove visual indication when dragging out
    e.currentTarget.classList.remove('border-2', 'border-primary');
  };
  
  // Handle drop event
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    // Remove any visual indicators
    e.currentTarget.classList.remove('border-2', 'border-primary');
    
    // If nothing being dragged or same position, do nothing
    if (draggedItem === null || draggedItem === dropIndex) {
      return;
    }
    
    // Create a new array with reordered projects
    const newProjects = [...projects];
    const draggedProject = newProjects[draggedItem];
    
    // Remove the dragged item
    newProjects.splice(draggedItem, 1);
    // Insert at new position
    newProjects.splice(dropIndex, 0, draggedProject);
    
    // Update state
    setProjects(newProjects);
    
    // Update the full portfolio data with new projects order
    const updatedPortfolioData = {
      ...portfolioData,
      projects: newProjects
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolioData));
    setPortfolioData(updatedPortfolioData);
    
    // Reset dragged item
    setDraggedItem(null);
  };
  
  // Handle drag end event
  const handleDragEnd = (e) => {
    // Clean up any visual effects
    e.target.classList.remove('opacity-50');
    
    // Reset dragged item
    setDraggedItem(null);
    
    // Remove drag effects from all potential drop targets
    const projectElements = document.querySelectorAll('.project-card');
    projectElements.forEach(el => {
      el.classList.remove('border-2', 'border-primary');
    });
  };
  
  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">{portfolioData.name}</div>
            
            <div className="hidden md:flex space-x-6">
              <a href="#home" className="hover:text-primary">Home</a>
              <a href="#about" className="hover:text-primary">About</a>
              <a href="#projects" className="hover:text-primary">Projects</a>
              <a href="#contact" className="hover:text-primary">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              
              <Button onClick={() => navigate('/edit')} variant="outline" size="sm">
                Edit
              </Button>
              
              <button className="md:hidden" onClick={() => {}}>
                ☰
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section id="home" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center">
            {portfolioData.profilePic && (
              <img 
                src={portfolioData.profilePic} 
                alt={portfolioData.name} 
                className="w-32 h-32 object-cover rounded-full mb-6"
              />
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{portfolioData.name}</h1>
            <p className="text-xl md:text-2xl mb-8">{portfolioData.tagline}</p>
            <Button size="lg" asChild>
              <a href="#projects">View My Work</a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* About Me Section */}
      <section id="about" className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">Who I Am</h3>
              <p className="mb-4">{portfolioData.about}</p>
            </div>
            
            <div className="md:w-1/2 md:pl-12">
              <h3 className="text-xl font-semibold mb-4">My Skills</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {portfolioData.skills.split(',').map((skill, index) => (
                  <span 
                    key={`skill-${index}`}
                    className={`inline-block px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
              
              {portfolioData.interests && (
                <>
                  <h3 className="text-xl font-semibold mb-4 mt-6">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolioData.interests.split(',').map((interest, index) => (
                      <span 
                        key={`interest-${index}`}
                        className={`inline-block px-3 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">My Projects</h2>
          
          {portfolioData.gitHubUsername && (
            <p className="text-center mb-8">
              Showing projects from GitHub: <a 
                href={`https://github.com/${portfolioData.gitHubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @{portfolioData.gitHubUsername}
              </a>
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} project-card 
                  transition-all duration-200 ${draggedItem === index ? 'opacity-50' : 'opacity-100'}
                  cursor-move hover:shadow-xl border-2 border-transparent`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                {project.image && (
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-48 object-cover select-none"
                    draggable={false} // Prevent image dragging to allow card dragging
                  />
                )}
                {!project.image && (
                  <div className={`w-full h-48 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} select-none`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-16 w-16 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                  </div>
                )}
                
                <div className="p-6 select-none">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <span className="text-sm text-gray-500"></span>
                  </div>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {project.description}
                  </p>
                  
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block mt-2 text-blue-500 hover:underline"
                      onClick={(e) => e.stopPropagation()} // Prevent drag when clicking link
                    >
                      View on GitHub →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">Tip: Drag and drop project cards to reorder them</p>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
          
          <div className="max-w-lg mx-auto">
            <form 
              action="https://docs.google.com/forms/d/e/1FAIpQLSeC3604f38_BlZ34BPnATLZ8QE6wAc-TS1w_QmrzXL8KKRQ3w/formResponse" 
              method="POST"
              target="_blank"
              className="space-y-6"
            >
              <div>
                <label 
                  htmlFor="name" 
                  className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Name
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="entry.1360294763" 
                  required 
                  className={`w-full p-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border-none`}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="email" 
                  className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="entry.33018055" 
                  required 
                  className={`w-full p-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border-none`}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="message" 
                  className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Message
                </label>
                <textarea 
                  id="message" 
                  name="entry.2000371473" 
                  required 
                  rows="5" 
                  className={`w-full p-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border-none`}
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`py-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} text-center`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-6 mb-6">
            {portfolioData.socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-primary"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            © {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;