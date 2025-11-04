import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-t-md mt-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <p className="font-bold text-brand-dark">BABY & KIDS clothing</p>
          <p className="text-sm text-gray-600">
            Calle Benito Juárez Nte 53-local C, San Cristóbal Centro, 55000 Ecatepec de Morelos, Méx.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://www.facebook.com/share/17sG83WJf7/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-brand-primary transition-colors">
            <Facebook size={24} />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-brand-primary transition-colors">
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
