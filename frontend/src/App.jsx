import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SketchPage from './pages/SketchPage';
import UploadPage from './pages/UploadPage';
import GenerateTextPage from './pages/GenerateTextPage';
import EditImage from './pages/EditImage';
import Layout from './components/Layout';
import { ApiProvider } from './context/ApiContext';
import './App.css';

const App = () => {
  return (
    <ApiProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/sketch" element={<Layout><SketchPage /></Layout>} />
          <Route path="/upload-img" element={<Layout><UploadPage /></Layout>} />
          <Route path="/generate_text" element={<Layout><GenerateTextPage /></Layout>} />
          <Route path="/edit_image" element={<Layout><EditImage /></Layout>} />
        </Routes>
      </div>
    </ApiProvider>
  );
};

export default App;
