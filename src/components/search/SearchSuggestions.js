import React from 'react';

const SearchSuggestions = ({ suggestions, isLoading, onSuggestionClick, query }) => {
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.filter(part => part).map((part, i) => (
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        ))}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching...
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">
        No suggestions found
      </div>
    );
  }

  return (
    <div>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center"
        >
          <div className="flex items-center flex-1">
            {/* Suggestion Icon */}
            <div className="mr-3 flex-shrink-0">
              {suggestion.type === 'restaurant' && (
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v2" />
                </svg>
              )}
              {suggestion.type === 'food' && (
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              )}
              {suggestion.type === 'cuisine' && (
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              )}
            </div>
            
            <div className="flex-1">
              <div className="font-medium">
                {highlightText(suggestion.text, query)}
              </div>
              {suggestion.subtitle && (
                <div className="text-xs text-gray-500">
                  {suggestion.subtitle}
                </div>
              )}
            </div>
            
            {suggestion.count && (
              <div className="text-xs text-gray-400 ml-2">
                {suggestion.count} results
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;