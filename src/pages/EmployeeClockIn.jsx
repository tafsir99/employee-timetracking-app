import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const EmployeeClockIn = ({ onNavigate }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Charger les employés depuis localStorage
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setPassword('');
  };

  const handleClockIn = async () => {
    if (!selectedEmployee || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un employé et entrer votre mot de passe",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simuler une vérification de mot de passe
    setTimeout(() => {
      // Vérifier le mot de passe (en production, utiliser un hash)
      if (password === selectedEmployee.password) {
        // Enregistrer le pointage
        const clockInData = {
          employeeId: selectedEmployee.id,
          employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('fr-FR'),
          timestamp: new Date().toISOString(),
          referenceTime: selectedEmployee.referenceTime
        };

        // Sauvegarder dans localStorage
        const existingClockIns = JSON.parse(localStorage.getItem('clockIns') || '[]');
        existingClockIns.push(clockInData);
        localStorage.setItem('clockIns', JSON.stringify(existingClockIns));

        toast({
          title: "Pointage réussi ! ✅",
          description: `Bonjour ${selectedEmployee.firstName}, votre arrivée a été enregistrée à ${clockInData.time}`,
        });

        // Reset
        setSelectedEmployee(null);
        setPassword('');
      } else {
        toast({
          title: "Mot de passe incorrect",
          description: "Veuillez vérifier votre mot de passe et réessayer",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            onClick={() => onNavigate('home')}
            variant="outline"
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white backdrop-blur-lg bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Pointage Employé
            </h1>
            <p className="text-gray-300 mt-2">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center text-purple-400">
            <Clock className="w-6 h-6 mr-2" />
            <span className="text-lg font-mono">
              {new Date().toLocaleTimeString('fr-FR')}
            </span>
          </div>
        </motion.div>

        {!selectedEmployee ? (
          // Liste des employés
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Sélectionnez votre profil</h2>
              <p className="text-gray-300">Cliquez sur votre photo pour commencer le pointage</p>
            </div>

            {employees.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
                  <Clock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun employé enregistré</h3>
                  <p className="text-gray-300 mb-4">Demandez à votre responsable d'ajouter votre profil</p>
                  <Button
                    onClick={() => onNavigate('admin-login')}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  >
                    Accès Admin
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {employees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmployeeSelect(employee)}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                      {employee.photo ? (
                        <img src={employee.photo} alt={`${employee.firstName} ${employee.lastName}`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{employee.firstName}</h3>
                    <h4 className="text-white font-medium">{employee.lastName}</h4>
                    <p className="text-gray-300 text-sm mt-1">{employee.position}</p>
                    <p className="text-purple-400 text-xs mt-2">Horaire: {employee.referenceTime}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          // Formulaire de pointage
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              {/* Profil sélectionné */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  {selectedEmployee.photo ? (
                    <img src={selectedEmployee.photo} alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <p className="text-purple-400">{selectedEmployee.position}</p>
                <p className="text-gray-300 text-sm">Horaire de référence: {selectedEmployee.referenceTime}</p>
              </div>

              {/* Formulaire mot de passe */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-white">Mot de passe personnel</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      className="bg-white/20 border-white/30 text-white placeholder-gray-300 pr-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleClockIn()}
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

                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedEmployee(null)}
                    variant="outline"
                    className="flex-1 border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleClockIn}
                    disabled={isLoading || !password}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Pointage...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Pointer
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EmployeeClockIn;