
import React, { useState, useEffect } from 'react';

const Navbar = ({ name = 'Portfolio' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('#mobile-menu') && !event.target.closest('#menu-toggle')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };
  
  return (
    <nav 
      className={`fixed w-full z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-lg shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo/Name */}
          <a 
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="text-xl font-medium"
          >
            {name.split(' ')[0]}
            <span className="text-primary">.</span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {['home', 'about', 'projects', 'contact'].map((item) => (
              <a 
                key={item}
                href={`#${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item);
                }}
                className="link-underline capitalize"
              >
                {item}
              </a>
            ))}
          </div>
          
          {/* Mobile Menu Toggle */}
          <button
            id="menu-toggle"
            className="md:hidden flex items-center p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="w-6 flex flex-col justify-center items-center">
              <span 
                className={`block w-full h-0.5 bg-current transform transition-all duration-300 ease-out ${
                  isMenuOpen ? 'rotate-45 translate-y-1' : ''
                }`}
              ></span>
              <span 
                className={`block w-full h-0.5 bg-current mt-1.5 transform transition-all duration-300 ease-out ${
                  isMenuOpen ? '-rotate-45 -translate-y-1' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-full left-0 w-full transition-all duration-300 ease-in-out transform ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="bg-background/95 backdrop-blur-lg shadow-lg py-4">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col space-y-4">
              {['home', 'about', 'projects', 'contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item);
                  }}
                  className="py-2 px-4 capitalize hover:bg-primary/5 rounded-lg"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
