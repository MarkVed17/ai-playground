import React from 'react';
import { RepositoryCardProps } from '../types';
import { classNames, getLanguageColor, formatNumber, formatDate } from '../utils';

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo, className }) => {
  const languageColor = getLanguageColor(repo.language || '');

  return (
    <article
      className={classNames(
        "bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2",
        className
      )}
    >
      {/* Repository Header */}
      <header className="flex items-start space-x-3 mb-4">
        {/* Language Icon */}
        <div 
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"
          aria-hidden="true"
        >
          <div className={classNames("w-6 h-6 sm:w-8 sm:h-8 rounded", languageColor.bgClass)}></div>
        </div>

        {/* Repository Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 truncate">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 focus:text-green-700 focus:outline-none focus:underline transition-colors duration-200"
                aria-describedby={`repo-${repo.id}-description`}
              >
                {repo.name}
              </a>
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
            {repo.full_name}
          </p>
        </div>
      </header>

      {/* Repository Description */}
      {repo.description && (
        <div className="mb-4">
          <p 
            id={`repo-${repo.id}-description`}
            className="text-gray-700 text-sm leading-relaxed line-clamp-3"
          >
            {repo.description}
          </p>
        </div>
      )}

      {/* Repository Tags */}
      <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Repository tags">
        {repo.language && (
          <span 
            className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-medium"
            role="listitem"
          >
            #{repo.language.toLowerCase()}
          </span>
        )}
        {repo.private && (
          <span 
            className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-medium"
            role="listitem"
            aria-label="Private repository"
          >
            #private
          </span>
        )}
        {repo.fork && (
          <span 
            className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-medium"
            role="listitem"
            aria-label="Forked repository"
          >
            #fork
          </span>
        )}
        {repo.archived && (
          <span 
            className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md font-medium"
            role="listitem"
            aria-label="Archived repository"
          >
            #archived
          </span>
        )}
      </div>

      {/* Repository Stats */}
      <footer className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div 
            className="flex items-center"
            aria-label={`${formatNumber(repo.stargazers_count)} stars`}
          >
            <span className="text-gray-900 mr-1" aria-hidden="true">⭐</span>
            <span className="font-medium">{formatNumber(repo.stargazers_count)}</span>
            <span className="sr-only">stars</span>
          </div>
          <div 
            className="flex items-center"
            aria-label={`${formatNumber(repo.forks_count)} forks`}
          >
            <span className="text-gray-900 mr-1" aria-hidden="true">⑃</span>
            <span className="font-medium">{formatNumber(repo.forks_count)}</span>
            <span className="sr-only">forks</span>
          </div>
          <div 
            className="flex items-center"
            aria-label={`Last updated ${formatDate(repo.updated_at)}`}
          >
            <span className="text-gray-900 mr-1" aria-hidden="true">📅</span>
            <span className="font-medium hidden sm:inline">{formatDate(repo.updated_at)}</span>
            <span className="font-medium sm:hidden">
              {new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="sr-only">last updated</span>
          </div>
        </div>

        {/* External link indicator */}
        <div className="flex items-center text-xs text-gray-400">
          <span aria-hidden="true">↗</span>
          <span className="sr-only">External link to GitHub repository</span>
        </div>
      </footer>
    </article>
  );
};

export default RepositoryCard;