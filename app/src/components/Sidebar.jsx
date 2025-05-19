import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/Bizly-logo.jpeg';

// Import Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active route
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/');
  };

  // Function to handle navigation to Dashboard page
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  // Function to handle navigation to Pemasukan page
  const navigateToPemasukan = () => {
    navigate('/pemasukan');
  };

  // Function to handle navigation to Pengeluaran page
  const navigateToPengeluaran = () => {
    navigate('/pengeluaran');
  };

  // Function to handle navigation to Profile page
  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="h-screen w-64 bg-gray-200 overflow-y-auto font-['Poppins']">
      <div className="flex flex-col text-blue-600 min-h-full">
        {/* Logo - Now part of the scrollable area */}
        <div className="flex items-center p-4 border-b border-gray-300 sticky top-0 bg-gray-200 z-10">
          <img src={logoImg} alt="Bizly Logo" className="h-8 w-8 mr-2" />
          <span className="font-semibold text-xl">Bizly</span>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col flex-grow">
          <div className="py-4">
            <nav>
              {/* Dashboard */}
              <div 
                onClick={navigateToDashboard} 
                className={`flex items-center px-4 py-3 ${isActive('/dashboard') ? 'text-blue-600 bg-gray-300' : 'text-gray-700'} hover:bg-gray-300 cursor-pointer transition-colors duration-200`}
              >
                <DashboardIcon fontSize="small" />
                <span className="ml-3">Dashboard</span>
              </div>
              
              {/* Pemasukan */}
              <div 
                onClick={navigateToPemasukan} 
                className={`flex items-center px-4 py-3 ${isActive('/pemasukan') ? 'text-blue-600 bg-gray-300' : 'text-gray-700'} hover:bg-gray-300 cursor-pointer transition-colors duration-200`}
              >
                <ArrowUpwardIcon fontSize="small" />
                <span className="ml-3">Pemasukan</span>
              </div>
              
              {/* Pengeluaran */}
              <div 
                onClick={navigateToPengeluaran} 
                className={`flex items-center px-4 py-3 ${isActive('/pengeluaran') ? 'text-blue-600 bg-gray-300' : 'text-gray-700'} hover:bg-gray-300 cursor-pointer transition-colors duration-200`}
              >
                <ArrowDownwardIcon fontSize="small" />
                <span className="ml-3">Pengeluaran</span>
              </div>
              
              {/* Profile */}
              <div 
                onClick={navigateToProfile} 
                className={`flex items-center px-4 py-3 ${isActive('/profile') ? 'text-blue-600 bg-gray-300' : 'text-gray-700'} hover:bg-gray-300 cursor-pointer transition-colors duration-200`}
              >
                <PersonIcon fontSize="small" />
                <span className="ml-3">Profile</span>
              </div>
            </nav>
          </div>
          
          {/* Spacer to push the user profile to the bottom when content is not enough */}
          <div className="flex-grow"></div>
          
          {/* User Profile and Logout */}
          <div className="border-t border-gray-300">
            <div className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-400 flex-shrink-0 overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=68" alt="User" className="h-full w-full object-cover" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Ponyo</p>
                <p className="text-xs text-gray-500">ponyo@gmail.com</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-300 transition duration-150 border-t border-gray-300"
            >
              <LogoutIcon fontSize="small" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;