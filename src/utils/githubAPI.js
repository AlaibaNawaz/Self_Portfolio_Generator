
/**
 * Fetches GitHub repositories for a given username
 * @param {string} username - GitHub username
 * @param {number} limit - Maximum number of repositories to fetch (default: 4)
 * @returns {Promise<Array>} - Array of repository objects
 */
export const fetchGitHubRepos = async (username, limit = 4) => {
  if (!username) {
    throw new Error('GitHub username is required');
  }
  
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    const repos = await response.json();
    
    // Transform the GitHub API response to a simpler project format
    return repos.map(repo => ({
      id: repo.id,
      title: repo.name,
      description: repo.description || 'No description provided',
      image: null, // GitHub API doesn't provide repository images
      githubLink: repo.html_url
    }));
    
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
};

/**
 * Fetches basic GitHub user information
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - User information object
 */
export const fetchGitHubUserInfo = async (username) => {
  if (!username) {
    throw new Error('GitHub username is required');
  }
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error fetching GitHub user info:', error);
    throw error;
  }
};
