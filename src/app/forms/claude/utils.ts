import { GitHubRepo, FilterConfig } from './types';

/**
 * Formats a number with appropriate suffix (K, M, etc.)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Formats a date to a readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats a slider value for display
 */
export const formatSliderValue = (value: number, max: number): string => {
  if (value === max) {
    return `${formatNumber(value)}+`;
  }
  return formatNumber(value);
};

/**
 * Filters repositories based on the provided criteria
 */
export const filterRepositories = (repos: GitHubRepo[], config: FilterConfig): GitHubRepo[] => {
  return repos.filter((repo) => {
    // Keywords filter
    if (config.keywords) {
      const keywords = config.keywords
        .toLowerCase()
        .split(',')
        .map((k) => k.trim());
      const searchText = `${repo.name} ${repo.description || ''}`.toLowerCase();
      if (!keywords.some((keyword) => searchText.includes(keyword))) {
        return false;
      }
    }

    // Repo type filter
    if (config.repoTypes && config.repoTypes.length > 0) {
      const includePublic = config.repoTypes.includes('public');
      const includePrivate = config.repoTypes.includes('private');
      const includeForked = config.repoTypes.includes('forked');

      const typeMatches = [
        includePublic && !repo.private,
        includePrivate && repo.private,
        includeForked && repo.fork,
      ].some(Boolean);

      if (!typeMatches) return false;
    }

    // Minimum stars filter
    if (config.minStars && repo.stargazers_count < config.minStars) {
      return false;
    }

    // Language filter
    if (
      config.language &&
      repo.language?.toLowerCase() !== config.language.toLowerCase()
    ) {
      return false;
    }

    // Include archived filter
    if (!config.includeArchived && repo.archived) {
      return false;
    }

    return true;
  });
};

/**
 * Sorts repositories based on the specified criteria
 */
export const sortRepositories = (repos: GitHubRepo[], sortBy: string): GitHubRepo[] => {
  const sorted = [...repos];
  
  switch (sortBy) {
    case 'stars':
      return sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case 'forks':
      return sorted.sort((a, b) => b.forks_count - a.forks_count);
    case 'updated':
      return sorted.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    default:
      return sorted;
  }
};

/**
 * Filters and sorts repositories
 */
export const processRepositories = (
  repos: GitHubRepo[],
  config: FilterConfig
): GitHubRepo[] => {
  const filtered = filterRepositories(repos, config);
  return config.sortBy ? sortRepositories(filtered, config.sortBy) : filtered;
};

/**
 * Validates form data
 */
export const validateFormData = (username: string): { isValid: boolean; error?: string } => {
  if (!username.trim()) {
    return { isValid: false, error: 'Username is required' };
  }
  
  // Basic username validation
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
    return { isValid: false, error: 'Invalid GitHub username format' };
  }

  return { isValid: true };
};

/**
 * Debounces a function call
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Generates pagination info
 */
export const getPaginationInfo = (
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
): {
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
} => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    totalPages,
    startIndex,
    endIndex,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };
};

/**
 * Combines CSS class names
 */
export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Gets language color configuration
 */
export const getLanguageColor = (language: string): { color: string; bgClass: string } => {
  const languageColors: Record<string, { color: string; bgClass: string }> = {
    JavaScript: { color: '#f7df1e', bgClass: 'bg-yellow-400' },
    TypeScript: { color: '#3178c6', bgClass: 'bg-blue-500' },
    Python: { color: '#3776ab', bgClass: 'bg-blue-600' },
    Java: { color: '#ed8b00', bgClass: 'bg-orange-500' },
    Go: { color: '#00add8', bgClass: 'bg-cyan-500' },
    Rust: { color: '#dea584', bgClass: 'bg-orange-400' },
    C: { color: '#a8b9cc', bgClass: 'bg-gray-400' },
    'C++': { color: '#00599c', bgClass: 'bg-blue-700' },
    Swift: { color: '#fa7343', bgClass: 'bg-orange-500' },
    Kotlin: { color: '#7f52ff', bgClass: 'bg-purple-500' },
  };

  return languageColors[language] || { color: '#6b7280', bgClass: 'bg-gray-400' };
};