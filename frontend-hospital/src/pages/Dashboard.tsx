import { useState } from 'react';
import {
  Hospital,
  Users,
  Truck,
  Bell,
  Bed,
  Clock,
  UserCheck,
  FileText,
  Settings,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  // Mock data - would be replaced with real API calls
  const [hospitalData, setHospitalData] = useState({
    totalBeds: 120,
    availableBeds: 42,
    activeCases: 6,
    incomingAmbulances: 2,
    lastUpdated: new Date().toLocaleTimeString()
  });

  const [emergencyCases, setEmergencyCases] = useState([
    {
      id: 'EMG-2025-0412',
      patientName: 'John Doe',
      condition: 'Critical - Multiple Trauma',
      eta: '4 minutes',
      paramedic: 'Dr. Sarah Johnson',
      notes: 'Car accident victim, possible internal bleeding, requires immediate surgery prep',
      priority: 'high'
    },
    {
      id: 'EMG-2025-0411',
      patientName: 'Emily Chen',
      condition: 'Moderate - Respiratory Distress',
      eta: '12 minutes',
      paramedic: 'Robert Williams',
      notes: 'Asthma attack, responding to initial treatment, oxygen levels stabilizing',
      priority: 'medium'
    }
  ]);

  // Function to refresh dashboard data
  const refreshData = () => {
    console.log('Refreshing dashboard data...');
    // This would be replaced with actual API calls
    setHospitalData({
      ...hospitalData,
      lastUpdated: new Date().toLocaleTimeString()
    });
  };

  // Get status color based on priority
  const getPriorityColor = (priority: string):string => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  // Calculate bed availability percentage
  const bedAvailabilityPercent = Math.round((hospitalData.availableBeds / hospitalData.totalBeds) * 100);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Top navigation bar */}
      <Header />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Status headers */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Hospital Dashboard</h2>
          <div className="flex items-center text-sm text-gray-400">
            <Clock size={14} className="mr-1" />
            <span>Last updated: {hospitalData.lastUpdated}</span>
            <button 
              onClick={refreshData}
              className="ml-2 p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={14} className="text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Bed Availability */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-16 h-16 bg-cyan-600 opacity-20 rounded-full blur-xl"></div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 mb-1 text-sm">Bed Availability</p>
                <div className="flex items-baseline">
                  <h3 className="text-3xl font-bold">{hospitalData.availableBeds}</h3>
                  <span className="text-gray-400 ml-2">/ {hospitalData.totalBeds}</span>
                </div>
                <div className="flex items-center mt-2">
                  {bedAvailabilityPercent < 20 ? (
                    <ArrowDown size={14} className="text-red-500 mr-1" />
                  ) : (
                    <ArrowUp size={14} className="text-green-500 mr-1" />
                  )}
                  <span className={bedAvailabilityPercent < 20 ? "text-red-500" : "text-green-500"}>
                    {bedAvailabilityPercent}% available
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-full h-fit">
                <Bed className="text-cyan-500" size={24} />
              </div>
            </div>
            <div className="mt-4 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${bedAvailabilityPercent < 20 ? 'bg-red-500' : 'bg-cyan-500'}`}
                style={{ width: `${bedAvailabilityPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Active Cases */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg relative overflow-hidden">
            <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-purple-600 opacity-20 rounded-full blur-xl"></div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 mb-1 text-sm">Active Emergency Cases</p>
                <div className="flex items-baseline">
                  <h3 className="text-3xl font-bold">{hospitalData.activeCases}</h3>
                  <span className="text-gray-400 ml-2">cases</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {hospitalData.activeCases > 0 ? `${hospitalData.activeCases} requiring attention` : 'No active cases'}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-full h-fit">
                <Users className="text-purple-500" size={24} />
              </div>
            </div>
          </div>

          {/* Incoming Ambulances */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-green-600 opacity-20 rounded-full blur-xl"></div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 mb-1 text-sm">Incoming Ambulances</p>
                <div className="flex items-baseline">
                  <h3 className="text-3xl font-bold">{hospitalData.incomingAmbulances}</h3>
                  <span className="text-gray-400 ml-2">vehicles</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-cyan-500 flex items-center">
                    <Clock size={14} className="mr-1" />
                    Nearest arrival: 4 min
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-full h-fit">
                <Truck className="text-green-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Live Emergency Cases */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Live Emergency Cases</h3>
            <div className="flex space-x-2">
              <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-gray-200 transition-colors">
                All Cases
              </button>
              <button className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-gray-400 transition-colors">
                Incoming
              </button>
              <button className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-gray-400 transition-colors">
                In Treatment
              </button>
            </div>
          </div>

          {emergencyCases.length > 0 ? (
            <div className="space-y-4">
              {emergencyCases.map(emergency => (
                <div 
                  key={emergency.id}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-lg hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start">
                    <div className={`w-3 h-3 ${getPriorityColor(emergency.priority)} rounded-full mt-2 mr-3`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{emergency.patientName}</h4>
                          <p className="text-sm text-gray-400">{emergency.id}</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg px-3 py-1 text-sm flex items-center">
                          <Clock size={14} className="mr-1 text-cyan-500" />
                          <span>ETA: {emergency.eta}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <p className="text-gray-400">Condition</p>
                          <p>{emergency.condition}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Paramedic</p>
                          <p>{emergency.paramedic}</p>
                        </div>
                      </div>
                      <div className="text-sm bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                        <p className="text-gray-300">{emergency.notes}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-cyan-400 transition-colors flex items-center">
                      <FileText size={12} className="mr-1" />
                      View Details
                    </button>
                    <button className="text-xs bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-full text-white transition-colors flex items-center">
                      <Bed size={12} className="mr-1" />
                      Prepare Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-700/50 rounded-full">
                  <Bell className="text-gray-500" size={24} />
                </div>
              </div>
              <h4 className="text-lg font-medium text-gray-300">No Active Emergency Cases</h4>
              <p className="text-gray-400 mt-1">All current cases have been processed</p>
            </div>
          )}
        </div>

        {/* Resource Management Quick Access */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Resource Management</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-900/20">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-700/50 rounded-full">
                  <Bed className="text-cyan-500" size={24} />
                </div>
              </div>
              <p className="font-medium">Beds</p>
              <p className="text-xs text-gray-400 mt-1">Update availability</p>
            </button>
            
            <button className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-900/20">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-700/50 rounded-full">
                  <Hospital className="text-purple-500" size={24} />
                </div>
              </div>
              <p className="font-medium">Facilities</p>
              <p className="text-xs text-gray-400 mt-1">Manage resources</p>
            </button>
            
            <button className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-900/20">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-700/50 rounded-full">
                  <UserCheck className="text-green-500" size={24} />
                </div>
              </div>
              <p className="font-medium">Doctors</p>
              <p className="text-xs text-gray-400 mt-1">Staff management</p>
            </button>
            
            <button className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-900/20">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-700/50 rounded-full">
                  <FileText className="text-yellow-500" size={24} />
                </div>
              </div>
              <p className="font-medium">Pricing</p>
              <p className="text-xs text-gray-400 mt-1">Update service costs</p>
            </button>
            
            <button className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-900/20">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-700/50 rounded-full">
                  <Settings className="text-blue-500" size={24} />
                </div>
              </div>
              <p className="font-medium">Settings</p>
              <p className="text-xs text-gray-400 mt-1">Hospital preferences</p>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;