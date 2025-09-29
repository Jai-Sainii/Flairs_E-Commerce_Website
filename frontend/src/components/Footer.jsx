// src/components/Footer.js
import React from 'react';

// Data for the navigation links to keep the JSX clean
const companyLinks = [
  { name: 'Home', href: '/' },
  { name: 'About us', href: '/about' },
  { name: 'Collection', href: '/collection' },
  { name: 'Privacy policy', href: '#' }
];

const contactInfo = [
  { name: '+91 93______', href: 'tel:+1-000-000-0000' },
  { name: 'jaisaini4a@gmail.com', href: 'mailto:jaisaini4a@gmail.com' },
  { name: 'Instagram', href: '#' },
];

const Footer = () => {
  return (
    <footer className="mt-30 w-full bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        
        {/* --- Footer content grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand and description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Flaire<span className="text-pink-500">.</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-md">
              Flaire, founded in 2025, was created to make fashion simple, stylish, and accessible. We bring you the latest trends and timeless pieces to help you express your unique style
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-500 hover:text-gray-900 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Get in Touch */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Get In Touch
            </h3>
            <ul className="mt-4 space-y-3">
              {contactInfo.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-500 hover:text-gray-900 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* --- Bottom section --- */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            Copyright 2025@ Developer Jai - All Right Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;