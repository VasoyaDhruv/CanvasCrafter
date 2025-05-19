import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Customization from './components/Customization';
import { CanvasProvider } from './context/CanvasContext';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
