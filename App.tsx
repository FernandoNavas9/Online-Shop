import React, { useEffect, useState } from 'react';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Sidebar from './components/Sidebar';
import { getProducts } from './api/products';
import { Product } from './types';
import ProductModal from './components/ProductModal';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };
  
  const handleProductAdded = (newProduct: Product) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };


  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <div className="flex container mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />
        <main className="flex-1">
          <div className="mb-6">
            <AdminPanel onProductAdded={handleProductAdded} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Products</h2>
          {loading && <p className="text-center text-gray-500">Loading products...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && (
            <ProductGrid products={products} onProductClick={handleProductClick} />
          )}
        </main>
      </div>
      <ProductModal product={selectedProduct} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
