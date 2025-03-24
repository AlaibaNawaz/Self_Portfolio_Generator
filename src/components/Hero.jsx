
import React, { useEffect, useRef } from 'react';

const Hero = ({ name, title, bio }) => {
  const heroRef = useRef(null);
  
  // Initialize the hero animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);
  
  // Scroll to projects section
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background elements - subtle grid lines */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="grid grid-cols-6 h-full">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="border-r border-current"></div>
          ))}
        </div>
        <div className="grid grid-rows-6 h-full w-full absolute top-0">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="border-b border-current"></div>
          ))}
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 z-10 py-16 md:py-24">
        <div 
          ref={heroRef} 
          className="stagger-animate max-w-3xl mx-auto text-center"
        >
          <p className="text-xl md:text-2xl mb-4 font-light text-primary/80">
            Hello, I'm
          </p>
          
          <h1 className="text-5xl md:text-7xl font-medium mb-6">
            {name || 'Your Name'}
          </h1>
          
          <h2 className="text-2xl md:text-3xl mb-8 font-light">
            {title || 'Your Professional Title'}
          </h2>
          
          <p className="text-lg md:text-xl mb-12 text-foreground/80 max-w-2xl mx-auto">
            {bio || 'Your short bio goes here. Introduce yourself and highlight what you do.'}
          </p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={scrollToProjects}
              className="btn-primary"
            >
              View My Work
            </button>
            
            <a 
              href="#contact" 
              className="btn-outline"
              onClick={(e) => {
                e.preventDefault();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-pulse-soft">
          <div className="flex flex-col items-center">
            <span className="text-sm text-foreground/60 mb-2">Scroll</span>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
