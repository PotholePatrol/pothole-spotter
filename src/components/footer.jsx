import React from 'react';
import { FaTwitter, FaGithub, FaLinkedin, FaRoad, FaCloud, FaReact, FaMicrosoft } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-300 pt-16 pb-8 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Road divider */}
      <div className="relative h-1 mb-12 mx-auto max-w-4xl">
        <div className="absolute inset-0 bg-amber-500"></div>
        <div className="absolute inset-0 bg-white opacity-20 flex">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-full w-8 bg-black mx-2"></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <FaRoad className="text-amber-500 text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Pothole Spotter</h2>
            </div>
            <p className="text-gray-400">Smart Infrastructure Monitoring System</p>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} SmartRoads Project – All rights reserved
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="#about" 
                className="text-gray-400 hover:text-amber-500 transition-colors duration-300 group"
              >
                About
                <span className="block h-0.5 bg-amber-500 w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="#contact" 
                className="text-gray-400 hover:text-amber-500 transition-colors duration-300 group"
              >
                Contact
                <span className="block h-0.5 bg-amber-500 w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="#privacy" 
                className="text-gray-400 hover:text-amber-500 transition-colors duration-300 group"
              >
                Privacy
                <span className="block h-0.5 bg-amber-500 w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="#terms" 
                className="text-gray-400 hover:text-amber-500 transition-colors duration-300 group"
              >
                Terms
                <span className="block h-0.5 bg-amber-500 w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>

          {/* Social links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://x.com/Vi_brant_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-amber-500 hover:bg-gray-700 transition-all duration-300 group"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://github.com/StevenKariuki" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-amber-500 hover:bg-gray-700 transition-all duration-300 group"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.linkedin.com/in/steven-muiruri-11b73a263/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-amber-500 hover:bg-gray-700 transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Developer credit */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-gray-500">Developed by</span>
            <span className="font-medium text-amber-500">CodeTarmac</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">Powered by</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-blue-400 group">
                <FaMicrosoft className="text-xl mr-1" />
                <span className="text-sm">Azure</span>
              </div>
              <div className="flex items-center text-cyan-400 group">
                <FaReact className="text-xl mr-1 animate-spin-slow" />
                <span className="text-sm">React</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating pothole animation */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 opacity-10">
        <div className="absolute w-32 h-32 rounded-full bg-gray-700 animate-pulse"></div>
        <div className="absolute w-28 h-28 rounded-full bg-amber-500 top-2 left-2 animate-pulse delay-1000"></div>
      </div>
    </footer>
  );
}

export default Footer;