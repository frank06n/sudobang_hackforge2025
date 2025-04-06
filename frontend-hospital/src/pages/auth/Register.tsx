import { useState } from 'react';
import { ChevronRight, ChevronLeft, Hospital, MapPin, Phone, Upload, Bed, DollarSign, User, CheckCircle, ClipboardList } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4; 
  
  // Form state
  const [formData, setFormData] = useState({
    hospitalName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    contactNumber: '',
    emergencyNumber: '',
    facilities: '',
    bedAvailability: '',
    pricing: '',
    doctors: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    console.log("nextStep called, current step:", step);
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    console.log("prevStep called, current step:", step);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const skipToReview = () => {
    setStep(4); 
  };

  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 relative">
        {/* Background gradient elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-600 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-600 opacity-20 rounded-full blur-3xl"></div>
        
        {/* Progress indicator */}
        <div className="w-full h-2 bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Hospital Registration</span>
            </h1>
            <div className="text-gray-400 text-sm">
              Step {step} of {totalSteps}
            </div>
          </div>
          
          <div className="mt-8">
            {/* Step 1: Basic Details */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Hospital className="mr-2 text-cyan-500" size={20} />
                  Basic Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Hospital Name</label>
                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter hospital name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Email Address</label>
                    <input
                      type="text"
                      name="emailAddress"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Password</label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter password"
                    />
                  </div>


                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Confirm Password</label>
                    <input
                      type="text"
                      name="confirmPassword"
                      //value={formData.hospitalName}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Confirm your password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Enter complete address"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-1 text-sm">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                          placeholder="General contact number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-1 text-sm">Emergency Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                          type="tel"
                          name="emergencyNumber"
                          value={formData.emergencyNumber}
                          onChange={handleChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                          placeholder="Emergency contact number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Facilities and Beds */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Bed className="mr-2 text-cyan-500" size={20} />
                  Facilities & Availability
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Available Facilities</label>
                    <textarea
                      name="facilities"
                      value={formData.facilities}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="List facilities (ICUs, NICUs, special units, etc.)"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Bed Availability</label>
                    <input
                      type="text"
                      name="bedAvailability"
                      value={formData.bedAvailability}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Total beds, available beds"
                    />
                  </div>
                  
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-4">
                    <div className="flex items-center mb-2">
                      <Upload className="mr-2 text-purple-500" size={18} />
                      <span className="text-gray-300">Upload Facility Images</span>
                    </div>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                      <p className="text-gray-400 text-sm">Drag and drop images, or <span className="text-cyan-500">browse</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Pricing and Doctors */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <DollarSign className="mr-2 text-cyan-500" size={20} />
                  Pricing & Staff Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Pricing Information</label>
                    <textarea
                      name="pricing"
                      value={formData.pricing}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Room charges, ICU charges, emergency services, etc."
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Doctors & Specializations</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={16} />
                      <textarea
                        name="doctors"
                        value={formData.doctors}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="List available doctors and their specializations"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-sm text-gray-300">
                        Your hospital will be visible on the ResQNet emergency response network once registration is approved. 
                        All information can be updated later from your dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <ClipboardList className="mr-2 text-cyan-500" size={20} />
                  Review Information
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-cyan-400 mb-2">Basic Details</h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hospital Name:</span>
                        <span className="text-gray-200">{formData.hospitalName || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Address:</span>
                        <span className="text-gray-200">{formData.address || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contact Number:</span>
                        <span className="text-gray-200">{formData.contactNumber || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Emergency Number:</span>
                        <span className="text-gray-200">{formData.emergencyNumber || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-purple-400 mb-2">Additional Information</h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Facilities:</span>
                        <span className="text-gray-200">{formData.facilities || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bed Availability:</span>
                        <span className="text-gray-200">{formData.bedAvailability || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pricing:</span>
                        <span className="text-gray-200">{formData.pricing || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Doctors:</span>
                        <span className="text-gray-200">{formData.doctors || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 rounded-lg p-4 border border-cyan-800/30">
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-sm text-gray-300">
                        Please review all information before submitting. Your hospital's registration will be reviewed by our team before being activated on the ResQNet platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation buttons */}
          <div className="mt-10 flex justify-between">
            <div></div>
            
            <div className="flex space-x-3">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="flex items-center bg-gray-700 text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft className="mr-2" size={18} />
                  Back
                </button>
              )}
              
              {(step === 2 || step === 3) && (
                <button 
                  onClick={skipToReview}
                  className="text-gray-300 border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700 transition-all"
                >
                  Skip Additional Details
                </button>
              )}

              {step < 4 && (
                <button 
                  onClick={nextStep}
                  className="flex items-center bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Next
                  <ChevronRight className="ml-2" size={18} />
                </button>
              )}
              
              {step === 4 && (
                <button 
                  className="flex items-center bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Complete Registration
                  <CheckCircle className="ml-2" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;