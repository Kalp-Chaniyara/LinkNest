import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center">
          <Link 
            to="/privacy-policy" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="text-center text-gray-500 text-sm mt-2">
          © {new Date().getFullYear()} Linkable. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 