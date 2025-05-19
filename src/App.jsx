import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Customization from './components/Customization';
import CanvasProviderWrapper from './components/CanvasProviderWrapper';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/customize/:id"
          element={
            <CanvasProviderWrapper>
              <Customization />
            </CanvasProviderWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
