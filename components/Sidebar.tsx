import React from 'react';

const Sidebar: React.FC = () => {
  // In a real app, categories would be dynamic
  const categories = ['Electronics', 'Apparel', 'Home Goods', 'Books'];

  return (
    <aside className="w-64 bg-white p-6 border-r border-gray-200 hidden lg:block">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
      <nav>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category}>
              <a href="#" className="block text-gray-600 hover:text-indigo-600 transition-colors">
                {category}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
