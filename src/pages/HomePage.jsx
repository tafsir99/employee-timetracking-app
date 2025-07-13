import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center space-y-8 relative z-10 max-w-4xl mx-auto"
      >
        {/* Logo et titre */}
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-3xl shadow-2xl">
              <Clock className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
          >
            Pointage Employés
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Gestion sécurisée et moderne du pointage pour tous les secteurs d'activité
          </motion.p>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Sécurisé</h3>
            <p className="text-gray-300 text-sm">Mots de passe chiffrés et accès protégé</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <Users className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Multi-secteurs</h3>
            <p className="text-gray-300 text-sm">Restaurants, hôtels, écoles, entreprises</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
            <p className="text-gray-300 text-sm">Rapports détaillés et exports</p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={() => onNavigate('clockin')}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            <Clock className="w-6 h-6 mr-2" />
            Pointage Employé
          </Button>
          
          <Button
            onClick={() => onNavigate('admin-login')}
            variant="outline"
            className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-6 text-lg rounded-2xl backdrop-blur-lg bg-white/10 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            <Shield className="w-6 h-6 mr-2" />
            Espace Admin
          </Button>
        </motion.div>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-12 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <p className="text-gray-300 text-sm">
            🔐 <strong>Sécurité renforcée :</strong> Chaque employé dispose d'un mot de passe personnel obligatoire
            <br />
            📱 <strong>Compatible :</strong> Fonctionne sur téléphones, tablettes et ordinateurs
            <br />
            📊 <strong>Complet :</strong> Gestion des retards, absences et exports de données
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;