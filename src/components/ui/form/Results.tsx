import React from "react";
import { Select } from "./Select";
import type { Repo } from "../../../lib/api";
import { SORT_OPTIONS } from "../../../lib/constants";
import { formatDate, formatNumberCompact } from "../../../lib/utils";

export type ResultsProps = {
  repos: Repo[];
  visibleRepos: Repo[];
  sortBy: (typeof SORT_OPTIONS)[number]["value"];
  onChangeSort: (v: (typeof SORT_OPTIONS)[number]["value"]) => void;
  loading?: boolean;
};

export const Results: React.FC<ResultsProps> = ({ repos, visibleRepos, sortBy, onChangeSort, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Results</h2>
          <div className="text-sm text-gray-500">{repos.length} repositories</div>
        </div>
        <div className="w-44 sm:w-56">
          <Select
            aria-label="Sort repositories"
            value={sortBy}
            onChange={(e) => onChangeSort(e.target.value as typeof sortBy)}
            options={SORT_OPTIONS.map((o) => ({ value: o.value, label: `Sort: ${o.label}` }))}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-gray-600">Loading…</div>
      ) : repos.length === 0 ? (
        <div className="p-6 text-gray-500">No repositories match the criteria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {visibleRepos.map((r) => (
            <div key={r.id} className="group rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="min-w-0 flex-1">
                <a href={r.html_url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold break-words">
                  {r.full_name}
                </a>
                {r.description && (
                  <div className="text-sm text-gray-600 mt-1 break-words">{r.description}</div>
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
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs">Archived</span>
                  )}
                  {r.language && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {r.language}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-700">
                <span className="inline-flex items-center gap-1" title="Stars">
                  <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.48 3.5a.75.75 0 011.04 0l2.46 2.39c.12.12.28.2.45.23l3.4.49a.75.75 0 01.41 1.28l-2.46 2.4a.75.75 0 00-.22.66l.58 3.39a.75.75 0 01-1.09.79l-3.05-1.6a.75.75 0 00-.7 0l-3.05 1.6a.75.75 0 01-1.09-.79l.58-3.39a.75.75 0 00-.22-.66L4.66 8.29a.75.75 0 01.41-1.28l3.4-.49a.75.75 0 00.45-.23L11.48 3.5z"/></svg>
                  {formatNumberCompact(r.stargazers_count)}
                </span>
                <span className="inline-flex items-center gap-1" title="Forks">
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 3v6a3 3 0 003 3h6a3 3 0 003-3V3M6 21v-6m0 0a3 3 0 013-3h6"/></svg>
                  {formatNumberCompact(r.forks_count)}
                </span>
                <span className="text-gray-500" title="Updated at">{formatDate(r.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
