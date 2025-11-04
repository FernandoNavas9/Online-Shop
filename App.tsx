import React, { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Sidebar from './components/Sidebar';
import { Product } from './types';
import { getProducts } from './api/products';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    // Load products on initial render
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  const addProduct = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
    setIsAdminPanelOpen(false); // Close panel after adding
  };

  return (
    <div className="flex h-screen bg-brand-light">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} openAdminPanel={() => setIsAdminPanelOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-light p-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-6">Our Products</h1>
          <ProductGrid products={products} />
        </main>
      </div>
      {isAdminPanelOpen && <AdminPanel closePanel={() => setIsAdminPanelOpen(false)} onProductAdd={addProduct} />}
    </div>
  );
}

export default App;
