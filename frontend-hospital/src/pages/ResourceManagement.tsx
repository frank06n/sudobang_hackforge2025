import { useState } from 'react';
import { BedDouble, Users, Stethoscope, Package, Plus, Minus, AlertTriangle, CheckCircle, Edit, Save, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ResourceManagement = () => {
  // State for bed availability
  const [bedData, setBedData] = useState({
    totalBeds: 120,
    availableBeds: 42,
    categories: [
      { name: 'General Ward', total: 60, available: 22 },
      { name: 'ICU', total: 15, available: 5 },
      { name: 'NICU', total: 10, available: 4 },
      { name: 'Emergency', total: 25, available: 8 },
      { name: 'Operation Theatre', total: 10, available: 3 }
    ]
  });

  
  // State for doctors and staff
  const [staffData, setStaffData] = useState({
    doctors: [
      { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Emergency Medicine', status: 'on-duty' },
      { id: 2, name: 'Dr. Michael Chen', specialization: 'Cardiology', status: 'on-duty' },
      { id: 3, name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics', status: 'off-duty' },
      { id: 4, name: 'Dr. David Lee', specialization: 'Neurology', status: 'on-duty' },
      { id: 5, name: 'Dr. Priya Patel', specialization: 'Surgery', status: 'off-duty' }
    ],
    editingDoctorId: null as number | null
  });

  // State for equipment
  const [equipmentData, setEquipmentData] = useState([
    { id: 1, name: 'Ventilators', total: 25, functional: 20, status: 'functional' },
    { id: 2, name: 'X-Ray Machines', total: 8, functional: 7, status: 'functional' },
    { id: 3, name: 'MRI Scanner', total: 2, functional: 1, status: 'partially functional' },
    { id: 4, name: 'Dialysis Machines', total: 15, functional: 15, status: 'functional' },
    { id: 5, name: 'Defibrillators', total: 30, functional: 28, status: 'functional' }
  ]);

  // Handle bed count updates
  const updateBedCount = (index: number, action: 'increase' | 'decrease') => {
    const updatedCategories = [...bedData.categories]; 
    if (action === 'increase' && updatedCategories[index].available < updatedCategories[index].total) {
      updatedCategories[index].available += 1;
    } else if (action === 'decrease' && updatedCategories[index].available > 0) {
      updatedCategories[index].available -= 1;
    }

    // Update total available beds
    const newAvailableBeds = updatedCategories.reduce((sum, category) => sum + category.available, 0);
    
    setBedData({
      ...bedData,
      availableBeds: newAvailableBeds,
      categories: updatedCategories
    });
  };

  // Handle doctor status toggle
  const toggleDoctorStatus = (doctorId: number) => {
    const updatedDoctors = staffData.doctors.map(doctor => {
      if (doctor.id === doctorId) {
        return {
          ...doctor,
          status: doctor.status === 'on-duty' ? 'off-duty' : 'on-duty'
        };
      }
      return doctor;
    });

    setStaffData({
      ...staffData,
      doctors: updatedDoctors
    });
  };

  // Handle equipment status toggle
  const toggleEquipmentStatus = (equipmentId: number) => {
    const updatedEquipment = equipmentData.map(equipment => {
      if (equipment.id === equipmentId) {
        const newStatus = equipment.status === 'functional' ? 'out of order' : 'functional';
        const newFunctional = newStatus === 'functional' ? equipment.total : 0;
        
        return {
          ...equipment,
          status: newStatus,
          functional: newFunctional
        };
      }
      return equipment;
    });

    setEquipmentData(updatedEquipment);
  };

  // Update equipment functional count
  const updateEquipmentCount = (equipmentId: number, action: 'increase' | 'decrease') => {
    const updatedEquipment = equipmentData.map(equipment => {
      if (equipment.id === equipmentId) {
        let newFunctional = equipment.functional;
        
        if (action === 'increase' && newFunctional < equipment.total) {
          newFunctional += 1;
        } else if (action === 'decrease' && newFunctional > 0) {
          newFunctional -= 1;
        }
        
        const newStatus = newFunctional === equipment.total ? 'functional' : 
                          newFunctional === 0 ? 'out of order' : 'partially functional';
        
        return {
          ...equipment,
          functional: newFunctional,
          status: newStatus
        };
      }
      return equipment;
    });

    setEquipmentData(updatedEquipment);
  };

  // Begin editing doctor
  const startEditingDoctor = (doctorId: number) => {
    setStaffData({
      ...staffData,
      editingDoctorId: doctorId
    });
  };

  // Save doctor edit
  const saveDoctor = () => {
    setStaffData({
      ...staffData,
      editingDoctorId: null
    });
  };

  // Cancel doctor edit
  const cancelEditDoctor = () => {
    setStaffData({
      ...staffData,
      editingDoctorId: null
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header bar gradient */}
      <Header />
      
      <div className="container mx-auto p-6">
        
        
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center mb-4">
              <BedDouble className="text-cyan-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold">Bed Availability</h2>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Available</p>
                <p className="text-3xl font-bold text-cyan-400">{bedData.availableBeds}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-3xl font-bold">{bedData.totalBeds}</p>
              </div>
              <div className="h-16 w-16">
                <div className="h-full w-full rounded-full border-4 border-gray-700 flex items-center justify-center relative">
                  <div className="absolute text-sm font-medium">
                    {Math.round((bedData.availableBeds / bedData.totalBeds) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center mb-4">
              <Users className="text-purple-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold">Staff On Duty</h2>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">On Duty</p>
                <p className="text-3xl font-bold text-purple-400">
                  {staffData.doctors.filter(d => d.status === 'on-duty').length}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-3xl font-bold">{staffData.doctors.length}</p>
              </div>
              <div className="h-16 w-16">
                <div className="h-full w-full rounded-full border-4 border-gray-700 flex items-center justify-center relative">
                  <div className="absolute text-sm font-medium">
                    {Math.round((staffData.doctors.filter(d => d.status === 'on-duty').length / staffData.doctors.length) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center mb-4">
              <Package className="text-cyan-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold">Equipment Status</h2>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Functional</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {equipmentData.reduce((sum, equip) => sum + equip.functional, 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-3xl font-bold">
                  {equipmentData.reduce((sum, equip) => sum + equip.total, 0)}
                </p>
              </div>
              <div className="h-16 w-16">
                <div className="h-full w-full rounded-full border-4 border-gray-700 flex items-center justify-center relative">
                  <div className="absolute text-sm font-medium">
                    {Math.round((equipmentData.reduce((sum, equip) => sum + equip.functional, 0) / 
                              equipmentData.reduce((sum, equip) => sum + equip.total, 0)) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bed Management Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <BedDouble className="text-cyan-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Bed Management</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 font-medium text-gray-400">Category</th>
                  <th className="pb-3 font-medium text-gray-400">Available / Total</th>
                  <th className="pb-3 font-medium text-gray-400">Status</th>
                  <th className="pb-3 font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bedData.categories.map((category, index) => (
                  <tr key={category.name} className="border-b border-gray-700">
                    <td className="py-4 font-medium">{category.name}</td>
                    <td className="py-4">
                      <span className="text-cyan-400 font-medium">{category.available}</span> / {category.total}
                    </td>
                    <td className="py-4">
                      {category.available === 0 ? (
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-full text-xs">Full</span>
                      ) : category.available < category.total * 0.2 ? (
                        <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs">Limited</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Available</span>
                      )}
                    </td>
                    <td className="py-4 flex justify-end space-x-2">
                      <button 
                        onClick={() => updateBedCount(index, 'decrease')}
                        className="p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <button 
                        onClick={() => updateBedCount(index, 'increase')}
                        className="p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Doctors & Staff Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <Stethoscope className="text-purple-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Doctors & Staff</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffData.doctors.map(doctor => (
              <div key={doctor.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                {staffData.editingDoctorId === doctor.id ? (
                  <div className="flex flex-col space-y-3">
                    <input
                      type="text"
                      defaultValue={doctor.name}
                      className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      defaultValue={doctor.specialization}
                      className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={cancelEditDoctor}
                        className="p-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={saveDoctor}
                        className="p-2 rounded-md bg-cyan-600 hover:bg-cyan-500 transition-colors"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-medium">{doctor.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditingDoctor(doctor.id)}
                          className="p-1 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{doctor.specialization}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        {doctor.status === 'on-duty' ? (
                          <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">On Duty</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">Off Duty</span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleDoctorStatus(doctor.id)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          doctor.status === 'on-duty'
                            ? 'bg-gray-600 hover:bg-gray-500'
                            : 'bg-cyan-600 hover:bg-cyan-500'
                        } transition-colors`}
                      >
                        {doctor.status === 'on-duty' ? 'Mark Off Duty' : 'Mark On Duty'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add new doctor card */}
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
              <div className="flex flex-col items-center text-gray-400">
                <Plus size={24} className="mb-2" />
                <span>Add New Staff Member</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Equipment & Facilities Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center mb-6">
            <Package className="text-cyan-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Equipment & Facilities</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 font-medium text-gray-400">Equipment</th>
                  <th className="pb-3 font-medium text-gray-400">Functional / Total</th>
                  <th className="pb-3 font-medium text-gray-400">Status</th>
                  <th className="pb-3 font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipmentData.map(equipment => (
                  <tr key={equipment.id} className="border-b border-gray-700">
                    <td className="py-4 font-medium">{equipment.name}</td>
                    <td className="py-4">
                      <span className="text-cyan-400 font-medium">{equipment.functional}</span> / {equipment.total}
                    </td>
                    <td className="py-4">
                      {equipment.status === 'functional' ? (
                        <div className="flex items-center">
                          <CheckCircle size={16} className="text-green-400 mr-2" />
                          <span className="text-green-400">Functional</span>
                        </div>
                      ) : equipment.status === 'partially functional' ? (
                        <div className="flex items-center">
                          <AlertTriangle size={16} className="text-yellow-400 mr-2" />
                          <span className="text-yellow-400">Partially Functional</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <X size={16} className="text-red-400 mr-2" />
                          <span className="text-red-400">Out of Order</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 flex justify-end space-x-2">
                      <button 
                        onClick={() => updateEquipmentCount(equipment.id, 'decrease')}
                        className="p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <button 
                        onClick={() => updateEquipmentCount(equipment.id, 'increase')}
                        className="p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-lg transition-all">
              <Plus size={18} className="mr-2" />
              Add New Equipment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResourceManagement;