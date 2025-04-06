import { useState } from 'react';
import { Hospital, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    // Add your authentication logic here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 relative">
        {/* Background gradient elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-600 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-600 opacity-20 rounded-full blur-3xl"></div>
        
        {/* Login header */}
        <div className="w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
        
        <div className="p-8">
          <div className="flex justify-center items-center mb-8">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">ResQNet Login</span>
            </h1>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-gray-700/50 rounded-full">
              <Hospital className="text-cyan-500" size={32} />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="rememberMe" className="text-gray-300">Remember me</label>
                </div>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</a>
              </div>
            </div>
            
            <a href = "/dashboard"
              type="submit"
              className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <LogIn className="mr-2" size={18} />
              Sign In
            </a>
            
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 mt-6">
              <div className="text-center text-sm text-gray-300">
                <p>Don't have an account?</p>
                <a href="/register" className="flex items-center justify-center mt-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                  Register your hospital
                  <ArrowRight className="ml-2" size={14} />
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;