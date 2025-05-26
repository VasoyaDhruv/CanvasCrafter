import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CanvasProvider } from './Context/CanvasContext';
import Loader from './components/Loader';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Customization from './pages/Customization/Customization';

function App() {
  return (
    <Router>
      <>
        <Toaster position="top-center" />
        <Loader />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/customize/:id"
            element={
              <CanvasProvider>
                <Customization />
              </CanvasProvider>
            }
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;
