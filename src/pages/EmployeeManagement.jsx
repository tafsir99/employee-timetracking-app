import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const EmployeeManagement = ({ onNavigate }) => {
  const [employees, setEmployees] = useState([]);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    position: '',
    password: '',
    referenceTime: '09:00',
    photo: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
    setEmployees(storedEmployees);
  };

  const saveEmployees = (employeeList) => {
    localStorage.setItem('employees', JSON.stringify(employeeList));
    setEmployees(employeeList);
  };

  const handleAddEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.position || !newEmployee.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const employee = {
      id: Date.now().toString(),
      ...newEmployee,
      createdAt: new Date().toISOString()
    };

    const updatedEmployees = [...employees, employee];
    saveEmployees(updatedEmployees);

    toast({
      title: "Employé ajouté ! ✅",
      description: `${newEmployee.firstName} ${newEmployee.lastName} a été ajouté avec succès`,
    });

    setNewEmployee({
      firstName: '',
      lastName: '',
      position: '',
      password: '',
      referenceTime: '09:00',
      photo: ''
    });
    setIsAddingEmployee(false);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee({ ...employee });
  };

  const handleUpdateEmployee = () => {
    if (!editingEmployee.firstName || !editingEmployee.lastName || !editingEmployee.position) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const updatedEmployees = employees.map(emp => 
      emp.id === editingEmployee.id ? editingEmployee : emp
    );
    saveEmployees(updatedEmployees);

    toast({
      title: "Employé modifié ! ✅",
      description: `${editingEmployee.firstName} ${editingEmployee.lastName} a été mis à jour`,
    });

    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    saveEmployees(updatedEmployees);

    // Supprimer aussi les pointages de cet employé
    const clockIns = JSON.parse(localStorage.getItem('clockIns') || '[]');
    const filteredClockIns = clockIns.filter(clockIn => clockIn.employeeId !== employeeId);
    localStorage.setItem('clockIns', JSON.stringify(filteredClockIns));

    toast({
      title: "Employé supprimé",
      description: `${employee.firstName} ${employee.lastName} a été supprimé`,
    });
  };

  const EmployeeForm = ({ employee, onChange, onSave, onCancel, isEditing = false }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-6">
        {isEditing ? 'Modifier l\'employé' : 'Nouvel employé'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-white">Prénom *</Label>
          <Input
            id="firstName"
            value={employee.firstName}
            onChange={(e) => onChange({ ...employee, firstName: e.target.value })}
            placeholder="Prénom"
            className="bg-white/20 border-white/30 text-white placeholder-gray-300"
          />
        </div>
        
        <div>
          <Label htmlFor="lastName" className="text-white">Nom *</Label>
          <Input
            id="lastName"
            value={employee.lastName}
            onChange={(e) => onChange({ ...employee, lastName: e.target.value })}
            placeholder="Nom de famille"
            className="bg-white/20 border-white/30 text-white placeholder-gray-300"
          />
        </div>
        
        <div>
          <Label htmlFor="position" className="text-white">Poste *</Label>
          <Input
            id="position"
            value={employee.position}
            onChange={(e) => onChange({ ...employee, position: e.target.value })}
            placeholder="Poste ou rôle"
            className="bg-white/20 border-white/30 text-white placeholder-gray-300"
          />
        </div>
        
        <div>
          <Label htmlFor="referenceTime" className="text-white">Horaire de référence</Label>
          <Input
            id="referenceTime"
            type="time"
            value={employee.referenceTime}
            onChange={(e) => onChange({ ...employee, referenceTime: e.target.value })}
            className="bg-white/20 border-white/30 text-white"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="password" className="text-white">Mot de passe personnel *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={employee.password}
              onChange={(e) => onChange({ ...employee, password: e.target.value })}
              placeholder="Mot de passe sécurisé"
              className="bg-white/20 border-white/30 text-white placeholder-gray-300 pr-10"
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
        
        <div className="md:col-span-2">
          <Label htmlFor="photo" className="text-white">URL Photo de profil (optionnel)</Label>
          <Input
            id="photo"
            value={employee.photo}
            onChange={(e) => onChange({ ...employee, photo: e.target.value })}
            placeholder="https://exemple.com/photo.jpg"
            className="bg-white/20 border-white/30 text-white placeholder-gray-300"
          />
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
        >
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button
          onClick={onSave}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </motion.div>
  );

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
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('admin-dashboard')}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white backdrop-blur-lg bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Gestion Employés
              </h1>
              <p className="text-gray-300 mt-2">Ajouter, modifier et supprimer des employés</p>
            </div>
          </div>
          
          {!isAddingEmployee && !editingEmployee && (
            <Button
              onClick={() => setIsAddingEmployee(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Employé
            </Button>
          )}
        </motion.div>

        {/* Add Employee Form */}
        {isAddingEmployee && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <EmployeeForm
              employee={newEmployee}
              onChange={setNewEmployee}
              onSave={handleAddEmployee}
              onCancel={() => setIsAddingEmployee(false)}
            />
          </motion.div>
        )}

        {/* Edit Employee Form */}
        {editingEmployee && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <EmployeeForm
              employee={editingEmployee}
              onChange={setEditingEmployee}
              onSave={handleUpdateEmployee}
              onCancel={() => setEditingEmployee(null)}
              isEditing={true}
            />
          </motion.div>
        )}

        {/* Employee List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">
              Employés enregistrés ({employees.length})
            </h2>
          </div>
          
          {employees.length === 0 ? (
            <div className="p-8 text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucun employé</h3>
              <p className="text-gray-300 mb-4">Commencez par ajouter votre premier employé</p>
              <Button
                onClick={() => setIsAddingEmployee(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un employé
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-medium">Employé</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Poste</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Horaire</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Ajouté le</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            {employee.photo ? (
                              <img src={employee.photo} alt={`${employee.firstName} ${employee.lastName}`} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white font-bold">
                                {employee.firstName[0]}{employee.lastName[0]}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{employee.firstName} {employee.lastName}</p>
                            <p className="text-gray-400 text-sm">ID: {employee.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{employee.position}</td>
                      <td className="p-4 text-white font-mono">{employee.referenceTime}</td>
                      <td className="p-4 text-gray-300">
                        {new Date(employee.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditEmployee(employee)}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            size="sm"
                            variant="destructive"
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeManagement;