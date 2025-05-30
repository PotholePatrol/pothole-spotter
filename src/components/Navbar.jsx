import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRoad, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { MdDashboard, MdInfo, MdLogin } from 'react-icons/md';
import potholeLogo from '../assets/pothole-logo.png';
import potholeLogoDark from '../assets/pothole-logo.png'; // Add a dark version of your logo

const Navbar = ({ darkMode, toggleDarkMode }) => {
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
    <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? darkMode 
          ? 'bg-gray-900 shadow-xl' 
          : 'bg-white shadow-xl'
        : darkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
          : 'bg-gradient-to-r from-blue-900 to-blue-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            onClick={() => setIsOpen(false)}
          >
            <img
              className="h-20 w-24 object-cover"
              src={darkMode ? potholeLogoDark : potholeLogo}
              alt="pothole patrol"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              icon={<MdDashboard className="mr-1" />}
              isActive={location.pathname === '/'}
              darkMode={darkMode}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/about"
              icon={<MdInfo className="mr-1" />}
              isActive={location.pathname === '/about'}
              darkMode={darkMode}
            >
              About
            </NavLink>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-300 h-5 w-5" />
              ) : (
                <FaMoon className="text-gray-700 h-5 w-5" />
              )}
            </button>

            <NavLink
              to="/login"
              icon={<MdLogin className="mr-1" />}
              isActive={location.pathname === '/login'}
              isCta={true}
              darkMode={darkMode}
            >
              Login
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-300 h-5 w-5" />
              ) : (
                <FaMoon className="text-gray-700 h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className={`block h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
              ) : (
                <FaBars className={`block h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-96' : 'max-h-0'
      } ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink
            to="/"
            icon={<MdDashboard className="mr-2" />}
            isActive={location.pathname === '/'}
            onClick={toggleMenu}
            darkMode={darkMode}
          >
            Dashboard
          </MobileNavLink>

          <MobileNavLink
            to="/about"
            icon={<MdInfo className="mr-2" />}
            isActive={location.pathname === '/about'}
            onClick={toggleMenu}
            darkMode={darkMode}
          >
            About
          </MobileNavLink>

          <MobileNavLink
            to="/login"
            icon={<MdLogin className="mr-2" />}
            isActive={location.pathname === '/login'}
            onClick={toggleMenu}
            isCta={true}
            darkMode={darkMode}
          >
            Login
          </MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, children, icon, isActive, isCta = false, darkMode }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive
        ? darkMode
          ? 'bg-gray-700 text-white'
          : 'bg-blue-800 text-white'
        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} ${
            isCta ? 'hover:bg-amber-600' : ''
          }`
    } ${isCta ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}`}
  >
    {icon}
    {children}
  </Link>
);

// Reusable NavLink component for mobile
const MobileNavLink = ({ to, children, icon, isActive, onClick, isCta = false, darkMode }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
      isActive
        ? darkMode
          ? 'bg-gray-700 text-white'
          : 'bg-blue-100 text-blue-800'
        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} ${
            isCta ? 'hover:bg-amber-600' : ''
          }`
    } ${isCta ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}`}
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;