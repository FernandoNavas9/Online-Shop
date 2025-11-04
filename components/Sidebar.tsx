import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-brand-dark text-white p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-brand-primary text-center">StoreAI</h2>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <a href="#" className="block p-2 rounded bg-brand-primary">Dashboard</a>
          </li>
          <li className="mb-4">
            <a href="#" className="block p-2 rounded hover:bg-gray-700 transition-colors">Products</a>
          </li>
          <li className="mb-4">
            <a href="#" className="block p-2 rounded hover:bg-gray-700 transition-colors">Orders</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
