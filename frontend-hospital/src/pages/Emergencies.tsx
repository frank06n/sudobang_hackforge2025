import { useState } from 'react';
import {
  Hospital,
  Users,
  Bell,
  Clock,
  Filter,
  Search,
  Check,
  AlertTriangle,
  FileText,
  Truck,
  UserCheck,
  ChevronDown,
  RefreshCw,
  Calendar,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Emergencies = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('active');
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for filters dropdown
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for active emergency cases
  const [activeCases, setActiveCases] = useState([
    {
      id: 'EMG-2025-0412',
      patientName: 'John Doe',
      patientAge: 42,
      condition: 'Critical - Multiple Trauma',
      eta: '4 minutes',
      paramedic: 'Dr. Sarah Johnson',
      notes: 'Car accident victim, possible internal bleeding, requires immediate surgery prep',
      priority: 'high',
      assignedTo: null,
      timestamp: '10:42 AM'
    },
    {
      id: 'EMG-2025-0411',
      patientName: 'Emily Chen',
      patientAge: 28,
      condition: 'Moderate - Respiratory Distress',
      eta: '12 minutes',
      paramedic: 'Robert Williams',
      notes: 'Asthma attack, responding to initial treatment, oxygen levels stabilizing',
      priority: 'medium',
      assignedTo: 'Dr. Michael Rodriguez',
      timestamp: '10:35 AM'
    },
    {
      id: 'EMG-2025-0410',
      patientName: 'David Wilson',
      patientAge: 65,
      condition: 'Severe - Cardiac Arrest',
      eta: 'Arrived',
      paramedic: 'Jennifer Thompson',
      notes: 'Patient revived in ambulance, unstable condition, cardiac team notified',
      priority: 'high',
      assignedTo: 'Dr. Lisa Cardoza',
      timestamp: '10:20 AM'
    }
  ]);

  // Mock data for resolved emergency cases
  const [resolvedCases, setResolvedCases] = useState([
    {
      id: 'EMG-2025-0409',
      patientName: 'Maria Garcia',
      patientAge: 34,
      condition: 'Moderate - Broken Leg',
      admissionTime: 'Today, 09:15 AM',
      treatment: 'Leg set in cast, pain medication administered',
      assignedDoctor: 'Dr. James Wilson',
      outcome: 'Discharged with follow-up',
      priority: 'medium'
    },
    {
      id: 'EMG-2025-0408',
      patientName: 'Robert Johnson',
      patientAge: 72,
      condition: 'Severe - Stroke',
      admissionTime: 'Today, 08:42 AM',
      treatment: 'Thrombolytic therapy, stabilized',
      assignedDoctor: 'Dr. Emily Chang',
      outcome: 'Transferred to ICU',
      priority: 'high'
    },
    {
      id: 'EMG-2025-0407',
      patientName: 'Sarah Williams',
      patientAge: 8,
      condition: 'Mild - Allergic Reaction',
      admissionTime: 'Today, 07:30 AM',
      treatment: 'Epinephrine, antihistamines',
      assignedDoctor: 'Dr. Robert Patel',
      outcome: 'Discharged, prescription provided',
      priority: 'low'
    },
    {
      id: 'EMG-2025-0406',
      patientName: 'Thomas Brown',
      patientAge: 45,
      condition: 'Critical - Multiple Injuries',
      admissionTime: 'Yesterday, 11:20 PM',
      treatment: 'Emergency surgery, blood transfusion',
      assignedDoctor: 'Dr. Maria Rodriguez',
      outcome: 'Stable, in recovery',
      priority: 'high'
    }
  ]);

  // Function to refresh emergency data
  const refreshData = () => {
    console.log('Refreshing emergency data...');
    // This would be replaced with actual API calls
  };

  // Get status color based on priority
  const getPriorityColor = (priority : string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  // Get status text based on priority
  const getPriorityText = (priority : string) => {
    switch (priority) {
      case 'high': return 'Critical';
      case 'medium': return 'Moderate';
      case 'low': return 'Stable';
      default: return 'Unknown';
    }
  };

  // Filter function for search
  const filteredActiveCases = activeCases.filter(
    (emergency) => 
      emergency.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResolvedCases = resolvedCases.filter(
    (emergency) => 
      emergency.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Top navigation bar */}
      <Header />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Page header with search and filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-2xl font-semibold mb-2 md:mb-0">Emergency Cases</h2>
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative flex-grow md:max-w-md">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by patient name, ID or condition..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <button 
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center hover:bg-gray-700 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} className="mr-2 text-gray-400" />
                  Filters
                  <ChevronDown size={16} className="ml-2 text-gray-400" />
                </button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-300">Priority</p>
                      <div className="flex flex-col space-y-1">
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                          Critical
                        </label>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                          Moderate
                        </label>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          Stable
                        </label>
                      </div>
                      <div className="pt-2 border-t border-gray-700">
                        <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-1 rounded text-sm">
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={refreshData}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center hover:bg-gray-700 transition-colors"
              >
                <RefreshCw size={16} className="mr-2 text-cyan-400" />
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 border-b border-gray-700">
            <button
              className={`py-2 px-4 font-medium text-sm relative ${
                activeTab === 'active'
                  ? 'text-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active Cases
              <span className="ml-2 bg-cyan-500 text-xs px-2 py-0.5 rounded-full">
                {activeCases.length}
              </span>
              {activeTab === 'active' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600"></span>
              )}
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm relative ${
                activeTab === 'resolved'
                  ? 'text-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('resolved')}
            >
              Resolved Cases
              <span className="ml-2 bg-gray-700 text-xs px-2 py-0.5 rounded-full">
                {resolvedCases.length}
              </span>
              {activeTab === 'resolved' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600"></span>
              )}
            </button>
          </div>
        </div>

        {/* Active Cases Section */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {filteredActiveCases.length > 0 ? (
              filteredActiveCases.map(emergency => (
                <div 
                  key={emergency.id}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-lg hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start">
                    <div className={`w-3 h-3 ${getPriorityColor(emergency.priority)} rounded-full mt-2 mr-3`}></div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-lg">{emergency.patientName}</h4>
                            <span className="ml-2 text-sm text-gray-400">{emergency.patientAge} yrs</span>
                          </div>
                          <p className="text-sm text-gray-400">{emergency.id}</p>
                          <div className="flex items-center mt-1">
                            <span className={`text-sm ${emergency.priority === 'high' ? 'text-red-400' : emergency.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                              {getPriorityText(emergency.priority)}
                            </span>
                            <span className="mx-2 text-gray-600">•</span>
                            <span className="text-sm text-gray-400">{emergency.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-700 rounded-lg px-3 py-1 text-sm flex items-center">
                            <Clock size={14} className="mr-1 text-cyan-500" />
                            <span>ETA: {emergency.eta}</span>
                          </div>
                          {emergency.assignedTo ? (
                            <div className="bg-gray-700 rounded-lg px-3 py-1 text-sm flex items-center">
                              <UserCheck size={14} className="mr-1 text-green-500" />
                              <span>{emergency.assignedTo}</span>
                            </div>
                          ) : (
                            <div className="bg-gray-700 rounded-lg px-3 py-1 text-sm flex items-center">
                              <AlertTriangle size={14} className="mr-1 text-yellow-500" />
                              <span>Unassigned</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Condition</p>
                          <p className="bg-gray-700/50 rounded-lg p-2 border border-gray-600 text-sm">
                            {emergency.condition}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Paramedic</p>
                          <p className="bg-gray-700/50 rounded-lg p-2 border border-gray-600 text-sm">
                            {emergency.paramedic}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Initial Assessment</p>
                        <div className="text-sm bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                          <p className="text-gray-300">{emergency.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-2">
                    <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-cyan-400 transition-colors flex items-center">
                      <FileText size={12} className="mr-1" />
                      View Full Details
                    </button>
                    <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-gray-300 transition-colors flex items-center">
                      <UserCheck size={12} className="mr-1" />
                      Assign Doctor
                    </button>
                    {emergency.eta === 'Arrived' ? (
                      <button className="text-xs bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-full text-white transition-colors flex items-center">
                        <ArrowRight size={12} className="mr-1" />
                        Begin Treatment
                      </button>
                    ) : (
                      <button className="text-xs bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-full text-white transition-colors flex items-center">
                        <Truck size={12} className="mr-1" />
                        Track Ambulance
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center shadow-lg">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-700/50 rounded-full">
                    <Check className="text-green-500" size={24} />
                  </div>
                </div>
                <h4 className="text-lg font-medium text-gray-300">No Active Emergency Cases</h4>
                <p className="text-gray-400 mt-1">All current cases have been processed</p>
              </div>
            )}
          </div>
        )}

        {/* Resolved Cases Section */}
        {activeTab === 'resolved' && (
          <div className="space-y-4">
            {filteredResolvedCases.length > 0 ? (
              filteredResolvedCases.map(emergency => (
                <div 
                  key={emergency.id}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-lg hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start">
                    <div className={`w-3 h-3 ${getPriorityColor(emergency.priority)} rounded-full mt-2 mr-3 opacity-50`}></div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-lg">{emergency.patientName}</h4>
                            <span className="ml-2 text-sm text-gray-400">{emergency.patientAge} yrs</span>
                          </div>
                          <p className="text-sm text-gray-400">{emergency.id}</p>
                          <div className="flex items-center mt-1">
                            <CheckCircle size={14} className="text-green-500 mr-1" />
                            <span className="text-sm text-green-400">Resolved</span>
                            <span className="mx-2 text-gray-600">•</span>
                            <span className="text-sm text-gray-400">{emergency.admissionTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-700 rounded-lg px-3 py-1 text-sm flex items-center">
                            <UserCheck size={14} className="mr-1 text-cyan-500" />
                            <span>{emergency.assignedDoctor}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Condition</p>
                          <p className="bg-gray-700/50 rounded-lg p-2 border border-gray-600 text-sm">
                            {emergency.condition}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Outcome</p>
                          <p className="bg-gray-700/50 rounded-lg p-2 border border-gray-600 text-sm">
                            {emergency.outcome}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Treatment Provided</p>
                        <div className="text-sm bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                          <p className="text-gray-300">{emergency.treatment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-2">
                    <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-cyan-400 transition-colors flex items-center">
                      <FileText size={12} className="mr-1" />
                      View Full Details
                    </button>
                    <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-gray-300 transition-colors flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Schedule Follow-up
                    </button>
                    <button className="text-xs bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-full text-white transition-colors flex items-center">
                      <ArrowRight size={12} className="mr-1" />
                      Patient Records
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center shadow-lg">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-700/50 rounded-full">
                    <X className="text-gray-500" size={24} />
                  </div>
                </div>
                <h4 className="text-lg font-medium text-gray-300">No Resolved Cases Found</h4>
                <p className="text-gray-400 mt-1">No previous cases match your search criteria</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Emergencies;