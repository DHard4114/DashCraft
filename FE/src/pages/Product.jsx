import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/productCard';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';

const Product = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || ''
    });
    
    // UI states
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}category`);
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            const params = new URLSearchParams();
            
            if (selectedCategory) params.append('category', selectedCategory);
            if (searchTerm) params.append('search', searchTerm);
            if (sortBy !== 'newest') params.append('sortBy', sortBy);
            if (difficulty) params.append('difficulty', difficulty);
            if (priceRange.min) params.append('minPrice', priceRange.min);
            if (priceRange.max) params.append('maxPrice', priceRange.max);
            params.append('page', currentPage);
            params.append('limit', 12);

            const response = await axios.get(`${import.meta.env.VITE_API}item?${params}`);
            
            if (response.data.success) {
                const processedProducts = response.data.data.map(product => ({
                    ...product,
                    imageUrl: product.images && product.images.length > 0 
                        ? product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
                        : '/placeholder-image.jpg',
                    categoryName: product.category?.name || 'Unknown Category',
                    creatorName: product.createdBy?.username || 'Unknown Creator',
                    rating: product.ratings?.average || 0,
                    ratingCount: product.ratings?.count || 0,
                    stepCount: product.instructions?.length || 0,
                    materialCount: product.materials?.length || 0
                }));
                
                setProducts(processedProducts);
                setTotalPages(response.data.pages || 1);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch tutorials');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, searchTerm, sortBy, difficulty, priceRange.min, priceRange.max, currentPage]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (filterType, value) => {
        setCurrentPage(1);
        
        switch (filterType) {
            case 'category':
                setSelectedCategory(value);
                setSearchParams(prev => {
                    if (value) prev.set('category', value);
                    else prev.delete('category');
                    return prev;
                });
                break;
            case 'search':
                setSearchTerm(value);
                setSearchParams(prev => {
                    if (value) prev.set('search', value);
                    else prev.delete('search');
                    return prev;
                });
                break;
            case 'sort':
                setSortBy(value);
                setSearchParams(prev => {
                    if (value !== 'newest') prev.set('sort', value);
                    else prev.delete('sort');
                    return prev;
                });
                break;
            case 'difficulty':
                setDifficulty(value);
                setSearchParams(prev => {
                    if (value) prev.set('difficulty', value);
                    else prev.delete('difficulty');
                    return prev;
                });
                break;
        }
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchTerm('');
        setSortBy('newest');
        setDifficulty('');
        setPriceRange({ min: '', max: '' });
        setCurrentPage(1);
        setSearchParams(new URLSearchParams());
    };

    // Handle View Tutorial click
    const handleViewTutorial = (product) => {
        navigate(`/tutorial/${product.slug}`);
    };

    // Handle Add to Cart click
    const handleAddToCart = async (product) => {
        try {
            // Add to cart logic here
            console.log('Add to cart:', product._id);
            alert('Tutorial added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add tutorial to cart');
        }
    };

    const selectedCategoryName = categories.find(cat => cat._id === selectedCategory)?.name || 'All Tutorials';

    return (
        <div className="min-h-screen bg-[#ffffff]">
            <div className="container mx-auto px-4 py-8">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-cookie text-6xl font-light text-[#0a0205] mb-2">
                        DIY Tutorials
                    </h1>
                    <p className="font-lato text-gray-600 text-lg">
                        Discover step-by-step tutorials and creative projects to craft at home
                    </p>
                </div>

                {/* Search and Filters Bar */}
                <div className="bg-white border border-gray-200 rounded-none p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search tutorials..."
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
                            <Filter size={16} />
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
                                        Difficulty
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                        className="w-full border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 font-lato"
                                    >
                                        <option value="">All Levels</option>
                                        <option value="Mudah">Easy</option>
                                        <option value="Sedang">Medium</option>
                                        <option value="Sulit">Hard</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 font-lato">
                                        Price Range
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
                                        Clear All
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-lato text-xl font-light text-gray-800">
                        {selectedCategoryName}
                        <span className="text-gray-500 ml-2">
                            ({products.length} tutorials)
                        </span>
                    </h2>
                </div>

                {/* Products Grid/List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        <span className="ml-3 text-gray-600 font-lato">Loading tutorials...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-500 mb-4 font-lato">{error}</div>
                        <button 
                            onClick={fetchProducts}
                            className="px-6 py-2 border border-black rounded-none hover:bg-black hover:text-white transition-colors font-lato"
                        >
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 mb-4 font-lato text-lg">No tutorials found</div>
                        <p className="text-gray-400 font-lato">Try adjusting your filters or search terms</p>
                        <button 
                            onClick={clearFilters}
                            className="mt-4 px-6 py-2 border border-black rounded-none hover:bg-black hover:text-white transition-colors font-lato"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className={`
                        ${viewMode === 'grid' 
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                            : 'space-y-4'
                        }
                    `}>
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                viewMode={viewMode}
                                onViewTutorial={handleViewTutorial}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-12 space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-200 rounded-none hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-lato"
                        >
                            Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 border rounded-none transition-colors font-lato ${
                                    currentPage === page
                                        ? 'bg-black text-white border-black'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-200 rounded-none hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-lato"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;