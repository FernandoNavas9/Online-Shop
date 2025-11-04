import React from 'react';
import { Shield } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  return (
    <header className="bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
             <img className="h-16 w-auto" src="/logo.png" alt="Baby & Kids Clothing Logo" />
          </div>
          <div className="flex items-center">
            <button
              onClick={onAdminClick}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Shield size={18} />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>
       <div className="w-full h-1 bg-blue-400"></div>
    </header>
  );
};

export default Header;