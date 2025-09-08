import { GitHubUser, GitHubRepo, ApiResponse } from '../types';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants';

/**
 * Generic API fetch wrapper with error handling
 */
async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          data: null,
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          loading: false,
        };
      }
      
      if (response.status === 403) {
        return {
          data: null,
          error: 'API rate limit exceeded. Please try again later.',
          loading: false,
        };
      }

      return {
        data: null,
        error: `HTTP ${response.status}: ${response.statusText}`,
        loading: false,
      };
    }

    const data = await response.json();
    return {
      data,
      error: null,
      loading: false,
    };
  } catch (error) {
    console.error('API fetch error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR,
      loading: false,
    };
  }
}

/**
 * Fetches GitHub user data by username
 */
export async function fetchGitHubUser(username: string): Promise<ApiResponse<GitHubUser>> {
  if (!username.trim()) {
    return {
      data: null,
      error: ERROR_MESSAGES.USERNAME_REQUIRED,
      loading: false,
    };
  }

  try {
    const result = await fetchWithErrorHandling<GitHubUser>(
      API_ENDPOINTS.github.user(username.trim())
    );

    if (result.error && result.error !== ERROR_MESSAGES.USER_NOT_FOUND) {
      result.error = ERROR_MESSAGES.FETCH_USER_ERROR;
    }

    return result;
  } catch (error) {
    return {
      data: null,
      error: ERROR_MESSAGES.FETCH_USER_ERROR,
      loading: false,
    };
  }
}

/**
 * Fetches GitHub repositories for a user
 */
export async function fetchGitHubRepositories(username: string): Promise<ApiResponse<GitHubRepo[]>> {
  if (!username.trim()) {
    return {
      data: null,
      error: ERROR_MESSAGES.USERNAME_REQUIRED,
      loading: false,
    };
  }

  try {
    const result = await fetchWithErrorHandling<GitHubRepo[]>(
      API_ENDPOINTS.github.repos(username.trim())
    );

    if (result.error && result.error !== ERROR_MESSAGES.USER_NOT_FOUND) {
      result.error = ERROR_MESSAGES.FETCH_REPOS_ERROR;
    }

    return result;
  } catch (error) {
    return {
      data: null,
      error: ERROR_MESSAGES.FETCH_REPOS_ERROR,
      loading: false,
    };
  }
}

/**
 * Fetches both user data and repositories in parallel
 */
export async function fetchGitHubData(username: string): Promise<{
  user: ApiResponse<GitHubUser>;
  repositories: ApiResponse<GitHubRepo[]>;
}> {
  const [userResult, reposResult] = await Promise.allSettled([
    fetchGitHubUser(username),
    fetchGitHubRepositories(username),
  ]);

  return {
    user: userResult.status === 'fulfilled' 
      ? userResult.value 
      : { data: null, error: ERROR_MESSAGES.FETCH_USER_ERROR, loading: false },
    repositories: reposResult.status === 'fulfilled' 
      ? reposResult.value 
      : { data: null, error: ERROR_MESSAGES.FETCH_REPOS_ERROR, loading: false },
  };
}

/**
 * Creates a cancel token for request cancellation
 */
export function createCancelToken(): { 
  token: AbortSignal; 
  cancel: () => void; 
} {
  const controller = new AbortController();
  return {
    token: controller.signal,
    cancel: () => controller.abort(),
  };
}