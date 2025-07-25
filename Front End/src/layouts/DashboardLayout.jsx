import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import isAdmin from '../utils/isAdmin';

const DashboardLayout = () => {
  const { user } = useSelector(state => state.user);
  const adminUser = isAdmin(user?.role);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Dashboard</h2>
          
          <nav className="space-y-2">
            <a 
              href="/dashboard/myorders" 
              className="block px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              My Orders
            </a>
            
            {adminUser && (
              <a 
                href="/dashboard/admin-orders" 
                className="block px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Manage Orders
              </a>
            )}
          </nav>
        </div>
        
        {/* Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;