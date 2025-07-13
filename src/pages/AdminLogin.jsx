import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AdminLogin = ({ onNavigate, onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Identifiants par défaut (en production, utiliser une vraie authentification)
  const defaultAdmin = {
    username: 'admin',
    password: 'admin123'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simuler une vérification d'authentification
    setTimeout(() => {
      if (credentials.username === defaultAdmin.username && 
          credentials.password === defaultAdmin.password) {
        localStorage.setItem('adminAuthenticated', 'true');
        onLogin(true);
        toast({
          title: "Connexion réussie ! ✅",
          description: "Bienvenue dans l'espace administrateur",
        });
        onNavigate('admin-dashboard');
      } else {
        toast({
          title: "Identifiants incorrects",
          description: "Nom d'utilisateur ou mot de passe invalide",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => onNavigate('home')}
            variant="outline"
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white backdrop-blur-lg bg-white/10 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Espace Admin
            </h1>
            <p className="text-gray-300 mt-2">Accès sécurisé au tableau de bord</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-white">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Entrez votre nom d'utilisateur"
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="Entrez votre mot de passe"
                  className="bg-white/20 border-white/30 text-white placeholder-gray-300 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 py-3"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Se connecter
                </div>
              )}
            </Button>
          </form>

          {/* Info par défaut */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-300 text-sm text-center">
              <strong>Identifiants par défaut :</strong><br />
              Utilisateur: <code className="text-purple-400">admin</code><br />
              Mot de passe: <code className="text-purple-400">admin123</code>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;