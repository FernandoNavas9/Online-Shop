import React from 'react';
import { PlusIcon } from './icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openAdminPanel: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, openAdminPanel }) => {
  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <div className={`fixed top-0 left-0 h-full w-64 bg-brand-dark text-white z-30 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64 flex-shrink-0`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin</h2>
        </div>
        <nav className="p-4">
          <ul>
            <li>
              <button 
                onClick={() => {
                  openAdminPanel();
                  setIsOpen(false); // Close sidebar on mobile after clicking
                }}
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 w-full text-left"
              >
                <PlusIcon className="w-5 h-5 mr-3" />
                Add Product
              </button>
            </li>
            {/* Add more navigation items here */}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
