import React, { useState, useEffect, useCallback } from 'react';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Sidebar from './components/Sidebar';
import { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [filter, setFilter] = useState<{ category: string; subcategory: string }>({ category: 'Todos', subcategory: 'Todos' });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let url = '/api/products?';
    if (filter.category !== 'Todos') {
      url += `category=${encodeURIComponent(filter.category)}`;
      if (filter.subcategory !== 'Todos') {
        url += `&subcategory=${encodeURIComponent(filter.subcategory)}`;
      }
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductAdded = () => {
    // Refetch all products after a new one is added
    setFilter({ category: 'Todos', subcategory: 'Todos' });
    fetchProducts();
    setIsAdminView(false); // Switch back to customer view
  };

  return (
    <div className="flex h-screen bg-brand-secondary">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onAdminClick={() => setIsAdminView(true)} />
        {isAdminView ? (
          <AdminPanel onBackToStore={() => setIsAdminView(false)} onProductAdded={handleProductAdded} />
        ) : (
          <main className="flex-1 flex">
            <Sidebar onFilterChange={setFilter} activeFilter={filter} />
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
              <h1 className="text-3xl font-bold text-brand-dark mb-2">{filter.subcategory === 'Todos' ? filter.category : filter.subcategory}</h1>
              <hr className="border-brand-primary mb-6" />
              <ProductGrid products={products} isLoading={isLoading} error={error} />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
