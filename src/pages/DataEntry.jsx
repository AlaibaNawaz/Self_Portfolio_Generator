
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Textarea,
  Label,
  Switch
} from '../components/ui';
import ImageUpload from '../components/ImageUpload';
import { fetchGitHubRepos } from '../utils/githubAPI';
import { useToast } from '../hooks/use-toast';

const DataEntry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    about: '',
    profilePic: null,
    skills: '',
    interests: '',
    projects: [],
    socialLinks: [],
    gitHubUsername: ''
  });
  const [useGitHub, setUseGitHub] = useState(false);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);

  useEffect(() => {
    // Check if data exists in localStorage
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      if (parsedData.gitHubUsername) {
        setUseGitHub(true);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleProfilePicChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          profilePic: e.target.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        profilePic: null
      });
    }
  };

  const fetchGitHubProjects = async () => {
    if (!formData.gitHubUsername) {
      toast({
        title: "GitHub Username Required",
        description: "Please enter a GitHub username to fetch projects",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingGitHub(true);
    try {
      const repos = await fetchGitHubRepos(formData.gitHubUsername);
      
      // Transform GitHub repos to match our project format
      const projects = repos.map(repo => ({
        title: repo.title,
        description: repo.description,
        image: null,
        githubUrl: repo.githubLink
      }));
      
      setFormData(prev => ({
        ...prev,
        projects
      }));
      
      toast({
        title: "Projects Fetched",
        description: `Successfully loaded ${projects.length} projects from GitHub`
      });
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch GitHub repositories. Please check the username and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingGitHub(false);
    }
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { title: '', description: '', image: null, githubUrl: '' }
      ]
    });
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index][field] = value;
    setFormData({
      ...formData,
      projects: updatedProjects
    });
  };

  const handleProjectImageChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index].image = e.target.result;
        setFormData({
          ...formData,
          projects: updatedProjects
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProject = (index) => {
    const updatedProjects = [...formData.projects];
    updatedProjects.splice(index, 1);
    setFormData({
      ...formData,
      projects: updatedProjects
    });
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [
        ...formData.socialLinks,
        { name: '', url: '' }
      ]
    });
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index][field] = value;
    setFormData({
      ...formData,
      socialLinks: updatedLinks
    });
  };

  const removeSocialLink = (index) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks.splice(index, 1);
    setFormData({
      ...formData,
      socialLinks: updatedLinks
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('portfolioData', JSON.stringify(formData));
    toast({
      title: "Portfolio Saved",
      description: "Your portfolio has been saved successfully."
    });
    navigate('/preview');
  };

  const toggleGitHubProjects = () => {
    setUseGitHub(!useGitHub);
    if (!useGitHub && formData.gitHubUsername) {
      fetchGitHubProjects();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create Your Portfolio</h1>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Web Developer & Designer"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="profilePic">Profile Picture</Label>
                <ImageUpload
                  onImageSelected={handleProfilePicChange}
                  existingImage={formData.profilePic}
                  className="h-40"
                />
              </div>
              
              <div>
                <Label htmlFor="about">About Me</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="HTML, CSS, JavaScript, React"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="interests">Interests (comma separated)</Label>
                <Input
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="Coding, Reading, Travel, Photography"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="useGitHub"
                  checked={useGitHub}
                  onCheckedChange={toggleGitHubProjects}
                />
                <Label htmlFor="useGitHub">Use GitHub Projects</Label>
              </div>
              
              {useGitHub && (
                <div className="flex items-center gap-4">
                  <Input
                    name="gitHubUsername"
                    value={formData.gitHubUsername}
                    onChange={handleChange}
                    placeholder="GitHub Username"
                    className="w-40 md:w-60"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={fetchGitHubProjects}
                    disabled={isLoadingGitHub}
                  >
                    {isLoadingGitHub ? 'Loading...' : 'Fetch Projects'}
                  </Button>
                </div>
              )}
            </div>
            
            {!useGitHub && (
              <>
                {formData.projects.map((project, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-md">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">Project {index + 1}</h3>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeProject(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor={`project-title-${index}`}>Title</Label>
                        <Input
                          id={`project-title-${index}`}
                          value={project.title}
                          onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                          placeholder="Project Title"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`project-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`project-desc-${index}`}
                          value={project.description}
                          onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                          placeholder="Project Description"
                          rows={3}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`project-image-${index}`}>Project Image</Label>
                        <ImageUpload
                          onImageSelected={(file) => handleProjectImageChange(index, file)}
                          existingImage={project.image}
                          className="h-40"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`project-github-${index}`}>GitHub URL</Label>
                        <Input
                          id={`project-github-${index}`}
                          value={project.githubUrl}
                          onChange={(e) => handleProjectChange(index, 'githubUrl', e.target.value)}
                          placeholder="https://github.com/yourusername/project"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addProject}
                  className="w-full"
                >
                  Add Project
                </Button>
              </>
            )}

            {useGitHub && formData.projects.length > 0 && (
              <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-foreground/70 mb-2">
                  Showing {formData.projects.length} projects from GitHub.
                </p>
                <p className="text-sm text-foreground/70">
                  You can add project images by switching to manual mode.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-medium">Link {index + 1}</h3>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeSocialLink(index)}
                  >
                    Remove
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor={`social-name-${index}`}>Platform Name</Label>
                    <Input
                      id={`social-name-${index}`}
                      value={link.name}
                      onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                      placeholder="LinkedIn, GitHub, Twitter, etc."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`social-url-${index}`}>URL</Label>
                    <Input
                      id={`social-url-${index}`}
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      placeholder="https://linkedin.com/in/yourusername"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={addSocialLink}
              className="w-full"
            >
              Add Social Link
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={() => navigate('/preview')}>
            Cancel
          </Button>
          <Button type="submit">
            Save and Preview
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DataEntry;
