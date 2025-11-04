import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          {/* Future navigation or user profile can go here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
