import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Leads from './pages/Leads';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Tasks from './pages/Tasks';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <div className="main-wrapper">
                      <Navbar />
                      <Dashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/contacts" element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <div className="main-wrapper">
                      <Navbar />
                      <Contacts />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/leads" element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <div className="main-wrapper">
                      <Navbar />
                      <Leads />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <div className="main-wrapper">
                      <Navbar />
                      <Analytics />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <div className="main-wrapper">
                      <Navbar />
                      <Tasks />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <div className="main-wrapper">
                      <Navbar />
                      <Profile />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute requiredRole="admin">
                  <div className="app-layout">
                    <Sidebar />
                    <div className="main-wrapper">
                      <Navbar />
                      <Users />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;