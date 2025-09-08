"use client";

import React, { useState, useEffect } from "react";
import { FormData } from './types';
import { useGitHubData } from './hooks/useGitHubData';
import { processRepositories } from './utils';
import {
  SearchForm,
  RepositoryCard,
  UserProfile,
  Pagination,
  ResultsHeader
} from './components';

const initialFormData: FormData = {
  username: "",
  keywords: "",
  repoTypes: [],
  sortBy: "",
  minStars: 0,
  language: "",
  includeArchived: false,
};

const ITEMS_PER_PAGE = 12;

const GitHubRepositoryFinder: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentPage, setCurrentPage] = useState(1);
  
  const {
    user,
    repositories,
    filteredRepos,
    isLoading,
    error,
    hasSearched,
    searchRepositories,
    updateFilters,
    resetData,
  } = useGitHubData();

  const handleInputChange = (field: keyof FormData, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Update filters immediately when form data changes (except username)
    if (field !== 'username' && repositories.length > 0) {
      updateFilters(newFormData);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCurrentPage(1);
    resetData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    await searchRepositories(formData);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Re-filter repositories when form data changes
  useEffect(() => {
    if (repositories.length > 0) {
      updateFilters(formData);
    }
  }, [formData, repositories, updateFilters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRepos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRepos = filteredRepos.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Search Form Sidebar */}
      <SearchForm
        formData={formData}
        onFormChange={handleInputChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
        isLoading={isLoading}
        error={error}
        className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0" role="main">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              GitHub Repository Finder
            </h1>
          </div>
        </header>

        {/* Results Content */}
        <div className="flex-1 bg-white">
          {hasSearched && (
            <>
              {/* User Profile Section */}
              {user && <UserProfile user={user} />}

              <div className="p-4 sm:p-6">
                {/* Results Header */}
                <ResultsHeader
                  count={filteredRepos.length}
                  sortBy={formData.sortBy}
                  onSortChange={(value) => handleInputChange("sortBy", value)}
                />

                {/* Repository Grid or Empty State */}
                {filteredRepos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No repositories found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {repositories.length === 0
                        ? "Try searching for a different user."
                        : "Try adjusting your filters."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Repository Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
                      {paginatedRepos.map((repo) => (
                        <RepositoryCard key={repo.id} repo={repo} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        showPages={9}
                      />
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm">Searching repositories...</span>
              </div>
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && !isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Search GitHub Repositories
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a GitHub username to start exploring repositories.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !hasSearched && (
            <div className="p-4 sm:p-6">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GitHubRepositoryFinder;
