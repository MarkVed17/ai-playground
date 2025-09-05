"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

type GithubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  created_at: string;
};

type GithubRepo = {
  name: string;
  stargazers_count: number;
  language: string | null;
  created_at: string;
  fork: boolean;
  html_url: string;
};

const USERNAME = "MarkVed17";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#14B8A6",
];

export default function DashboardBuilderPage() {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const base = "https://api.github.com";
        const [userRes, repoRes] = await Promise.all([
          fetch(`${base}/users/${encodeURIComponent(USERNAME)}`),
          fetch(
            `${base}/users/${encodeURIComponent(
              USERNAME
            )}/repos?per_page=100&sort=updated`
          ),
        ]);

        if (!userRes.ok) {
          const msg = userRes.status === 403 ? "GitHub rate limit reached. Please try again later." : `Failed to load user (${userRes.status})`;
          throw new Error(msg);
        }
        if (!repoRes.ok) {
          const msg = repoRes.status === 403 ? "GitHub rate limit reached. Please try again later." : `Failed to load repos (${repoRes.status})`;
          throw new Error(msg);
        }

        const userJson = (await userRes.json()) as GithubUser;
        const repoJson = (await repoRes.json()) as GithubRepo[];
        if (cancelled) return;
        setUser(userJson);
        setRepos(repoJson || []);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Unexpected error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalStars = useMemo(
    () => repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
    [repos]
  );

  const languageData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of repos) {
      if (!r.language) continue;
      counts.set(r.language, (counts.get(r.language) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [repos]);

  const topStarRepos = useMemo(() => {
    return repos
      .filter((r) => (r.stargazers_count || 0) > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map((r) => ({ name: r.name, stars: r.stargazers_count }));
  }, [repos]);

  const reposByYear = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of repos) {
      const year = new Date(r.created_at).getFullYear().toString();
      counts.set(year, (counts.get(year) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => Number(a.year) - Number(b.year));
  }, [repos]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading GitHub data…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white border rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <p className="text-gray-600 mb-4">We couldn't fetch data for {USERNAME}. This may be due to GitHub API limits.</p>
          <div className="text-sm text-gray-500">Tip: Refresh in a minute or add a GitHub token and proxy the request server-side for higher limits.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">← Back to Dashboards</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GitHub User Dashboard</h1>
          <p className="text-gray-600">Built with Builder.io • Data for <a className="text-indigo-600 underline" href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer">{USERNAME}</a></p>
        </div>

        {user && (
          <div className="bg-white rounded-lg p-6 shadow mb-8">
            <div className="flex items-center gap-6">
              <img src={user.avatar_url} alt={`${user.login} avatar`} className="w-20 h-20 rounded-full border" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a href={user.html_url} target="_blank" rel="noreferrer" className="text-2xl font-semibold text-gray-900 hover:underline">
                    {user.name || user.login}
                  </a>
                  <span className="text-gray-500">@{user.login}</span>
                </div>
                {user.bio && <p className="text-gray-600 mt-1">{user.bio}</p>}
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                  {user.company && <span>🏢 {user.company}</span>}
                  {user.location && <span>📍 {user.location}</span>}
                  {user.blog && (
                    <a className="text-indigo-600 hover:underline" href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer">
                      🔗 Website
                    </a>
                  )}
                  {user.twitter_username && (
                    <a className="text-sky-600 hover:underline" href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noreferrer">
                      𝕏 @{user.twitter_username}
                    </a>
                  )}
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.followers}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.following}</div>
                  <div className="text-xs text-gray-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.public_repos}</div>
                  <div className="text-xs text-gray-500">Public Repos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages (by repo count)</h3>
            {languageData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">No language data</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={languageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {languageData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Top Starred Repositories</h3>
              <div className="text-sm text-gray-500">Total Stars: {totalStars}</div>
            </div>
            {topStarRepos.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">No starred repos</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topStarRepos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-35} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stars" fill="#6366F1" name="Stars" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Repositories Created per Year</h3>
            {reposByYear.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">No repository history</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reposByYear}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="Repos" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository List (latest 10)</h3>
            {repos.length === 0 ? (
              <div className="text-gray-500">No repositories found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {repos.slice(0, 10).map((r) => (
                  <li key={r.html_url} className="py-3 flex items-center justify-between">
                    <div>
                      <a href={r.html_url} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:underline">
                        {r.name}
                      </a>
                      <div className="text-sm text-gray-500">
                        {r.language || "Unknown"} • Created {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">⭐ {r.stargazers_count}</div>
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
