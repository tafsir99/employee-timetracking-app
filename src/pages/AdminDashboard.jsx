import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Download, 
  LogOut,
  Plus,
  BarChart3,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = ({ onNavigate, onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [clockIns, setClockIns] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = () => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
    const storedClockIns = JSON.parse(localStorage.getItem('clockIns') || '[]');
    
    setEmployees(storedEmployees);
    setClockIns(storedClockIns);
    
    calculateStats(storedEmployees, storedClockIns);
  };

  const calculateStats = (employeeList, clockInList) => {
    const todayClockIns = clockInList.filter(clockIn => clockIn.date === selectedDate);
    const presentEmployeeIds = todayClockIns.map(clockIn => clockIn.employeeId);
    
    const lateCount = todayClockIns.filter(clockIn => {
      const employee = employeeList.find(emp => emp.id === clockIn.employeeId);
      if (!employee) return false;
      
      const referenceTime = employee.referenceTime;
      const clockInTime = clockIn.time;
      
      return clockInTime > referenceTime;
    }).length;

    setStats({
      totalEmployees: employeeList.length,
      presentToday: todayClockIns.length,
      lateToday: lateCount,
      absentToday: employeeList.length - todayClockIns.length
    });
  };

  const exportToCSV = () => {
    const filteredClockIns = clockIns.filter(clockIn => clockIn.date === selectedDate);
    
    if (filteredClockIns.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucun pointage trouvé pour cette date",
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      ['Employé', 'Date', 'Heure d\'arrivée', 'Horaire de référence', 'Statut'].join(','),
      ...filteredClockIns.map(clockIn => {
        const employee = employees.find(emp => emp.id === clockIn.employeeId);
        const isLate = clockIn.time > clockIn.referenceTime;
        return [
          clockIn.employeeName,
          clockIn.date,
          clockIn.time,
          clockIn.referenceTime,
          isLate ? 'En retard' : 'À l\'heure'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pointages_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi ! 📊",
      description: "Le fichier CSV a été téléchargé",
    });
  };

  const getTodayClockIns = () => {
    return clockIns
      .filter(clockIn => clockIn.date === selectedDate)
      .map(clockIn => {
        const employee = employees.find(emp => emp.id === clockIn.employeeId);
        const isLate = clockIn.time > clockIn.referenceTime;
        return {
          ...clockIn,
          employee,
          isLate
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Tableau de Bord Admin
            </h1>
            <p className="text-gray-300 mt-2">Gestion et suivi des pointages</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => onNavigate('employee-management')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Gérer Employés
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Employés</p>
                <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Présents</p>
                <p className="text-2xl font-bold text-green-400">{stats.presentToday}</p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">En Retard</p>
                <p className="text-2xl font-bold text-orange-400">{stats.lateToday}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Absents</p>
                <p className="text-2xl font-bold text-red-400">{stats.absentToday}</p>
              </div>
              <Calendar className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-400" />
                <label className="text-white font-medium">Date :</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            
            <Button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </motion.div>

        {/* Pointages du jour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">
                Pointages du {new Date(selectedDate).toLocaleDateString('fr-FR')}
              </h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {getTodayClockIns().length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Aucun pointage</h3>
                <p className="text-gray-300">Aucun employé n'a pointé pour cette date</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-medium">Employé</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Poste</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Heure d'arrivée</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Horaire de référence</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {getTodayClockIns().map((clockIn, index) => (
                    <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            {clockIn.employee?.photo ? (
                              <img src={clockIn.employee.photo} alt={clockIn.employeeName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white text-sm font-bold">
                                {clockIn.employeeName.split(' ').map(n => n[0]).join('')}
                              </span>
                            )}
                          </div>
                          <span className="text-white font-medium">{clockIn.employeeName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{clockIn.employee?.position || 'N/A'}</td>
                      <td className="p-4 text-white font-mono">{clockIn.time}</td>
                      <td className="p-4 text-gray-300 font-mono">{clockIn.referenceTime}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          clockIn.isLate 
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {clockIn.isLate ? 'En retard' : 'À l\'heure'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;