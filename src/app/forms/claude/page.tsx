"use client";

import React, { useState } from "react";
import {
  TextInput,
  Textarea,
  CheckboxGroup,
  RadioButtonGroup,
  RangeSlider,
  SelectDropdown,
  ToggleSwitch,
  Button,
} from "../../../components/ui";

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
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

interface FormData {
  username: string;
  keywords: string;
  repoTypes: string[];
  sortBy: string;
  minStars: number;
  language: string;
  includeArchived: boolean;
}

const initialFormData: FormData = {
  username: "",
  keywords: "",
  repoTypes: [],
  sortBy: "",
  minStars: 0,
  language: "",
  includeArchived: false,
};

const repoTypeOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "forked", label: "Forked" },
];

const sortOptions = [
  { value: "stars", label: "Stars" },
  { value: "forks", label: "Forks" },
  { value: "updated", label: "Updated" },
];

const languageOptions = [
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
];

const GitHubRepositoryFinder: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setUser(null);
    setRepositories([]);
    setFilteredRepos([]);
    setError("");
    setHasSearched(false);
  };

  const fetchUserData = async (username: string): Promise<GitHubUser> => {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }
      throw new Error("Failed to fetch user data");
    }
    return response.json();
  };

  const fetchRepositories = async (username: string): Promise<GitHubRepo[]> => {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }
    return response.json();
  };

  const filterAndSortRepositories = (repos: GitHubRepo[]): GitHubRepo[] => {
    let filtered = repos.filter((repo) => {
      // Keywords filter
      if (formData.keywords) {
        const keywords = formData.keywords
          .toLowerCase()
          .split(",")
          .map((k) => k.trim());
        const searchText = `${repo.name} ${
          repo.description || ""
        }`.toLowerCase();
        if (!keywords.some((keyword) => searchText.includes(keyword))) {
          return false;
        }
      }

      // Repo type filter
      if (formData.repoTypes.length > 0) {
        const includePublic = formData.repoTypes.includes("public");
        const includePrivate = formData.repoTypes.includes("private");
        const includeForked = formData.repoTypes.includes("forked");

        const typeMatches = [
          includePublic && !repo.private,
          includePrivate && repo.private,
          includeForked && repo.fork,
        ].some(Boolean);

        if (!typeMatches) return false;
      }

      // Minimum stars filter
      if (repo.stargazers_count < formData.minStars) {
        return false;
      }

      // Language filter
      if (
        formData.language &&
        repo.language?.toLowerCase() !== formData.language.toLowerCase()
      ) {
        return false;
      }

      // Include archived filter
      if (!formData.includeArchived && repo.archived) {
        return false;
      }

      return true;
    });

    // Sort repositories
    if (formData.sortBy) {
      filtered.sort((a, b) => {
        switch (formData.sortBy) {
          case "stars":
            return b.stargazers_count - a.stargazers_count;
          case "forks":
            return b.forks_count - a.forks_count;
          case "updated":
            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const [userData, reposData] = await Promise.all([
        fetchUserData(formData.username),
        fetchRepositories(formData.username),
      ]);

      setUser(userData);
      setRepositories(reposData);

      const filtered = filterAndSortRepositories(reposData);
      setFilteredRepos(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setUser(null);
      setRepositories([]);
      setFilteredRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-filter when form data changes
  React.useEffect(() => {
    if (repositories.length > 0) {
      const filtered = filterAndSortRepositories(repositories);
      setFilteredRepos(filtered);
    }
  }, [
    formData.keywords,
    formData.repoTypes,
    formData.minStars,
    formData.language,
    formData.includeArchived,
    formData.sortBy,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              GitHub Repository Finder
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Find and filter GitHub repositories by user
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <TextInput
                  label="GitHub Username"
                  placeholder="Enter GitHub username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Keywords/Topics"
                  placeholder="Enter keywords separated by commas (e.g., react, typescript, api)"
                  value={formData.keywords}
                  onChange={(e) =>
                    handleInputChange("keywords", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div>
                <CheckboxGroup
                  name="repoTypes"
                  label="Repository Types"
                  options={repoTypeOptions}
                  value={formData.repoTypes}
                  onChange={(values) => handleInputChange("repoTypes", values)}
                  orientation="vertical"
                />
              </div>

              <div>
                <RadioButtonGroup
                  name="sortBy"
                  label="Sort Repositories By"
                  options={sortOptions}
                  value={formData.sortBy}
                  onChange={(value) => handleInputChange("sortBy", value)}
                />
              </div>

              <div>
                <RangeSlider
                  label="Minimum Stars"
                  min={0}
                  max={1000}
                  step={10}
                  value={formData.minStars}
                  onChange={(e) =>
                    handleInputChange("minStars", parseInt(e.target.value))
                  }
                  formatValue={(value) =>
                    `${value}${value === 1000 ? "+" : ""}`
                  }
                />
              </div>

              <div>
                <SelectDropdown
                  label="Programming Language"
                  options={languageOptions}
                  value={formData.language}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value)
                  }
                  placeholder="Select a language"
                />
              </div>

              <div className="md:col-span-2">
                <ToggleSwitch
                  label="Include Archived Repositories"
                  description="Include repositories that have been archived"
                  checked={formData.includeArchived}
                  onChange={(e) =>
                    handleInputChange("includeArchived", e.target.checked)
                  }
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                loadingText="Searching..."
                disabled={!formData.username.trim()}
              >
                Search Repositories
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </form>

          {hasSearched && (
            <div className="border-t border-gray-200">
              {user && (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar_url}
                      alt={user.name || user.login}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user.name || user.login}
                      </h2>
                      <p className="text-sm text-gray-600">@{user.login}</p>
                      {user.bio && (
                        <p className="mt-1 text-sm text-gray-700">{user.bio}</p>
                      )}
                      <div className="mt-2 flex space-x-4 text-sm text-gray-600">
                        <span>{user.public_repos} repos</span>
                        <span>{user.followers} followers</span>
                        <span>{user.following} following</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Repositories ({filteredRepos.length})
                  </h3>
                </div>

                {filteredRepos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {repositories.length === 0
                        ? "No repositories found."
                        : "No repositories match your filters."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium truncate"
                              >
                                {repo.name}
                              </a>
                              {repo.private && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Private
                                </span>
                              )}
                              {repo.fork && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Fork
                                </span>
                              )}
                              {repo.archived && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  Archived
                                </span>
                              )}
                            </div>
                            {repo.description && (
                              <p className="mt-1 text-sm text-gray-600">
                                {repo.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              {repo.language && (
                                <span className="flex items-center">
                                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                                  {repo.language}
                                </span>
                              )}
                              <span className="flex items-center">
                                ⭐️ {repo.stargazers_count}
                              </span>
                              <span className="flex items-center">
                                Forks {repo.forks_count}
                              </span>
                              <span>
                                Updated{" "}
                                {new Date(repo.updated_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubRepositoryFinder;
