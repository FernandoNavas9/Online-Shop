import React from 'react';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen bg-brand-light font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-light">
          <div className="container mx-auto px-6 py-8">
            <AdminPanel />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
