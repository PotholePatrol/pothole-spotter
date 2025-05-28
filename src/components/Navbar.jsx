import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRoad, FaBars, FaTimes } from 'react-icons/fa';
import { MdDashboard, MdInfo, MdLogin } from 'react-icons/md';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`sticky top-0 w-full z-50  transition-all duration-300 ${scrolled ? 'bg-gray-900 shadow-xl' : 'bg-gradient-to-r from-blue-900 to-blue-700'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={() => setIsOpen(false)}
          >
            <FaRoad className="text-amber-500 text-2xl md:text-3xl transition-transform group-hover:rotate-12" />
            <span className="text-white text-xl md:text-2xl font-bold">
              Pothole<span className="text-amber-400">Spotter</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/" 
              icon={<MdDashboard className="mr-1" />}
              isActive={location.pathname === '/'}
            >
              Dashboard
            </NavLink>
            
            <NavLink 
              to="/about" 
              icon={<MdInfo className="mr-1" />}
              isActive={location.pathname === '/about'}
            >
              About
            </NavLink>
            
            <NavLink 
              to="/login" 
              icon={<MdLogin className="mr-1" />}
              isActive={location.pathname === '/login'}
              isCta={true}
            >
              Login
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
          <MobileNavLink 
            to="/" 
            icon={<MdDashboard className="mr-2" />}
            isActive={location.pathname === '/'}
            onClick={toggleMenu}
          >
            Dashboard
          </MobileNavLink>
          
          <MobileNavLink 
            to="/about" 
            icon={<MdInfo className="mr-2" />}
            isActive={location.pathname === '/about'}
            onClick={toggleMenu}
          >
            About
          </MobileNavLink>
          
          <MobileNavLink 
            to="/login" 
            icon={<MdLogin className="mr-2" />}
            isActive={location.pathname === '/login'}
            onClick={toggleMenu}
            isCta={true}
          >
            Login
          </MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, children, icon, isActive, isCta = false }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-blue-800 text-white' 
        : `text-gray-300 hover:bg-gray-700 hover:text-white ${isCta ? 'hover:bg-amber-600' : ''}`
    } ${isCta ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}`}
  >
    {icon}
    {children}
  </Link>
);

// Reusable NavLink component for mobile
const MobileNavLink = ({ to, children, icon, isActive, onClick, isCta = false }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-700 text-white' 
        : `text-gray-300 hover:bg-gray-700 hover:text-white ${isCta ? 'hover:bg-amber-600' : ''}`
    } ${isCta ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}`}
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;