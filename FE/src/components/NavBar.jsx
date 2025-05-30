import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X, Search, Droplet, FileText, HelpCircle, Mail,
  MapPin, PenTool, BookOpen, Layers, User, ShoppingCart, Package
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';
import SearchModal from './SearchModal'; // ADDED

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // ADDED
  const [authMode, setAuthMode] = useState('login');
  
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    auth?.logout();
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // ADDED: Search handler
  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  return (
    <>
      <div className="bg-[#ffffff] w-full">
        <div className="container mx-auto flex items-center justify-between p-4 relative">

          {/* Left: Menu */}
          <div className="hidden lg:flex space-x-6 text-black font-lato text-sm">
            <Link to="/products" className="hover:underline transition-all duration-300 ease-in-out hover:opacity-70">Products</Link>
            <Link to="/craftsmanship" className="hover:underline transition-all duration-300 ease-in-out hover:opacity-70">Our Craftsmanship</Link>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/">
              <span className="font-cookie text-6xl font-light text-[#0a0205]">D</span>
              <span className="font-cookie text-5xl text-[#000000]">c</span>
            </Link>
          </div>

          {/* Right: Menu Items */}
          <div className="hidden lg:flex items-center space-x-6 text-black font-lato text-sm">
            <Link to="/contact-us" className="hover:underline transition-all duration-300 ease-in-out hover:opacity-70">Contact Us</Link>
            <Link to="/faqs" className="hover:underline transition-all duration-300 ease-in-out hover:opacity-70">FAQs</Link>

            {/* UPDATED: Search button with functionality */}
            <button 
              onClick={handleSearchClick}
              className="transition-all duration-300 ease-in-out hover:opacity-70"
            >
              <Search size={24} className="text-black" />
            </button>

            {/* Show Cart & My Orders only for authenticated users */}
            {isAuthenticated && (
              <>
                <Link 
                  to="/my-orders" 
                  className="border border-black px-3 py-1 hover:bg-[#000000] hover:text-white hover:opacity-80 transition-all duration-300 ease-in-out rounded-none flex items-center gap-2"
                >
                  <Package size={18} />
                  <span className="hidden xl:inline">My Orders</span>
                </Link>
                
                <Link 
                  to="/cart" 
                  className="border border-black px-3 py-1 hover:bg-[#000000] hover:text-white hover:opacity-80 transition-all duration-300 ease-in-out rounded-none flex items-center gap-2"
                >
                  <ShoppingCart size={18} />
                  <span className="hidden xl:inline">Cart</span>
                </Link>
              </>
            )}

            <Link to="/buy-online" className="border border-black px-3 py-1 hover:bg-[#000000] hover:text-white hover:opacity-80 transition-all duration-300 ease-in-out rounded-none flex items-center gap-2">
              Buy Online
            </Link>

            {!isAuthenticated ? (
              <button 
                onClick={() => handleAuthClick('login')}
                className="border border-black px-3 py-1 hover:bg-[#000000] hover:text-white hover:opacity-80 transition-all duration-300 ease-in-out rounded-none"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="border border-black px-3 py-1 hover:bg-[#000000] hover:text-white hover:opacity-80 transition-all duration-300 ease-in-out rounded-none"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile: Login Button */}
          <div className="lg:hidden absolute right-10">
            {!isAuthenticated ? (
              <button 
                onClick={() => handleAuthClick('login')}
                className="flex items-center justify-center font-mono transition-all duration-300 ease-in-out hover:opacity-70"
              >
                <User size={24} className="text-black" />
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center font-mono transition-all duration-300 ease-in-out hover:opacity-70"
              >
                <User size={24} className="text-black" />
              </button>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="lg:hidden flex flex-col justify-center items-center left-10 cursor-pointer hover:opacity-80 transition-all duration-300" onClick={toggleMenu}>
            <span className={`block w-6 h-0.5 bg-[#000000] my-0.1 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#000000] my-1.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#000000] my-0.1 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </div>

        {/* Hamburger Menu Items */}
        <div className={`lg:hidden ${menuOpen ? 'block' : 'hidden'} mt-4 transition-all duration-300 ease-in-out`}>
          <div className="flex flex-col space-y-4 text-black font-mono text-sm text-center">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex flex-col space-y-6">
                <NavItem icon={<Layers size={20} />} label="Products" to="/products" />
                <NavItem icon={<Droplet size={20} />} label="Craftsmanship" to="/craftsmanship" />
                <NavItem icon={<HelpCircle size={20} />} label="FAQ" to="/faqs" />
                
                {/* ADDED: Search in mobile menu */}
                <button 
                  onClick={() => {
                    handleSearchClick();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-black transition-all duration-300 ease-in-out hover:opacity-70"
                >
                  <div className="flex items-center justify-center w-6 h-6">
                    <Search size={20} />
                  </div>
                  <span>Search</span>
                </button>
                
                {/* My Orders in mobile menu for authenticated users */}
                {isAuthenticated && (
                  <NavItem icon={<Package size={20} />} label="My Orders" to="/my-orders" />
                )}
              </div>
              <div className="flex flex-col space-y-6">
                <NavItem icon={<Mail size={20} />} label="Contact" to="/contact-us" />
                <NavItem icon={<ShoppingCart size={20} />} label="Buy Online" to="/buy-online" />
                
                {/* Cart in mobile menu for authenticated users */}
                {isAuthenticated && (
                  <NavItem icon={<ShoppingCart size={20} />} label="Cart" to="/cart" />
                )}
                
                {/* Login/Logout in mobile menu */}
                {!isAuthenticated ? (
                  <button 
                    onClick={() => {
                      handleAuthClick('login');
                      setMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-black transition-all duration-300 ease-in-out hover:opacity-70"
                  >
                    <div className="flex items-center justify-center w-6 h-6">
                      <User size={20} />
                    </div>
                    <span>Login</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-black transition-all duration-300 ease-in-out hover:opacity-70"
                  >
                    <div className="flex items-center justify-center w-6 h-6">
                      <User size={20} />
                    </div>
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
      
      {/* ADDED: Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

function NavItem({ icon, label, to }) {
  return (
    <Link 
      to={to} 
      className="flex items-center space-x-2 text-black transition-all duration-300 ease-in-out hover:opacity-70"
    >
      <div className="flex items-center justify-center w-6 h-6">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}

export default NavBar;
