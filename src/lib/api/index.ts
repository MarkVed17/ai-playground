export type Repo = {
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

export type User = {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  public_repos: number;
};

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function getData<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      if (res.status === 403)
        return { ok: false, error: "GitHub rate limit reached. Try again later." };
      if (res.status === 404) return { ok: false, error: "Not found" };
      return { ok: false, error: `Request failed (${res.status})` };
    }
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error" };
  }
}

const GITHUB_API = "https://api.github.com";

export async function fetchGithubUser(username: string) {
  return getData<User>(`${GITHUB_API}/users/${encodeURIComponent(username)}`);
}

export async function fetchGithubRepos(username: string, pages = 2) {
  const perPage = 100;
  const all: Repo[] = [];
  for (let page = 1; page <= pages; page++) {
    const r = await getData<Repo[]>(
      `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );
    if (!r.ok) return r as ApiResult<Repo[]>;
    all.push(...r.data);
    if (r.data.length < perPage) break;
  }
  return { ok: true, data: all } as const;
}
