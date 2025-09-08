export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  html_url: string;
}

export interface FormData {
  username: string;
  keywords: string;
  repoTypes: string[];
  sortBy: string;
  minStars: number;
  language: string;
  includeArchived: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  keywords?: string;
  repoTypes?: string[];
  minStars?: number;
  language?: string;
  includeArchived?: boolean;
  sortBy?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPages?: number;
}

export interface UserProfileProps {
  user: GitHubUser;
  className?: string;
}

export interface RepositoryCardProps {
  repo: GitHubRepo;
  className?: string;
}

export interface SearchFormProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isLoading: boolean;
  error: string;
  className?: string;
}

export interface ResultsHeaderProps {
  count: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  className?: string;
}