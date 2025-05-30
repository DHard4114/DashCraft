import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, 
  Clock, 
  Target, 
  ShoppingCart, 
  Heart, 
  Filter, 
  Search, 
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  Package,
  Truck,
  Shield,
  Award,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProductDetailModal from '../components/ProductDetailModal';
import Toast from '../components/Toast';

const BuyOnline = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(new Set());
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  
  // UI States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}category`);
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setToast({ 
        show: true, 
        message: 'Failed to load categories', 
        type: 'error' 
      });
    }
  }, []);

  // Fetch Products with Filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (sortBy && sortBy !== 'newest') params.append('sortBy', sortBy);
      if (difficulty) params.append('difficulty', difficulty);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      console.log('API Request URL:', `${import.meta.env.VITE_API}item?${params.toString()}`);

      const response = await axios.get(`${import.meta.env.VITE_API}item?${params.toString()}`);
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        const itemsData = response.data.data || [];
        
        const processedProducts = itemsData.map(product => ({
          ...product,
          imageUrl: product.images && product.images.length > 0 
            ? product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
            : '/placeholder-image.jpg',
          categoryName: product.category?.name || 'Unknown Category',
          creatorName: product.createdBy?.username || 'Unknown Creator',
          rating: product.ratings?.average || 0,
          ratingCount: product.ratings?.count || 0,
          // Mock ecommerce data - dalam production ini harus dari backend
          originalPrice: Math.round(product.price * 1.3),
          discount: Math.floor(Math.random() * 30) + 10,
          stock: Math.floor(Math.random() * 50) + 5,
          sold: Math.floor(Math.random() * 100),
          freeShipping: product.price > 100000,
          tag: getProductTag(product)
        }));
        
        setProducts(processedProducts);
        setTotalPages(response.data.pagination?.pages || Math.ceil(response.data.total / 12) || 1);
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, sortBy, difficulty, priceRange.min, priceRange.max, currentPage]);

  // Get Product Tag
  const getProductTag = (product) => {
    if (product.ratings?.average >= 4.5) return 'Top Rated';
    if (product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) return 'New Arrival';
    if (product.ratings?.count > 50) return 'Best Seller';
    return 'Featured';
  };

  // Fetch Cart Count
  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    
    try {
      // Use the correct cart count endpoint
      const response = await axios.get(`${import.meta.env.VITE_API}cart/count`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      
      if (response.data.success) {
        setCartCount(response.data.data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      // Fallback to getting full cart
      try {
        const cartResponse = await axios.get(`${import.meta.env.VITE_API}cart`, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });
        
        if (cartResponse.data.success && cartResponse.data.data) {
          setCartCount(cartResponse.data.data.totalItems || 0);
        }
      } catch (fallbackError) {
        console.error('Fallback cart fetch failed:', fallbackError);
        setCartCount(0);
      }
    }
  }, [isAuthenticated]);

  // Fetch Wishlist
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    
    try {
      // Use localStorage for wishlist (since no backend endpoint exists yet)
      const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`) || '[]';
      setWishlist(JSON.parse(savedWishlist));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    }
  }, [isAuthenticated, user]);

  // Initial Data Fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCartCount();
    fetchWishlist();
  }, [fetchCartCount, fetchWishlist]);

  // Filter Change Handler with Debounce for Search
  const handleFilterChange = useCallback((filterType, value) => {
    setCurrentPage(1);
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    
    switch (filterType) {
      case 'category':
        setSelectedCategory(value);
        if (value) newSearchParams.set('category', value);
        else newSearchParams.delete('category');
        break;
      case 'search':
        setSearchTerm(value);
        if (value.trim()) newSearchParams.set('search', value.trim());
        else newSearchParams.delete('search');
        break;
      case 'sort':
        setSortBy(value);
        if (value !== 'newest') newSearchParams.set('sort', value);
        else newSearchParams.delete('sort');
        break;
      case 'difficulty':
        setDifficulty(value);
        if (value) newSearchParams.set('difficulty', value);
        else newSearchParams.delete('difficulty');
        break;
    }
    
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  // Debounced search handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== searchParams.get('search')) {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchProducts, searchParams]);

  // Add to Cart - Fixed untuk Backend Schema
  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setToast({ 
        show: true, 
        message: 'Please login to add items to cart', 
        type: 'error' 
      });
      return;
    }

    if (addingToCart.has(product._id)) {
      return; // Prevent double-clicking
    }

    setAddingToCart(prev => new Set([...prev, product._id]));

    try {
      console.log('Adding to cart:', { 
        itemId: product._id, 
        quantity: 1,
        productPrice: product.price 
      });
      
      const response = await axios.post(
        `${import.meta.env.VITE_API}cart/add`,
        {
          itemId: product._id,
          quantity: 1
        },
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Add to cart response:', response.data);

      if (response.data.success) {
        setToast({ 
          show: true, 
          message: 'Item added to cart successfully!', 
          type: 'success' 
        });
        
        // Update cart count from response
        if (response.data.data && response.data.data.totalItems) {
          setCartCount(response.data.data.totalItems);
        } else {
          // Fallback: refresh cart count
          setTimeout(() => {
            fetchCartCount();
          }, 500);
        }
      } else {
        throw new Error(response.data.error || response.data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      let errorMessage = 'Failed to add item to cart';
      
      if (error.response?.status === 401) {
        errorMessage = 'Please login again';
      } else if (error.response?.status === 404) {
        errorMessage = 'Item not found or no longer available';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.error || 'Item is not available';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setToast({ 
        show: true, 
        message: errorMessage, 
        type: 'error' 
      });
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  // Add to Wishlist
  const handleAddToWishlist = (product) => {
    if (!isAuthenticated) {
      setToast({ 
        show: true, 
        message: 'Please login to add to wishlist', 
        type: 'error' 
      });
      return;
    }

    const isInWishlist = wishlist.some(item => item._id === product._id);
    
    let newWishlist;
    if (isInWishlist) {
      newWishlist = wishlist.filter(item => item._id !== product._id);
      setToast({ 
        show: true, 
        message: 'Removed from wishlist', 
        type: 'info' 
      });
    } else {
      newWishlist = [...wishlist, product];
      setToast({ 
        show: true, 
        message: 'Added to wishlist!', 
        type: 'success' 
      });
    }
    
    setWishlist(newWishlist);
    
    // Save to localStorage
    try {
      localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(newWishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  // Format Price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `Rp${price.toLocaleString('id-ID')}`;
    }
    return 'Price unavailable';
  };

  // Get Difficulty Color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'mudah':
      case 'easy':
        return 'bg-green-100 text-green-600';
      case 'sedang':
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'sulit':
      case 'hard':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Clear Filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('newest');
    setDifficulty('');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  // Handle Page Change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header with Cart */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cookie text-6xl font-light text-[#0a0205] mb-2">
              Craft Store
            </h1>
            <p className="font-lato text-gray-600 text-lg">
              Discover and purchase premium craft tutorials and kits
            </p>
          </div>
          
          {/* Cart Icon */}
          {isAuthenticated && (
            <button
              onClick={() => navigate('/cart')}
              className="relative p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-none">
            <Package className="w-8 h-8 text-gray-600" />
            <div>
              <p className="font-lato font-medium text-gray-800">Premium Kits</p>
              <p className="font-lato text-sm text-gray-600">Complete materials included</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-none">
            <Truck className="w-8 h-8 text-gray-600" />
            <div>
              <p className="font-lato font-medium text-gray-800">Free Shipping</p>
              <p className="font-lato text-sm text-gray-600">Orders above Rp100.000</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-none">
            <Shield className="w-8 h-8 text-gray-600" />
            <div>
              <p className="font-lato font-medium text-gray-800">Quality Guarantee</p>
              <p className="font-lato text-sm text-gray-600">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-none">
            <Award className="w-8 h-8 text-gray-600" />
            <div>
              <p className="font-lato font-medium text-gray-800">Expert Tutorials</p>
              <p className="font-lato text-sm text-gray-600">Step-by-step guidance</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-none p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search craft kits..."
                value={searchTerm}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-300 font-lato"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-none px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-gray-300 font-lato"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-none px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-gray-300 font-lato"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-none hover:bg-gray-50 transition-colors font-lato"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            {/* View Toggle */}
            <div className="flex border border-gray-200 rounded-none">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50 transition-colors`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50 transition-colors border-l border-gray-200`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-lato">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 font-lato"
                  >
                    <option value="">All Levels</option>
                    <option value="Mudah">Mudah (Easy)</option>
                    <option value="Sedang">Sedang (Medium)</option>
                    <option value="Sulit">Sulit (Hard)</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-lato">
                    Price Range (Rp)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="flex-1 border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 font-lato"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="flex-1 border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 font-lato"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-gray-200 rounded-none hover:bg-gray-50 transition-colors font-lato"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-lato text-xl font-light text-gray-800">
            Showing {products.length} products
          </h2>
          <div className="text-sm text-gray-500 font-lato">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
            <span className="ml-4 text-gray-600 font-lato text-lg">Loading products...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4 font-lato text-lg">{error}</div>
            <button 
              onClick={fetchProducts}
              className="px-6 py-3 border-2 border-black rounded-none hover:bg-black hover:text-white transition-all duration-300 font-lato"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4 font-lato text-xl">No products found</div>
            <p className="text-gray-400 font-lato mb-6">Try adjusting your search or filters</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-3 border-2 border-black rounded-none hover:bg-black hover:text-white transition-all duration-300 font-lato"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-6'
            }
          `}>
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-none hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-2">
                    <div className="bg-black text-white text-xs px-2 py-1 rounded-none">
                      {product.tag}
                    </div>
                    {product.freeShipping && (
                      <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-none">
                        Free Shipping
                      </div>
                    )}
                  </div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-none">
                    -{product.discount}%
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                        title="Quick View"
                      >
                        <Search size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(product);
                        }}
                        className={`p-3 rounded-full transition-colors shadow-lg ${
                          wishlist.some(item => item._id === product._id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  {/* Category & Creator */}
                  <div className="flex items-center justify-between text-xs text-gray-500 font-lato">
                    <span className="bg-gray-100 px-2 py-1 rounded-none">{product.categoryName}</span>
                    <span>by {product.creatorName}</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-lato text-lg font-medium text-gray-800 line-clamp-2 h-14">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-lato text-gray-600">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-lato">
                      ({product.ratingCount} reviews)
                    </span>
                    <span className="text-xs text-gray-400 font-lato ml-auto">
                      {product.sold} sold
                    </span>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900 font-lato">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500 line-through font-lato">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-none ${getDifficultyColor(product.difficulty)}`}>
                      {product.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-none flex items-center gap-1">
                      <Clock size={12} />
                      {product.estimatedTime || '2-3 hours'}
                    </span>
                  </div>

                  {/* Stock Info */}
                  <div className="text-xs text-gray-500 font-lato">
                    {product.stock > 10 ? (
                      <span className="text-green-600">In Stock ({product.stock} available)</span>
                    ) : product.stock > 0 ? (
                      <span className="text-orange-600">Low Stock ({product.stock} left)</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors font-lato text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0 || addingToCart.has(product._id)}
                      className="flex-1 px-4 py-2 bg-black text-white rounded-none hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-lato text-sm flex items-center justify-center gap-2"
                    >
                      {addingToCart.has(product._id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-none hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-lato"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (page > totalPages || page < 1) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 border rounded-none transition-colors font-lato ${
                    currentPage === page
                      ? 'bg-black text-white border-black'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-none hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-lato"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onShowToast={(message, type) => setToast({ show: true, message, type })}
        />
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default BuyOnline;