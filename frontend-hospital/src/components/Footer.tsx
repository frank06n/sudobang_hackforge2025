import { Hospital, Mail, Github, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <Hospital className="text-cyan-500 mr-2" size={24} />
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                ResQNet
              </h2>
            </div>
            <p className="text-gray-400 text-sm text-center md:text-left mb-4">
              Connecting emergency services to save lives and improve healthcare coordination.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Links section */}
          <div className="md:mx-auto">
            <h3 className="text-gray-200 font-medium mb-4 text-center md:text-left">Quick Links</h3>
            <ul className="space-y-2 text-center md:text-left">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Dashboard</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Emergency Cases</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} ResQNet. All rights reserved.</p>
          <div className="flex items-center mt-4 md:mt-0">
            <p className="text-gray-400 text-sm flex items-center">
              Made with <Heart size={14} className="text-red-500 mx-1" /> by sudo bang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;