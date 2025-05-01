import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import './styles.css';

function Layout({ children }) {
  const location = useLocation();

  // Define page titles and descriptions based on the current route
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return null; // Homepage has its own title
      case '/sketch':
        return {
          title: 'Design Sketching Tool',
          description: 'Quickly sketch your product design concept and discover similar design inspirations from our curated collection'
        };
      case '/upload-img':
        return {
          title: 'Image Search',
          description: 'Upload an image to find similar designs and expand your inspiration'
        };
      case '/generate_text':
        return {
          title: 'Generate Description',
          description: 'Upload a design asset to generate professional descriptions for your product'
        };
      case '/edit_image':
        return {
          title: 'Design Editor',
          description: 'Professional tools to refine and enhance your design assets'
        };
      default:
        return null;
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        {pageInfo && (
          <div className="page-header">
            <h1 className="page-title">{pageInfo.title}</h1>
            <p className="page-description">{pageInfo.description}</p>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
