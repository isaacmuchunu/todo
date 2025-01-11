import React from 'react';
import { Bell, Settings, Search, Plus } from 'lucide-react';

const Header = ({ title }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-white tracking-tight">{title}</h1>
          <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white font-medium backdrop-blur-sm">
            Beta
          </span>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 ml-6">
          <Search className="w-4 h-4 text-white/70" />
          <input 
            type="text" 
            placeholder="Search tasks..."
            className="bg-transparent text-white placeholder-white/70 focus:outline-none text-sm w-48"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 relative group">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
          <span className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
        </button>
        
        <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 relative group">
          <Settings className="w-5 h-5 text-white" />
          <span className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2" />
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm text-white font-medium">John Doe</span>
            <span className="text-xs text-white/70">Admin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 border border-white/20 
            flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 
            hover:scale-105 cursor-pointer backdrop-blur-sm">
            <span className="text-sm text-white font-medium">JD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;