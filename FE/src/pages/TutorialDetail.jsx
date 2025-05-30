import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Users, Star, Heart, Share2, 
  CheckCircle, Package, ShoppingCart, BookOpen,
  User, Calendar, Tag, AlertCircle, Play
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ProductImage from '../components/ProductImage';

const TutorialDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, getAuthHeaders } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}item/${slug}`);
        
        if (response.data.success) {
          setItem(response.data.data);
        } else {
          setError('Tutorial not found');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        setError('Failed to load tutorial');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchItem();
    }
  }, [slug]);

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return 'Rp0';
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Mudah': 'bg-green-100 text-green-800 border-green-200',
      'Easy': 'bg-green-100 text-green-800 border-green-200',
      'Sedang': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Sulit': 'bg-red-100 text-red-800 border-red-200',
      'Hard': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    setAddingToCart(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}cart/add`,
        { itemId: item._id, quantity: 1 },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        alert('Tutorial added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.error || 'Failed to add tutorial to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmittingRating(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}item/${item._id}/rating`,
        { rating: userRating, review },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        // Update item ratings
        setItem(prev => ({
          ...prev,
          ratings: {
            ...prev.ratings,
            average: response.data.data.average,
            count: response.data.data.count
          }
        }));
        setShowRatingModal(false);
        setUserRating(0);
        setReview('');
        alert('Rating submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const toggleStepComplete = (stepIndex) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(index => index !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="font-lato text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="font-lato text-2xl font-medium text-gray-900 mb-2">Tutorial Not Found</h2>
          <p className="font-lato text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/our-craftsmanships')}
            className="px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to Tutorials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Back Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/our-craftsmanships')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-lato"
          >
            <ArrowLeft size={20} />
            <span>Back to Tutorials</span>
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex text-sm font-lato text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Home
            </button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/our-craftsmanships')} className="hover:text-black transition-colors">
              Tutorials
            </button>
            <span className="mx-2">/</span>
            <span className="text-black">{item.name}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Images & Info */}
          <div className="lg:col-span-5">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="aspect-square mb-4">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[activeImageIndex]?.url || item.images[0]?.url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-none border border-gray-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 border border-gray-200 rounded-none flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {item.images && item.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded-none overflow-hidden ${
                        activeImageIndex === index ? 'border-black' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${item.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-none text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="font-lato text-sm text-gray-600">Duration</p>
                <p className="font-lato font-medium">{item.estimatedTime}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-none text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="font-lato text-sm text-gray-600">Difficulty</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium border rounded-full ${getDifficultyColor(item.difficulty)}`}>
                  {item.difficulty}
                </span>
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="border border-gray-200 rounded-none p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-lato font-medium">Rating & Reviews</h3>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-lato"
                >
                  Rate this tutorial
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(item.ratings.average))}
                </div>
                <span className="font-lato font-medium">{item.ratings.average.toFixed(1)}</span>
                <span className="font-lato text-sm text-gray-600">({item.ratings.count} reviews)</span>
              </div>
              
              <div className="text-sm text-gray-600 font-lato">
                Based on {item.ratings.count} user{item.ratings.count !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Purchase Section */}
            <div className="border border-gray-200 rounded-none p-6 sticky top-6">
              <div className="mb-4">
                <h3 className="font-lato text-lg font-medium mb-2">Get This Tutorial</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-lato text-3xl font-bold">{formatPrice(item.price)}</span>
                  <span className="font-lato text-sm text-gray-600">one-time purchase</span>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full mb-3 px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-lato flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ShoppingCart size={20} />
                )}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors font-lato flex items-center justify-center gap-2">
                <Heart size={20} />
                Add to Wishlist
              </button>
              
              <div className="mt-4 text-xs text-gray-500 font-lato">
                ✓ Instant download after purchase<br />
                ✓ Lifetime access<br />
                ✓ Step-by-step instructions<br />
                ✓ Material list included
              </div>
            </div>
          </div>

          {/* Right Column - Tutorial Content */}
          <div className="lg:col-span-7">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full font-lato">
                  {item.category.name}
                </span>
                {item.tags && item.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-lato flex items-center gap-1">
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="font-cookie text-4xl font-light text-[#0a0205] mb-4">
                {item.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-600" />
                  <span className="font-lato text-sm text-gray-600">
                    Created by {item.createdBy.username}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600" />
                  <span className="font-lato text-sm text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
              
              <p className="font-lato text-gray-700 text-lg leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Materials List */}
            <div className="mb-8">
              <h2 className="font-lato text-2xl font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Package size={24} />
                Materials Needed
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.materials && item.materials.map((material, index) => (
                  <div key={index} className="border border-gray-200 rounded-none p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-lato font-medium text-gray-900">{material.name}</h4>
                        <p className="font-lato text-gray-600">{material.quantity}</p>
                        {material.notes && (
                          <p className="font-lato text-sm text-gray-500 mt-1">{material.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-lato text-2xl font-medium text-gray-900 flex items-center gap-2">
                  <BookOpen size={24} />
                  Step-by-Step Instructions
                </h2>
                <div className="text-sm text-gray-600 font-lato">
                  {completedSteps.length} of {item.instructions ? item.instructions.length : 0} completed
                </div>
              </div>
              
              <div className="space-y-6">
                {item.instructions && item.instructions
                  .sort((a, b) => a.step - b.step)
                  .map((instruction, index) => (
                  <div 
                    key={instruction.step} 
                    className={`border rounded-none p-6 transition-all ${
                      completedSteps.includes(index)
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          completedSteps.includes(index)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {completedSteps.includes(index) ? (
                            <CheckCircle size={16} />
                          ) : (
                            instruction.step
                          )}
                        </div>
                        <button
                          onClick={() => toggleStepComplete(index)}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            completedSteps.includes(index)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {completedSteps.includes(index) ? 'Completed' : 'Mark Complete'}
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-lato font-medium text-gray-900 mb-2">
                          Step {instruction.step}
                        </h3>
                        <p className="font-lato text-gray-700 leading-relaxed">
                          {instruction.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Summary */}
            <div className="border border-gray-200 rounded-none p-6 bg-gray-50">
              <h3 className="font-lato font-medium mb-4">Your Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${item.instructions ? (completedSteps.length / item.instructions.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <p className="font-lato text-sm text-gray-600">
                {item.instructions && completedSteps.length === item.instructions.length ? (
                  <span className="text-green-600 font-medium">🎉 Congratulations! Tutorial completed!</span>
                ) : (
                  `${completedSteps.length} of ${item.instructions ? item.instructions.length : 0} steps completed`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowRatingModal(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white max-w-md w-full rounded-none border border-gray-200 shadow-2xl">
              <div className="p-6">
                <h3 className="font-lato text-lg font-medium text-gray-900 mb-4">
                  Rate This Tutorial
                </h3>
                
                <div className="mb-4">
                  <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setUserRating(index + 1)}
                        className="p-1"
                      >
                        <Star
                          size={24}
                          className={`${
                            index < userRating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300 hover:text-yellow-200'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                    Review (Optional)
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience with this tutorial..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-lato"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRatingModal(false)}
                    disabled={submittingRating}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors font-lato"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRatingSubmit}
                    disabled={userRating === 0 || submittingRating}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-none hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-lato flex items-center justify-center gap-2"
                  >
                    {submittingRating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : null}
                    Submit Rating
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialDetail;