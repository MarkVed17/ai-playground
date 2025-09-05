"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  TextInput,
  Textarea,
  Checkbox,
  RadioButtonGroup,
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

export default function GithubRepositoryFinderPage() {
  const [username, setUsername] = useState("");
  const [keywords, setKeywords] = useState("");
  const [filters, setFilters] = useState({
    public: true,
    private: false,
    forked: false,
  });
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]["value"]>("stars");
  const [minStars, setMinStars] = useState(0);
  const [language, setLanguage] = useState<string>("");
  const [includeArchived, setIncludeArchived] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);

  const parsedKeywords = useMemo(() =>
    keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean),
  [keywords]);

  const fetchAllRepos = useCallback(async (uname: string) => {
    const base = "https://api.github.com";
    // Fetch up to 200 repos (2 pages) to keep demo fast
    const perPage = 100;
    const pages = [1, 2];
    const results: Repo[] = [];
    for (const page of pages) {
      const res = await fetch(`${base}/users/${encodeURIComponent(uname)}/repos?per_page=${perPage}&page=${page}&sort=updated`);
      if (!res.ok) {
        if (res.status === 403) throw new Error("GitHub rate limit reached. Try again later.");
        if (res.status === 404) throw new Error("User not found");
        throw new Error(`Failed to fetch repos (${res.status})`);
      }
      const data = (await res.json()) as Repo[];
      results.push(...data);
      if (data.length < perPage) break;
    }
    return results;
  }, []);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const base = "https://api.github.com";
      const userRes = await fetch(`${base}/users/${encodeURIComponent(username.trim())}`);
      if (!userRes.ok) {
        if (userRes.status === 403) throw new Error("GitHub rate limit reached. Try again later.");
        if (userRes.status === 404) throw new Error("User not found");
        throw new Error(`Failed to fetch user (${userRes.status})`);
      }
      const userData = (await userRes.json()) as User;
      setUser(userData);

      const allRepos = await fetchAllRepos(username.trim());

      // Apply filters
      const filtered = allRepos.filter((r) => {
        if (!includeArchived && r.archived) return false;
        if (minStars && (r.stargazers_count || 0) < minStars) return false;
        if (language && (r.language || "") !== language) return false;

        // Repo type filters
        const isPublic = !r.private;
        const typeMatch = (
          (filters.public && isPublic) ||
          (filters.private && r.private) ||
          (filters.forked && r.fork)
        );
        if (!typeMatch) return false;

        // Keywords in name/description
        if (parsedKeywords.length) {
          const hay = `${r.name} ${r.description ?? ""}`.toLowerCase();
          const anyMatch = parsedKeywords.some((kw) => hay.includes(kw));
          if (!anyMatch) return false;
        }

        return true;
      });

      // Sort
      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
        if (sortBy === "forks") return b.forks_count - a.forks_count;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });

      setRepos(sorted);
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [username, includeArchived, minStars, language, filters, parsedKeywords, sortBy, fetchAllRepos]);

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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800">← Home</Link>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">GitHub Repository Finder</h1>
          <p className="text-gray-600 text-sm">Search and filter public repositories for a GitHub user</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="GitHub Username"
              placeholder="e.g. vercel"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <SelectDropdown
              label="Programming Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={LANGUAGE_OPTIONS}
              placeholder="Any"
            />
          </div>

          <Textarea
            label="Keywords / Topics (comma-separated)"
            placeholder="e.g. next, tailwind, api"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            resize="vertical"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Repo Type Filters</p>
              <div className="space-y-2">
                <Checkbox
                  label="Public"
                  checked={filters.public}
                  onChange={(e) => setFilters((f) => ({ ...f, public: e.target.checked }))}
                />
                <Checkbox
                  label="Private"
                  checked={filters.private}
                  onChange={(e) => setFilters((f) => ({ ...f, private: e.target.checked }))}
                  description="Note: Private repos require authentication and will not appear for other users"
                />
                <Checkbox
                  label="Forked"
                  checked={filters.forked}
                  onChange={(e) => setFilters((f) => ({ ...f, forked: e.target.checked }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <RadioButtonGroup
                name="sortBy"
                label="Sort Repositories By"
                orientation="horizontal"
                options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                value={sortBy}
                onChange={(v) => setSortBy(v as typeof sortBy)}
              />

              <RangeSlider
                label="Minimum Stars"
                min={0}
                max={1000}
                step={1}
                value={minStars}
                onChange={(e) => setMinStars(Number(e.target.value))}
                formatValue={(v) => `${v}★`}
              />

              <ToggleSwitch
                label="Include Archived Repos"
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.currentTarget.checked)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" loading={loading} disabled={!username.trim() || loading}>
              Search
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
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
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 flex items-center gap-4">
              <img src={user.avatar_url} alt={`${user.login} avatar`} className="w-12 h-12 rounded-full border" />
              <div className="flex-1">
                <a href={user.html_url} target="_blank" rel="noreferrer" className="font-semibold text-gray-900 hover:underline">
                  {user.name || user.login}
                </a>
                <div className="text-sm text-gray-500">Public repos: {user.public_repos}</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Results</h2>
              <div className="text-sm text-gray-500">{repos.length} repositories</div>
            </div>
            {loading ? (
              <div className="p-6 text-gray-600">Loading…</div>
            ) : repos.length === 0 ? (
              <div className="p-6 text-gray-500">No repositories match the criteria.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {repos.map((r) => (
                  <li key={r.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="min-w-0 mr-4">
                      <a href={r.html_url} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline break-words">
                        {r.full_name}
                      </a>
                      <div className="text-sm text-gray-500 truncate">{r.description}</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-shrink-0">
                      <span title="Stars">★ {r.stargazers_count}</span>
                      <span>{r.language || "Unknown"}</span>
                      <span title="Updated at">{new Date(r.updated_at).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
