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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-green-500 text-white p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-wider">GITXPLORE</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <TextInput
              label="GitHub Username"
              placeholder="Enter GitHub username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder-white/70"
              labelClassName="text-white"
            />
          </div>

          <div>
            <Textarea
              label="Keywords/Topics"
              placeholder="Enter keywords separated by commas (e.g., react, typescript, api)"
              value={formData.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              rows={3}
              className="bg-white/10 border-white/20 text-white placeholder-white/70"
              labelClassName="text-white"
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
              className="text-white"
              labelClassName="text-white"
            />
          </div>

          <div>
            <SelectDropdown
              label="Programming Language"
              options={languageOptions}
              value={formData.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
              placeholder="Select a language"
              className="bg-white/10 border-white/20 text-white placeholder-white/70"
              labelClassName="text-white"
            />
          </div>

          <div>
            <RangeSlider
              label="Minimum Stars"
              min={0}
              max={1000}
              step={10}
              value={formData.minStars}
              onChange={(e) => handleInputChange("minStars", parseInt(e.target.value))}
              formatValue={(value) => `${value}${value === 1000 ? "+" : ""}`}
              className="text-white"
              labelClassName="text-white"
              trackClassName="bg-white/20"
              thumbClassName="bg-white border-2 border-white"
            />
          </div>

          <div>
            <RadioButtonGroup
              name="sortBy"
              label="Sort Repositories By"
              options={sortOptions}
              value={formData.sortBy}
              onChange={(value) => handleInputChange("sortBy", value)}
              className="text-white"
              labelClassName="text-white"
            />
          </div>

          <div>
            <ToggleSwitch
              label="Include Archived Repositories"
              description="Include repositories that have been archived"
              checked={formData.includeArchived}
              onChange={(e) => handleInputChange("includeArchived", e.target.checked)}
              className="text-white"
              labelClassName="text-white"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-300/30 rounded-md">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              loadingText="Searching..."
              disabled={!formData.username.trim()}
              className="bg-white text-green-500 hover:bg-gray-100"
            >
              Search Repositories
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={isLoading}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Search Header - Optional secondary search */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">
              GitHub Repository Finder
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 bg-white">
          {hasSearched && (
            <div>
              {/* User Profile Section */}
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
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-600">
                    {filteredRepos.length} results found in 1 ms
                  </div>
                  <div className="flex items-center space-x-4">
                    <SelectDropdown
                      options={sortOptions.map(opt => ({ 
                        value: opt.value, 
                        label: opt.label === "Stars" ? "Highest rated" : 
                               opt.label === "Forks" ? "Most forked" : 
                               opt.label === "Updated" ? "Recently updated" : opt.label 
                      }))}
                      value={formData.sortBy}
                      onChange={(e) => handleInputChange("sortBy", e.target.value)}
                      placeholder="Highest rated"
                      className="min-w-[150px]"
                    />
                  </div>
                </div>

              {/* Repository Grid */}
              {filteredRepos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {repositories.length === 0
                      ? "No repositories found."
                      : "No repositories match your filters."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      {/* Repository Header */}
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {repo.language === 'JavaScript' && (
                            <div className="w-8 h-8 bg-yellow-400 rounded"></div>
                          )}
                          {repo.language === 'TypeScript' && (
                            <div className="w-8 h-8 bg-blue-500 rounded"></div>
                          )}
                          {repo.language === 'React' && (
                            <div className="w-8 h-8 bg-cyan-400 rounded"></div>
                          )}
                          {repo.language === 'Vue' && (
                            <div className="w-8 h-8 bg-green-500 rounded"></div>
                          )}
                          {!['JavaScript', 'TypeScript', 'React', 'Vue'].includes(repo.language) && (
                            <div className="w-8 h-8 bg-gray-400 rounded"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 font-medium text-lg"
                            >
                              {repo.name}
                            </a>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {repo.full_name}
                          </p>
                        </div>
                      </div>

                      {/* Repository Description */}
                      {repo.description && (
                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                          {repo.description}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.language && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-medium">
                            #{repo.language.toLowerCase()}
                          </span>
                        )}
                        {repo.private && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-medium">
                            #private
                          </span>
                        )}
                        {repo.fork && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-medium">
                            #fork
                          </span>
                        )}
                      </div>

                      {/* Repository Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className="text-gray-900">⭐</span>
                            <span className="ml-1 font-medium">{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-900">⑃</span>
                            <span className="ml-1 font-medium">{repo.forks_count}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-900">👁</span>
                            <span className="ml-1 font-medium">{Math.floor(Math.random() * 1000) + 100}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

                {/* Pagination */}
                {filteredRepos.length > 0 && (
                  <div className="flex items-center justify-center space-x-1 mt-8">
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400">
                      ←
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded font-medium">
                      1
                    </button>
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <button
                        key={num}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                      >
                        {num}
                      </button>
                    ))}
                    <button className="w-8 h-8 flex items-center justify-center text-gray-600">
                      →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && !hasSearched && (
            <div className="p-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubRepositoryFinder;
