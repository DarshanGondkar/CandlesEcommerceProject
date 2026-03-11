import React, { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global search trigger
  useEffect(() => {
    const handleGlobalSearch = () => {
      setIsSearchOpen(true);
      setSearchQuery('');
    };

    window.addEventListener('global-search-open', handleGlobalSearch);
    return () => window.removeEventListener('global-search-open', handleGlobalSearch);
  }, []);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useGlobalSearch = () => useContext(SearchContext);
