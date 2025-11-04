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
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
                <img className="h-12 w-12" src="https://emojicdn.elk.sh/🌈?style=fluent" alt="Baby & Kids Logo" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-dark">BABY & KIDS</h1>
              <p className="text-sm text-gray-500 -mt-1">clothing</p>
            </div>
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
