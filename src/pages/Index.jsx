
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [hasData, setHasData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if portfolio data exists in localStorage
    const portfolioData = localStorage.getItem('portfolioData');
    setHasData(!!portfolioData);
    setIsLoading(false);

    // Redirect based on whether data exists
    if (portfolioData) {
      navigate('/preview');
    } else {
      navigate('/edit');
    }
  }, [navigate]);

  // Showing a loading screen while checking for data
  if (isLoading || hasData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return null; // The useEffect will redirect, so we don't need to render anything
};

export default Index;
