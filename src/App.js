import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/landing';
import Login from './pages/login';
import Profile from './pages/profile';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return <Navigate to="/profile" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to="/profile" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
