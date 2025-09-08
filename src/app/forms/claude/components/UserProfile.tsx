import React from 'react';
import { UserProfileProps } from '../types';
import { classNames, formatNumber } from '../utils';

const UserProfile: React.FC<UserProfileProps> = ({ user, className }) => {
  return (
    <section
      className={classNames(
        "p-4 sm:p-6 bg-gray-50 border-b border-gray-200",
        className
      )}
      aria-labelledby="user-profile-heading"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar_url}
            alt=""
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-sm"
            loading="lazy"
          />
        </div>

        {/* User Information */}
        <div className="flex-1 min-w-0">
          <div className="space-y-1 sm:space-y-2">
            <h2 
              id="user-profile-heading"
              className="text-xl sm:text-2xl font-semibold text-gray-900 truncate"
            >
              {user.name || user.login}
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600">
              <span className="sr-only">GitHub username: </span>
              @{user.login}
            </p>

            {user.bio && (
              <p className="mt-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                <span className="sr-only">Bio: </span>
                {user.bio}
              </p>
            )}

            {/* User Stats */}
            <div className="mt-3 flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">
                  {formatNumber(user.public_repos)}
                </span>
                <span className="ml-1">
                  {user.public_repos === 1 ? 'repo' : 'repos'}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="font-medium text-gray-900">
                  {formatNumber(user.followers)}
                </span>
                <span className="ml-1">
                  {user.followers === 1 ? 'follower' : 'followers'}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="font-medium text-gray-900">
                  {formatNumber(user.following)}
                </span>
                <span className="ml-1">following</span>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Link */}
        <div className="flex-shrink-0">
          <a
            href={`https://github.com/${user.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            aria-label={`View ${user.name || user.login}'s GitHub profile`}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            View Profile
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;