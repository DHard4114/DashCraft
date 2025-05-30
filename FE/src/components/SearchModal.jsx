import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState([
    'leather wallet', 'handcrafted bag', 'wooden accessories', 
    'custom jewelry', 'artisan gifts', 'premium crafts'
  ]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('dashcraft_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      performSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const performSearch = async (term) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}item/search?q=${encodeURIComponent(term)}&limit=8`
      );
      
      if (response.data.success) {
        setSearchResults(response.data.data.items || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSelect = (item) => {
    // Add to recent searches
    const newRecentSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('dashcraft_recent_searches', JSON.stringify(newRecentSearches));
    
    // Navigate to product
    navigate(`/buy-online/${item.slug}`);
    onClose();
  };

  const handleQuickSearch = (term) => {
    setSearchTerm(term);
    performSearch(term);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Add to recent searches
      const newRecentSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('dashcraft_recent_searches', JSON.stringify(newRecentSearches));
      
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      onClose();
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return 'Rp0';
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-start justify-center pt-16 pb-20">
        <div className="relative bg-white w-full max-w-2xl mx-4 rounded-none border border-gray-200 shadow-2xl">
          
          {/* Search Header */}
          <div className="flex items-center border-b border-gray-200 p-4">
            <Search className="text-gray-400 mr-3" size={24} />
            <form onSubmit={handleSubmit} className="flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products, categories, or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-lg font-lato focus:outline-none"
              />
            </form>
            <button
              onClick={onClose}
              className="ml-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Content */}
          <div className="max-h-96 overflow-y-auto">
            
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {/* Search Results */}
            {!loading && searchResults.length > 0 && (
              <div className="p-4">
                <h3 className="font-lato font-medium text-gray-900 mb-3">Products</h3>
                <div className="space-y-3">
                  {searchResults.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSearchSelect(item)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-none transition-colors text-left"
                    >
                      <img
                        src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-none border border-gray-200"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-lato font-medium text-gray-900">{item.name}</h4>
                        <p className="font-lato text-sm text-gray-600">{item.category}</p>
                      </div>
                      <div className="font-lato font-medium text-gray-900">
                        {formatPrice(item.price)}
                      </div>
                    </button>
                  ))}
                </div>
                
                {searchResults.length >= 8 && (
                  <button
                    onClick={handleSubmit}
                    className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-800 font-lato text-sm"
                  >
                    View all results for "{searchTerm}"
                  </button>
                )}
              </div>
            )}

            {/* No Results */}
            {!loading && searchTerm.length > 2 && searchResults.length === 0 && (
              <div className="p-4 text-center">
                <p className="font-lato text-gray-600">No products found for "{searchTerm}"</p>
                <button
                  onClick={handleSubmit}
                  className="mt-2 text-blue-600 hover:text-blue-800 font-lato text-sm"
                >
                  Search anyway
                </button>
              </div>
            )}

            {/* Recent & Popular Searches */}
            {searchTerm.length <= 2 && (
              <div className="p-4 space-y-6">
                
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="font-lato font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Clock size={16} />
                      Recent Searches
                    </h3>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSearch(search)}
                          className="block w-full text-left px-3 py-2 font-lato text-gray-700 hover:bg-gray-50 rounded-none transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <h3 className="font-lato font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Popular Searches
                  </h3>
                  <div className="space-y-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="block w-full text-left px-3 py-2 font-lato text-gray-700 hover:bg-gray-50 rounded-none transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;