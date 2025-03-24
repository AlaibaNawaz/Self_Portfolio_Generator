
import React from 'react';

const About = ({ description, skills = [], interests = [], profileImage }) => {
  // Generate a placeholder image if no profile image is provided
  const profileImageUrl = profileImage 
    ? (typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage))
    : 'https://via.placeholder.com/400?text=Profile+Image';
  
  return (
    <div className="section">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
            About Me
          </span>
          <h2 className="text-3xl md:text-4xl font-medium">
            Get to Know Me
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-3"></div>
              <img 
                src={profileImageUrl} 
                alt="Profile" 
                className="rounded-2xl object-cover w-full h-full shadow-lg relative z-10 transform transition-transform duration-500 hover:rotate-[-1deg]"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400?text=Profile+Image';
                }}
              />
            </div>
          </div>
          
          {/* About Content */}
          <div className="order-1 md:order-2">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                {description || 'Add a detailed description about yourself, your background, education, experience, and what drives you professionally.'}
              </p>
              
              {/* Skills */}
              <div>
                <h3 className="text-xl font-medium mb-4">My Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-secondary text-foreground px-3 py-1 rounded-lg text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills listed yet.</p>
                  )}
                </div>
              </div>
              
              {/* Interests */}
              <div>
                <h3 className="text-xl font-medium mb-4">My Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {interests.length > 0 ? (
                    interests.map((interest, index) => (
                      <span 
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No interests listed yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
