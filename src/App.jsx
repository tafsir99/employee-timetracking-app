import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import HomePage from '@/pages/HomePage';
import EmployeeClockIn from '@/pages/EmployeeClockIn';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import EmployeeManagement from '@/pages/EmployeeManagement';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'admin est déjà connecté
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'clockin':
        return <EmployeeClockIn onNavigate={setCurrentPage} />;
      case 'admin-login':
        return <AdminLogin onNavigate={setCurrentPage} onLogin={setIsAdminAuthenticated} />;
      case 'admin-dashboard':
        return isAdminAuthenticated ? 
          <AdminDashboard onNavigate={setCurrentPage} onLogout={() => {
            setIsAdminAuthenticated(false);
            localStorage.removeItem('adminAuthenticated');
            setCurrentPage('home');
          }} /> : 
          <AdminLogin onNavigate={setCurrentPage} onLogin={setIsAdminAuthenticated} />;
      case 'employee-management':
        return isAdminAuthenticated ? 
          <EmployeeManagement onNavigate={setCurrentPage} /> : 
          <AdminLogin onNavigate={setCurrentPage} onLogin={setIsAdminAuthenticated} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Pointage Employés - Gestion Sécurisée</title>
        <meta name="description" content="Application de pointage sécurisée pour la gestion des employés - Compatible tous secteurs" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
        <Toaster />
      </div>
    </>
  );
}

export default App;