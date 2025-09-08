import React from 'react';
import {
  TextInput,
  Textarea,
  CheckboxGroup,
  RadioButtonGroup,
  RangeSlider,
  SelectDropdown,
  ToggleSwitch,
  Button,
} from "../../../../components/ui";
import { SearchFormProps } from '../types';
import { REPO_TYPE_OPTIONS, SORT_OPTIONS, LANGUAGE_OPTIONS, SLIDER_CONFIG } from '../constants';
import { classNames } from '../utils';

const SearchForm: React.FC<SearchFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  onReset,
  isLoading,
  error,
  className
}) => {
  return (
    <div className={classNames(
      "w-full lg:w-80 bg-green-500 text-white p-4 sm:p-6 flex-shrink-0",
      className
    )}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wider">
          GITXPLORE
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        {/* GitHub Username */}
        <div>
          <TextInput
            id="github-username"
            label="GitHub Username"
            placeholder="Enter GitHub username"
            value={formData.username}
            onChange={(e) => onFormChange("username", e.target.value)}
            required
            aria-describedby={error ? "username-error" : undefined}
            className="bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20 focus:border-white/40"
            labelClassName="text-white text-sm font-medium"
          />
        </div>

        {/* Keywords/Topics */}
        <div>
          <Textarea
            id="keywords"
            label="Keywords/Topics"
            placeholder="Enter keywords separated by commas (e.g., react, typescript, api)"
            value={formData.keywords}
            onChange={(e) => onFormChange("keywords", e.target.value)}
            rows={3}
            aria-describedby="keywords-help"
            className="bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20 focus:border-white/40 resize-none"
            labelClassName="text-white text-sm font-medium"
          />
          <div id="keywords-help" className="sr-only">
            Enter keywords separated by commas to filter repositories
          </div>
        </div>

        {/* Repository Types */}
        <div>
          <CheckboxGroup
            name="repoTypes"
            label="Repository Types"
            options={REPO_TYPE_OPTIONS}
            value={formData.repoTypes}
            onChange={(values) => onFormChange("repoTypes", values)}
            orientation="vertical"
            className="text-white"
            labelClassName="text-white text-sm font-medium"
            aria-describedby="repo-types-help"
          />
          <div id="repo-types-help" className="sr-only">
            Select the types of repositories to include in search results
          </div>
        </div>

        {/* Programming Language */}
        <div>
          <SelectDropdown
            id="language"
            label="Programming Language"
            options={LANGUAGE_OPTIONS}
            value={formData.language}
            onChange={(e) => onFormChange("language", e.target.value)}
            placeholder="Select a language"
            className="bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20 focus:border-white/40"
            labelClassName="text-white text-sm font-medium"
            aria-describedby="language-help"
          />
          <div id="language-help" className="sr-only">
            Filter repositories by programming language
          </div>
        </div>

        {/* Minimum Stars */}
        <div>
          <RangeSlider
            id="min-stars"
            label="Minimum Stars"
            min={SLIDER_CONFIG.stars.min}
            max={SLIDER_CONFIG.stars.max}
            step={SLIDER_CONFIG.stars.step}
            value={formData.minStars}
            onChange={(e) => onFormChange("minStars", parseInt(e.target.value))}
            formatValue={(value) => `${value}${value === SLIDER_CONFIG.stars.max ? "+" : ""}`}
            className="text-white"
            labelClassName="text-white text-sm font-medium"
            trackClassName="bg-white/20 h-2 rounded-full"
            thumbClassName="bg-white border-2 border-white w-5 h-5 rounded-full shadow-lg focus:ring-2 focus:ring-white/50"
            aria-describedby="stars-help"
          />
          <div id="stars-help" className="sr-only">
            Set minimum number of GitHub stars for repositories
          </div>
        </div>

        {/* Sort By */}
        <div>
          <RadioButtonGroup
            name="sortBy"
            label="Sort Repositories By"
            options={SORT_OPTIONS}
            value={formData.sortBy}
            onChange={(value) => onFormChange("sortBy", value)}
            className="text-white"
            labelClassName="text-white text-sm font-medium"
            aria-describedby="sort-help"
          />
          <div id="sort-help" className="sr-only">
            Choose how to sort the repository results
          </div>
        </div>

        {/* Include Archived */}
        <div>
          <ToggleSwitch
            id="include-archived"
            label="Include Archived Repositories"
            description="Include repositories that have been archived"
            checked={formData.includeArchived}
            onChange={(e) => onFormChange("includeArchived", e.target.checked)}
            className="text-white"
            labelClassName="text-white text-sm font-medium"
            aria-describedby="archived-help"
          />
          <div id="archived-help" className="sr-only">
            Toggle to include or exclude archived repositories from results
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            role="alert"
            aria-live="polite"
            id="form-error"
            className="p-3 sm:p-4 bg-red-500/20 border border-red-300/30 rounded-md"
          >
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            loadingText="Searching..."
            disabled={!formData.username.trim() || isLoading}
            className="bg-white text-green-500 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-white/50 transition-colors duration-200 flex-1 sm:flex-none"
            aria-describedby={error ? "form-error" : undefined}
          >
            Search Repositories
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            disabled={isLoading}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 focus:bg-white/30 focus:ring-2 focus:ring-white/50 transition-colors duration-200 flex-1 sm:flex-none"
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;