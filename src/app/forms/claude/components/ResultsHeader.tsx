import React from 'react';
import { SelectDropdown } from "../../../../components/ui";
import { ResultsHeaderProps } from '../types';
import { SORT_OPTIONS } from '../constants';
import { classNames } from '../utils';

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  count,
  sortBy,
  onSortChange,
  className
}) => {
  const sortOptionsWithLabels = SORT_OPTIONS.map(opt => ({
    value: opt.value,
    label: opt.label === "Stars" ? "Highest rated" :
           opt.label === "Forks" ? "Most forked" :
           opt.label === "Updated" ? "Recently updated" : opt.label
  }));

  return (
    <header className={classNames("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", className)}>
      {/* Results Count */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{count}</span>
        <span> result{count !== 1 ? 's' : ''} found</span>
        <span className="text-gray-400 ml-1">in 1 ms</span>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center space-x-2">
        <label 
          htmlFor="sort-by" 
          className="text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          Sort by:
        </label>
        <SelectDropdown
          id="sort-by"
          options={sortOptionsWithLabels}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          placeholder="Select sorting"
          className="min-w-[150px] text-sm"
          aria-label="Sort repositories by"
        />
      </div>
    </header>
  );
};

export default ResultsHeader;