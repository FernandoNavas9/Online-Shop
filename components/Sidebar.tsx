import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, activeFilter }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Bebé': true,
  });

  const toggleCategory = (category: Category) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };
  
  const handleFilterClick = (category: string, subcategory = 'Todos') => {
    onFilterChange({ category, subcategory });
  };

  return (
    <aside className="w-64 bg-white p-6 flex-shrink-0 hidden md:block">
      <h2 className="text-xl font-bold text-brand-dark mb-4">Categorías</h2>
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
  );
};

export default Sidebar;
