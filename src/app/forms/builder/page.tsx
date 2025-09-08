"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  TextInput,
  Textarea,
  Checkbox,
  RangeSlider,
  SelectDropdown,
  ToggleSwitch,
  Button,
} from "../../../components/ui";

type Repo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  description: string | null;
  html_url: string;
  updated_at: string;
};

type User = {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  public_repos: number;
};

const LANGUAGE_OPTIONS = [
  { value: "", label: "Any" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Python", label: "Python" },
  { value: "Go", label: "Go" },
  { value: "Rust", label: "Rust" },
  { value: "Java", label: "Java" },
  { value: "C#", label: "C#" },
  { value: "C++", label: "C++" },
  { value: "PHP", label: "PHP" },
];

const SORT_OPTIONS = [
  { value: "stars", label: "Stars" },
  { value: "forks", label: "Forks" },
  { value: "updated", label: "Updated" },
] as const;

const PER_PAGE = 10;

export default function GithubRepositoryFinderPage() {
  const [username, setUsername] = useState("");
  const [keywords, setKeywords] = useState("");
  const [filters, setFilters] = useState({
    public: true,
    private: false,
    forked: false,
  });
  const [sortBy, setSortBy] =
    useState<(typeof SORT_OPTIONS)[number]["value"]>("stars");
  const [minStars, setMinStars] = useState(0);
  const [language, setLanguage] = useState<string>("");
  const [includeArchived, setIncludeArchived] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const parsedKeywords = useMemo(
    () =>
      keywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean),
    [keywords]
  );

  const fetchAllRepos = useCallback(async (uname: string) => {
    const base = "https://api.github.com";
    const perPage = 100;
    const pages = [1, 2];
    const results: Repo[] = [];
    for (const page of pages) {
      const res = await fetch(
        `${base}/users/${encodeURIComponent(
          uname
        )}/repos?per_page=${perPage}&page=${page}&sort=updated`
      );
      if (!res.ok) {
        if (res.status === 403)
          throw new Error("GitHub rate limit reached. Try again later.");
        if (res.status === 404) throw new Error("User not found");
        throw new Error(`Failed to fetch repos (${res.status})`);
      }
      const data = (await res.json()) as Repo[];
      results.push(...data);
      if (data.length < perPage) break;
    }
    return results;
  }, []);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!username.trim()) return;
      setLoading(true);
      setError(null);
      setUser(null);
      setRepos([]);
      setCurrentPage(1);

      try {
        const base = "https://api.github.com";
        const userRes = await fetch(
          `${base}/users/${encodeURIComponent(username.trim())}`
        );
        if (!userRes.ok) {
          if (userRes.status === 403)
            throw new Error("GitHub rate limit reached. Try again later.");
          if (userRes.status === 404) throw new Error("User not found");
          throw new Error(`Failed to fetch user (${userRes.status})`);
        }
        const userData = (await userRes.json()) as User;
        setUser(userData);

        const allRepos = await fetchAllRepos(username.trim());

        const filtered = allRepos.filter((r) => {
          if (!includeArchived && r.archived) return false;
          if (minStars && (r.stargazers_count || 0) < minStars) return false;
          if (language && (r.language || "") !== language) return false;

          const isPublic = !r.private;
          const typeMatch =
            (filters.public && isPublic) ||
            (filters.private && r.private) ||
            (filters.forked && r.fork);
          if (!typeMatch) return false;

          if (parsedKeywords.length) {
            const hay = `${r.name} ${r.description ?? ""}`.toLowerCase();
            const anyMatch = parsedKeywords.some((kw) => hay.includes(kw));
            if (!anyMatch) return false;
          }

          return true;
        });

        const sorted = [...filtered].sort((a, b) => {
          if (sortBy === "stars")
            return b.stargazers_count - a.stargazers_count;
          if (sortBy === "forks") return b.forks_count - a.forks_count;
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        });

        setRepos(sorted);
        setCurrentPage(1);
      } catch (err: any) {
        setError(err?.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    },
    [
      username,
      includeArchived,
      minStars,
      language,
      filters,
      parsedKeywords,
      sortBy,
      fetchAllRepos,
    ]
  );

  const handleReset = useCallback(() => {
    setUsername("");
    setKeywords("");
    setFilters({ public: true, private: false, forked: false });
    setSortBy("stars");
    setMinStars(0);
    setLanguage("");
    setIncludeArchived(false);
    setError(null);
    setUser(null);
    setRepos([]);
    setCurrentPage(1);
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(repos.length / PER_PAGE)),
    [repos.length]
  );

  const currentPageRepos = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return repos.slice(start, start + PER_PAGE);
  }, [repos, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Forms
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            GitHub Repository Finder
          </h1>
          <p className="text-gray-600 text-sm">
            Search and filter public repositories for a GitHub user
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="GitHub Username"
              placeholder="e.g. vercel"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="rounded-lg border-gray-200 focus:ring-blue-600 focus:border-blue-600"
            />

            <SelectDropdown
              label="Programming Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={LANGUAGE_OPTIONS}
              placeholder="Any"
              className="py-2.5 pr-10 rounded-lg border-gray-200 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <Textarea
            label="Keywords / Topics (comma-separated)"
            placeholder="e.g. next, tailwind, api"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            resize="vertical"
            className="rounded-lg border-gray-200 focus:ring-blue-600 focus:border-blue-600"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Repo Type Filters
              </p>
              <div className="space-y-2">
                <Checkbox
                  label="Public"
                  checked={filters.public}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, public: e.target.checked }))
                  }
                />
                <Checkbox
                  label="Private"
                  checked={filters.private}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, private: e.target.checked }))
                  }
                  description="Note: Private repos require authentication and will not appear for other users"
                />
                <Checkbox
                  label="Forked"
                  checked={filters.forked}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, forked: e.target.checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <SelectDropdown
                label="Sort Repositories By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                className="py-2.5 pr-10 rounded-lg border-gray-200 focus:ring-blue-600 focus:border-blue-600"
              />

              <RangeSlider
                label="Minimum Stars"
                min={0}
                max={1000}
                step={1}
                value={minStars}
                onChange={(e) => setMinStars(Number(e.target.value))}
                formatValue={(v) => `${v}★`}
                className="h-2 bg-gray-100 rounded-full [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5"
              />

              <ToggleSwitch
                label="Include Archived Repos"
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.currentTarget.checked)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!username.trim() || loading}
              className="rounded-lg"
            >
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="rounded-lg"
            >
              Reset
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
        </form>

        <div className="mt-6 space-y-4">
          {user && (
            <div className="bg-white rounded-xl shadow border border-gray-200 p-4 flex items-center gap-4">
              <img
                src={user.avatar_url}
                alt={`${user.login} avatar`}
                className="w-12 h-12 rounded-full border"
              />
              <div className="flex-1">
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-gray-900 hover:underline"
                >
                  {user.name || user.login}
                </a>
                <div className="text-sm text-gray-500">Public repos: {user.public_repos}</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Results</h2>
                <div className="text-sm text-gray-500">{repos.length} repositories</div>
              </div>
              <div className="w-56">
                <SelectDropdown
                  aria-label="Sort repositories"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  options={SORT_OPTIONS.map((o) => ({ value: o.value, label: `Sort: ${o.label}` }))}
                  className="py-2.5 pr-10 rounded-lg border-gray-200 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            </div>
            {loading ? (
              <div className="p-6 text-gray-600">Loading…</div>
            ) : repos.length === 0 ? (
              <div className="p-6 text-gray-500">No repositories match the criteria.</div>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {currentPageRepos.map((r) => (
                    <li key={r.id} className="px-4 py-4 sm:px-5 group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <a
                            href={r.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline font-medium break-words"
                          >
                            {r.full_name}
                          </a>
                          {r.description && (
                            <div className="text-sm text-gray-600 mt-1 break-words">
                              {r.description}
                            </div>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {r.private ? "Private" : "Public"}
                            </span>
                            {r.fork && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs">
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 3v6a3 3 0 003 3h6a3 3 0 003-3V3M6 21v-6m0 0a3 3 0 013-3h6"/></svg>
                                Forked
                              </span>
                            )}
                            {r.archived && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs">
                                Archived
                              </span>
                            )}
                            {r.language && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                {r.language}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex items-center gap-4 text-sm text-gray-700">
                          <span className="inline-flex items-center gap-1" title="Stars">
                            <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.48 3.5a.75.75 0 011.04 0l2.46 2.39c.12.12.28.2.45.23l3.4.49a.75.75 0 01.41 1.28l-2.46 2.4a.75.75 0 00-.22.66l.58 3.39a.75.75 0 01-1.09.79l-3.05-1.6a.75.75 0 00-.7 0l-3.05 1.6a.75.75 0 01-1.09-.79l.58-3.39a.75.75 0 00-.22-.66L4.66 8.29a.75.75 0 01.41-1.28l3.4-.49a.75.75 0 00.45-.23L11.48 3.5z"/></svg>
                            {r.stargazers_count}
                          </span>
                          <span className="inline-flex items-center gap-1" title="Forks">
                            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 3v6a3 3 0 003 3h6a3 3 0 003-3V3M6 21v-6m0 0a3 3 0 013-3h6"/></svg>
                            {r.forks_count}
                          </span>
                          <span className="text-gray-500" title="Updated at">
                            {new Date(r.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
