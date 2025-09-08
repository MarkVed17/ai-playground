import { useState, useCallback, useRef, useEffect } from 'react';
import { GitHubUser, GitHubRepo, FormData } from '../types';
import { fetchGitHubData } from '../api/github';
import { processRepositories, validateFormData } from '../utils';

interface UseGitHubDataReturn {
  user: GitHubUser | null;
  repositories: GitHubRepo[];
  filteredRepos: GitHubRepo[];
  isLoading: boolean;
  error: string;
  hasSearched: boolean;
  searchRepositories: (formData: FormData) => Promise<void>;
  updateFilters: (formData: FormData) => void;
  resetData: () => void;
}

export const useGitHubData = (): UseGitHubDataReturn => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Keep track of the current request to prevent race conditions
  const currentRequestRef = useRef<string>('');

  const searchRepositories = useCallback(async (formData: FormData) => {
    const validation = validateFormData(formData.username);
    if (!validation.isValid) {
      setError(validation.error || '');
      return;
    }

    const requestId = Date.now().toString();
    currentRequestRef.current = requestId;

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const { user: userResult, repositories: reposResult } = await fetchGitHubData(formData.username);

      // Check if this is still the current request
      if (currentRequestRef.current !== requestId) {
        return; // Another request has been made, ignore this response
      }

      if (userResult.error) {
        setError(userResult.error);
        setUser(null);
        setRepositories([]);
        setFilteredRepos([]);
        return;
      }

      if (reposResult.error) {
        setError(reposResult.error);
        setUser(userResult.data);
        setRepositories([]);
        setFilteredRepos([]);
        return;
      }

      if (userResult.data && reposResult.data) {
        setUser(userResult.data);
        setRepositories(reposResult.data);
        
        // Process repositories with current form data
        const processed = processRepositories(reposResult.data, {
          keywords: formData.keywords,
          repoTypes: formData.repoTypes,
          minStars: formData.minStars,
          language: formData.language,
          includeArchived: formData.includeArchived,
          sortBy: formData.sortBy,
        });
        
        setFilteredRepos(processed);
      }
    } catch (err) {
      // Only set error if this is still the current request
      if (currentRequestRef.current === requestId) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setUser(null);
        setRepositories([]);
        setFilteredRepos([]);
      }
    } finally {
      // Only stop loading if this is still the current request
      if (currentRequestRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  const updateFilters = useCallback((formData: FormData) => {
    if (repositories.length > 0) {
      const processed = processRepositories(repositories, {
        keywords: formData.keywords,
        repoTypes: formData.repoTypes,
        minStars: formData.minStars,
        language: formData.language,
        includeArchived: formData.includeArchived,
        sortBy: formData.sortBy,
      });
      setFilteredRepos(processed);
    }
  }, [repositories]);

  const resetData = useCallback(() => {
    // Cancel any ongoing request
    currentRequestRef.current = '';
    
    setUser(null);
    setRepositories([]);
    setFilteredRepos([]);
    setError('');
    setHasSearched(false);
    setIsLoading(false);
  }, []);

  return {
    user,
    repositories,
    filteredRepos,
    isLoading,
    error,
    hasSearched,
    searchRepositories,
    updateFilters,
    resetData,
  };
};