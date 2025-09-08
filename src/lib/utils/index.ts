import type { Repo } from "../api";

export const formatNumberCompact = (n: number): string => {
  try {
    if (n < 1000) return String(n);
    return Intl.NumberFormat("en", { notation: "compact" }).format(n);
  } catch {
    return String(n);
  }
};

export const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

export type FilterParams = {
  includeArchived: boolean;
  minStars: number;
  language: string;
  filters: { public: boolean; private: boolean; forked: boolean };
  keywords: string[];
};

export const filterRepos = (repos: Repo[], p: FilterParams): Repo[] => {
  return repos.filter((r) => {
    if (!p.includeArchived && r.archived) return false;
    if (p.minStars && (r.stargazers_count || 0) < p.minStars) return false;
    if (p.language && (r.language || "") !== p.language) return false;

    const isPublic = !r.private;
    const typeMatch =
      (p.filters.public && isPublic) ||
      (p.filters.private && r.private) ||
      (p.filters.forked && r.fork);
    if (!typeMatch) return false;

    if (p.keywords.length) {
      const hay = `${r.name} ${r.description ?? ""}`.toLowerCase();
      if (!p.keywords.some((kw) => hay.includes(kw))) return false;
    }

    return true;
  });
};

export type SortValue = "stars" | "forks" | "updated";

export const sortRepos = (repos: Repo[], sortBy: SortValue): Repo[] => {
  const sorted = [...repos];
  sorted.sort((a, b) => {
    if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
    if (sortBy === "forks") return b.forks_count - a.forks_count;
    return (
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  });
  return sorted;
};
