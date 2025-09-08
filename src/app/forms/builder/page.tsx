"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "../../../components/ui/form/Input";
import { Textarea } from "../../../components/ui/form/Textarea";
import { Checkbox } from "../../../components/ui/form/Checkbox";
import { Slider } from "../../../components/ui/form/Slider";
import { Select } from "../../../components/ui/form/Select";
import { Toggle } from "../../../components/ui/form/Toggle";
import { Button } from "../../../components/ui/button/Button";
import { Results } from "../../../components/ui/form/Results";
import { Pagination } from "../../../components/ui/Pagination";
import { LANGUAGE_OPTIONS, SORT_OPTIONS, PER_PAGE } from "../../../lib/constants";
import { filterRepos, sortRepos } from "../../../lib/utils";
import { fetchGithubRepos, fetchGithubUser, type Repo, type User } from "../../../lib/api";

export default function GithubRepositoryFinderPage() {
  const [username, setUsername] = useState("");
  const [keywords, setKeywords] = useState("");
  const [filters, setFilters] = useState({ public: true, private: false, forked: false });
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]["value"]>("stars");
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

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!username.trim()) return;
      setLoading(true);
      setError(null);
      setUser(null);
      setRepos([]);
      setCurrentPage(1);

      const uname = username.trim();
      const u = await fetchGithubUser(uname);
      if (!u.ok) {
        setError(u.error);
        setLoading(false);
        return;
      }
      setUser(u.data);

      const r = await fetchGithubRepos(uname, 2);
      if (!r.ok) {
        setError(r.error);
        setLoading(false);
        return;
      }

      const filtered = filterRepos(r.data, {
        includeArchived,
        minStars,
        language,
        filters,
        keywords: parsedKeywords,
      });
      const sorted = sortRepos(filtered, sortBy as any);
      setRepos(sorted);
      setCurrentPage(1);
      setLoading(false);
    },
    [username, includeArchived, minStars, language, filters, parsedKeywords, sortBy]
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

  const totalPages = useMemo(() => Math.max(1, Math.ceil(repos.length / PER_PAGE)), [repos.length]);
  const currentPageRepos = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return repos.slice(start, start + PER_PAGE);
  }, [repos, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700">
            ← Back to Forms
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4">
            <div className="bg-emerald-600 text-white rounded-xl shadow p-5 lg:sticky lg:top-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <form onSubmit={handleSearch} className="space-y-6">
                <Input
                  label="GitHub Username"
                  placeholder="e.g. vercel"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <Select
                  label="Programming Language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  options={LANGUAGE_OPTIONS}
                  placeholder="Any"
                />

                <Textarea
                  label="Keywords / Topics"
                  placeholder="e.g. next, tailwind, api"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  resize="vertical"
                />

                <div>
                  <p className="block text-sm font-medium text-white mb-2">Repo Type Filters</p>
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
                      description="Private repos require authentication"
                    />
                    <Checkbox
                      label="Forked"
                      checked={filters.forked}
                      onChange={(e) => setFilters((f) => ({ ...f, forked: e.target.checked }))}
                    />
                  </div>
                </div>

                <Slider
                  label="Minimum Stars"
                  min={0}
                  max={1000}
                  step={1}
                  value={minStars}
                  onChange={(e) => setMinStars(Number(e.target.value))}
                  formatValue={(v) => `${v}★`}
                />

                <Toggle
                  label="Include Archived Repos"
                  checked={includeArchived}
                  onChange={(e) => setIncludeArchived(e.currentTarget.checked)}
                />

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={!username.trim() || loading}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                  >
                    Search
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                    className="rounded-lg border-white/60 text-white hover:bg-white/10"
                  >
                    Reset
                  </Button>
                </div>

                {error && (
                  <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm bg-opacity-90">{error}</div>
                )}
              </form>
            </div>
          </aside>

          <main className="lg:col-span-8">
            {user && (
              <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-4 flex items-center gap-4">
                <img src={user.avatar_url} alt={`${user.login} avatar`} className="w-12 h-12 rounded-full border" />
                <div className="flex-1">
                  <a href={user.html_url} target="_blank" rel="noreferrer" className="font-semibold text-gray-900 hover:underline">
                    {user.name || user.login}
                  </a>
                  <div className="text-sm text-gray-500">Public repos: {user.public_repos}</div>
                </div>
              </div>
            )}

            <Results
              repos={repos}
              visibleRepos={currentPageRepos}
              sortBy={sortBy}
              onChangeSort={(v) => setSortBy(v)}
              loading={loading}
            />

            {repos.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
