export const REPO_TYPE_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "forked", label: "Forked" },
] as const;

export const SORT_OPTIONS = [
  { value: "stars", label: "Stars" },
  { value: "forks", label: "Forks" },
  { value: "updated", label: "Updated" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "", label: "All Languages" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
] as const;

export const THEME_COLORS = {
  primary: {
    500: "#10b981", // green-500
    600: "#059669", // green-600
    700: "#047857", // green-700
  },
  background: {
    sidebar: "#10b981", // green-500
    main: "#f9fafb", // gray-50
    card: "#ffffff", // white
  },
  text: {
    primary: "#111827", // gray-900
    secondary: "#6b7280", // gray-500
    white: "#ffffff",
    muted: "#9ca3af", // gray-400
  },
  border: {
    default: "#e5e7eb", // gray-200
    light: "#f3f4f6", // gray-100
  }
} as const;

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;

export const SLIDER_CONFIG = {
  stars: {
    min: 0,
    max: 1000,
    step: 10,
  },
  forks: {
    min: 0,
    max: 10000,
    step: 100,
  }
} as const;

export const API_ENDPOINTS = {
  github: {
    user: (username: string) => `https://api.github.com/users/${username}`,
    repos: (username: string) => `https://api.github.com/users/${username}/repos?per_page=100`,
  }
} as const;

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found",
  FETCH_USER_ERROR: "Failed to fetch user data",
  FETCH_REPOS_ERROR: "Failed to fetch repositories",
  USERNAME_REQUIRED: "Username is required",
  GENERIC_ERROR: "An error occurred",
} as const;

export const LANGUAGE_ICONS: Record<string, { color: string; bgColor: string }> = {
  JavaScript: { color: "#f7df1e", bgColor: "bg-yellow-400" },
  TypeScript: { color: "#3178c6", bgColor: "bg-blue-500" },
  Python: { color: "#3776ab", bgColor: "bg-blue-600" },
  Java: { color: "#ed8b00", bgColor: "bg-orange-500" },
  Go: { color: "#00add8", bgColor: "bg-cyan-500" },
  Rust: { color: "#dea584", bgColor: "bg-orange-400" },
  C: { color: "#a8b9cc", bgColor: "bg-gray-400" },
  "C++": { color: "#00599c", bgColor: "bg-blue-700" },
  Swift: { color: "#fa7343", bgColor: "bg-orange-500" },
  Kotlin: { color: "#7f52ff", bgColor: "bg-purple-500" },
} as const;