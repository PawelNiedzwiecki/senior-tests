import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import './SearchDemo.css';

interface SearchResult {
  id: number;
  title: string;
}

// Simulated API call
const searchAPI = async (query: string): Promise<SearchResult[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!query) return [];

  // Simulated search results
  const allResults = [
    { id: 1, title: 'React Hooks Guide' },
    { id: 2, title: 'TypeScript Basics' },
    { id: 3, title: 'Advanced React Patterns' },
    { id: 4, title: 'State Management with Redux' },
    { id: 5, title: 'Testing React Applications' },
    { id: 6, title: 'React Performance Optimization' },
    { id: 7, title: 'Building Custom Hooks' },
    { id: 8, title: 'React Context API' },
  ];

  return allResults.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
};

export const SearchDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  // TODO 4: Use the useDebounce hook to debounce the search term
  // with a 500ms delay
  const debouncedSearchTerm = searchTerm; // Replace with useDebounce

  // TODO 5: Implement the search effect
  // - Should trigger when debouncedSearchTerm changes
  // - Should handle loading state
  // - Should increment searchCount each time a search is performed
  // - Should update results with the API response
  useEffect(() => {
    // YOUR CODE HERE

  }, [/* add dependencies */]);

  return (
    <div className="search-demo">
      <h1>Search Demo</h1>
      <p className="subtitle">
        Type to search. The API will only be called after you stop typing for 500ms.
      </p>

      <div className="search-stats">
        <span>API calls made: {searchCount}</span>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />

      {isLoading && <div className="loading">Searching...</div>}

      <ul className="results-list">
        {results.map((result) => (
          <li key={result.id} className="result-item">
            {result.title}
          </li>
        ))}
      </ul>

      {!isLoading && debouncedSearchTerm && results.length === 0 && (
        <p className="no-results">No results found for "{debouncedSearchTerm}"</p>
      )}
    </div>
  );
};

export default SearchDemo;
