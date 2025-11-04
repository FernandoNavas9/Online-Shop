import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { cn } from '../lib/utils';

const categories = {
  'Bebé': ['Playera', 'Body', 'Pijama', 'Conjuntos', 'Pantalones', 'Accesorios'],
  'Niña': ['Vestidos', 'Blusas', 'Pantalones', 'Chamarras', 'Accesorios'],
  'Niño': ['Camisetas', 'Pantalones', 'Playeras', 'Chamarras', 'Accesorios'],
};

type Category = keyof typeof categories;

interface SidebarProps {
  onFilterChange: (filter: { category: string; subcategory: string }) => void;
  activeFilter: { category: string; subcategory: string };
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, activeFilter, isOpen, onClose }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Bebé': true,
    'Niña': false,
    'Niño': false,
  });

  const toggleCategory = (category: Category) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };
  
  const handleFilterClick = (category: string, subcategory = 'Todos') => {
    onFilterChange({ category, subcategory });
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 w-64 h-full bg-white p-6 z-40 transition-transform transform md:static md:translate-x-0 md:flex-shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-bold text-brand-dark">Categorías</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-brand-dark mb-4 hidden md:block">Categorías</h2>
        
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleFilterClick('Todos')}
              className={cn(
                "w-full text-left px-4 py-2 rounded-lg font-semibold",
                activeFilter.category === 'Todos' ? "bg-brand-primary text-white" : "hover:bg-brand-secondary"
              )}
            >
              Todos
            </button>
          </li>

          {(Object.keys(categories) as Category[]).map(category => (
            <li key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex justify-between items-center text-left py-2 font-semibold text-gray-700"
              >
                <span onClick={(e) => { e.stopPropagation(); handleFilterClick(category); }}>{category}</span>
                {openCategories[category] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {openCategories[category] && (
                <ul className="pl-4 mt-1 border-l-2 border-brand-secondary">
                  {categories[category].map(subcategory => (
                    <li key={subcategory}>
                      <button
                        onClick={() => handleFilterClick(category, subcategory)}
                        className={cn(
                          "w-full text-left px-4 py-1.5 text-sm rounded-md",
                          activeFilter.category === category && activeFilter.subcategory === subcategory
                            ? "text-brand-primary font-semibold"
                            : "text-gray-600 hover:bg-brand-secondary"
                        )}
                      >
                        {subcategory}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;