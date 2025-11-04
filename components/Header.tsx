import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none lg:hidden">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </button>
      <div className="text-xl font-semibold text-brand-dark">E-Commerce Store</div>
      <div>
        {/* Placeholder for user profile/cart */}
      </div>
    </header>
  );
};

export default Header;
