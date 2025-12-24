'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const POPULAR_SEARCHES = [
  { text: 'PSLE Math', url: '/psle-math' },
  { text: 'O-Level Chemistry', url: '/o-level-chemistry' },
  { text: 'A-Level Physics', url: '/a-level-physics' },
  { text: 'Primary English', url: '/english-tuition' },
  { text: 'JC Tuition', url: '/jc-tuition' },
];

const SEARCH_INDEX = [
  // Levels
  { title: 'Primary School Tuition', url: '/primary-school-tuition', keywords: ['primary', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'psle'] },
  { title: 'Secondary School Tuition', url: '/secondary-school-tuition', keywords: ['secondary', 'sec', 'o-level', 'n-level'] },
  { title: 'JC Tuition', url: '/jc-tuition', keywords: ['jc', 'junior college', 'a-level'] },
  
  // Subjects
  { title: 'Math Tuition', url: '/math-tuition', keywords: ['math', 'mathematics', 'maths'] },
  { title: 'English Tuition', url: '/english-tuition', keywords: ['english', 'composition', 'comprehension'] },
  { title: 'Science Tuition', url: '/science-tuition', keywords: ['science', 'physics', 'chemistry', 'biology'] },
  { title: 'Chinese Tuition', url: '/chinese-tuition', keywords: ['chinese', 'mandarin'] },
  
  // Specific
  { title: 'PSLE Math', url: '/psle-math', keywords: ['psle', 'math', 'primary 6'] },
  { title: 'PSLE English', url: '/psle-english', keywords: ['psle', 'english', 'primary 6'] },
  { title: 'PSLE Science', url: '/psle-science', keywords: ['psle', 'science', 'primary 6'] },
  { title: 'O-Level Chemistry', url: '/o-level-chemistry', keywords: ['o-level', 'chemistry', 'secondary'] },
  { title: 'O-Level Physics', url: '/o-level-physics', keywords: ['o-level', 'physics', 'secondary'] },
  { title: 'A-Level Math', url: '/a-level-math', keywords: ['a-level', 'math', 'jc', 'h2'] },
  
  // Resources
  { title: 'Free Test Papers', url: '/free-test-papers', keywords: ['test papers', 'exam papers', 'free', 'download'] },
  { title: 'Free Notes', url: '/free-notes', keywords: ['notes', 'revision', 'free', 'study'] },
  { title: 'Tuition Rates', url: '/tuition-rates', keywords: ['rates', 'pricing', 'cost', 'fees'] },
];

export default function SmartSearch({ isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  // Search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = SEARCH_INDEX.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      );
      return titleMatch || keywordMatch;
    }).slice(0, 5);

    setResults(filtered);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearch = (url, title) => {
    // Save to recent searches
    const updated = [
      { text: title, url },
      ...recentSearches.filter(s => s.url !== url)
    ].slice(0, 5);
    
    setRecentSearches(updated);
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }

    router.push(url);
    setIsOpen(false);
    setQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button/Input */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white hover:bg-background-subtle transition-colors ${
          isMobile ? 'w-full' : ''
        }`}
      >
        <Search className="w-4 h-4 text-text-default/60" />
        <span className="text-sm text-text-default/60">Search subjects, levels...</span>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-primary" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for subjects, levels, or resources..."
                    className="flex-1 text-lg outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-1 hover:bg-background-subtle rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.trim().length >= 2 ? (
                  // Search Results
                  results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(result.url, result.title)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-background-subtle rounded-lg transition-colors text-left"
                        >
                          <Search className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-base text-text-default">{result.title}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-text-default/60">
                      <p>No results found for "{query}"</p>
                      <p className="text-sm mt-2">Try searching for subjects like "Math" or levels like "PSLE"</p>
                    </div>
                  )
                ) : (
                  // Default View
                  <div className="p-4 space-y-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-text-default/70 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Recent Searches
                          </h3>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-primary hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearch(search.url, search.text)}
                              className="w-full flex items-center gap-3 p-2 hover:bg-background-subtle rounded-lg transition-colors text-left"
                            >
                              <Clock className="w-4 h-4 text-text-default/40 flex-shrink-0" />
                              <span className="text-sm text-text-default">{search.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <h3 className="text-sm font-semibold text-text-default/70 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search.url, search.text)}
                            className="px-3 py-1.5 bg-background-subtle hover:bg-primary/10 rounded-full text-sm text-text-default transition-colors"
                          >
                            {search.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Tip */}
              <div className="p-3 bg-background-subtle border-t border-border">
                <p className="text-xs text-text-default/60 text-center">
                  💡 Tip: Try searching for "PSLE", "O-Level", or specific subjects
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
