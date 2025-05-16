import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Customization from './components/Customization';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route 
          path="/customize/:id" 
          element={<Customization />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
