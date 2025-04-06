import { useState, useEffect } from 'react';
import { Menu, X, Download, ArrowRight, Activity, Ambulance, Hospital, Users, ChevronRight } from 'lucide-react';
import hospitalImage from '../assets/hospital-room.jpg';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header/Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-800 shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <a href="#" className="flex items-center">
            <Activity className="h-8 w-8 text-cyan-500" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">ResQNet</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">How It Works</a>
              <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>
            </nav>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all">Login</button>
          </div>
          
          <button 
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 shadow-lg py-4 px-4 space-y-4 border-t border-gray-700">
            <a href="#" className="block py-2 hover:text-cyan-400">Home</a>
            <a href="#features" className="block py-2 hover:text-cyan-400">Features</a>
            <a href="#how-it-works" className="block py-2 hover:text-cyan-400">How It Works</a>
            <a href="#contact" className="block py-2 hover:text-cyan-400">Contact</a>
            <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all">Login</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-cyan-600 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-purple-600 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute right-1/3 bottom-0 w-80 h-80 bg-indigo-600 opacity-20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Seamless Emergency Response</span> for Hospitals
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
                For citizens and patients, download our app to access emergency services. For hospitals, continue on this website to manage cases, resources, and response times.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-xl transition-all flex items-center justify-center">
                  <Download className="mr-2 h-5 w-5" />
                  Download the App
                </button>
                <button className="bg-gray-800 text-gray-100 border border-gray-700 font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center">
                  Hospital Dashboard Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="relative z-10 bg-gray-800 p-4 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                  <img 
                    src={hospitalImage} 
                    alt="Emergency Response Dashboard" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-cyan-600 text-white px-6 py-2 rounded-full transform rotate-3 shadow-lg">
                  Real-time Response
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 bg-gray-800 p-3 rounded-lg shadow-lg flex items-center space-x-2 z-20 animate-pulse border border-gray-700">
                <Ambulance className="h-6 w-6 text-cyan-500" />
                <span className="font-semibold">ETA: 4 min</span>
              </div>
              <div className="absolute -bottom-4 left-10 bg-gray-800 p-3 rounded-lg shadow-lg flex items-center space-x-2 z-20 border border-gray-700">
                <Activity className="h-6 w-6 text-green-500" />
                <span className="font-semibold">5 Active Cases</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Features</span> For Hospitals
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform provides powerful tools designed specifically for emergency departments to streamline operations and save lives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Activity className="h-12 w-12 text-cyan-500" />,
                title: "Live Emergency Case Management",
                description: "Monitor incoming cases in real-time with instant alerts and status updates."
              },
              {
                icon: <Ambulance className="h-12 w-12 text-purple-500" />,
                title: "Ambulance Coordination",
                description: "Track and communicate with paramedics for seamless patient handoffs."
              },
              {
                icon: <Hospital className="h-12 w-12 text-blue-400" />,
                title: "Resource Allocation",
                description: "Keep track of beds, equipment, and staff availability across departments."
              },
              {
                icon: <Users className="h-12 w-12 text-green-500" />,
                title: "Patient & Case History",
                description: "Access patient details and emergency records for informed decisions."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-900 p-6 rounded-xl hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-700"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              A streamlined workflow for hospitals and paramedics to save precious minutes during emergencies.
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-2/3 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  number: "01",
                  title: "Get Notified",
                  description: "See emergency cases assigned to your hospital in real-time."
                },
                {
                  number: "02",
                  title: "Assign Resources",
                  description: "Allocate beds, equipment, and staff based on case priority."
                },
                {
                  number: "03",
                  title: "Receive Patient",
                  description: "Track ambulance arrival and prepare for treatment."
                },
                {
                  number: "04",
                  title: "Update Case Status",
                  description: "Mark cases as resolved or ongoing for monitoring."
                }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center relative">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-2 border-cyan-500 mb-4">
                    {step.number}
                  </div>
                  <div className="bg-gray-800 p-6 rounded-xl flex flex-col shadow-lg text-center w-full border border-gray-700">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Who Should <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Use This?</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform is designed for all stakeholders in the emergency response ecosystem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Hospitals & Emergency Units",
                description: "Manage emergency cases efficiently with real-time insights and resource optimization.",
                action: "Get Started"
              },
              {
                title: "Paramedics & Ambulance Services",
                description: "Get case details and assist patients faster with direct communication to hospitals.",
                action: "Learn More"
              },
              {
                title: "Government & NGOs",
                description: "Ensure proper medical response during crises with system-wide monitoring.",
                action: "Partner With Us"
              }
            ].map((user, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-xl hover:shadow-2xl transition-all border border-gray-700"
              >
                <h3 className="text-xl font-bold mb-4">{user.title}</h3>
                <p className="mb-6 text-gray-300">{user.description}</p>
                <button className="flex items-center text-cyan-400 font-semibold group">
                  {user.action}
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials/Stats */}
      <section className="py-20 bg-gradient-to-br from-cyan-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <h3 className="text-4xl font-bold mb-2">30%</h3>
              <p>Reduction in emergency response time for hospitals using our system</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p>Hospitals and clinics onboarded across the country</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p>Continuous support and monitoring for all emergency services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white p-10 rounded-2xl shadow-xl relative overflow-hidden border border-gray-700">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600 opacity-20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 opacity-20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Emergency Response?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the network of hospitals that are saving lives with faster, more efficient emergency care coordination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:shadow-xl transition-all">
                  Request a Demo
                </button>
                <button className="bg-gray-700 text-gray-100 font-semibold px-8 py-3 rounded-lg hover:shadow-lg transition-all border border-gray-600">
                  Hospital Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Activity className="h-8 w-8 text-cyan-500" />
                <span className="ml-2 text-xl font-bold">ResQNet</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing emergency response systems for hospitals worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-cyan-400 transition-colors">How It Works</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Accessibility</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@resqnet.com</li>
                <li>+1 (800) 123-4567</li>
                <li>123 Medical Plaza, Suite 200</li>
                <li>San Francisco, CA 94103</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 ResQNet. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <button className="bg-cyan-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
                Hospital Login
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;