import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { PAGE_DEFINITIONS, type PageKey } from '../../shared/types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, refreshUserPermissions } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [managementOpen, setManagementOpen] = useState(false);

  useEffect(() => {
    refreshUserPermissions();
  }, [location.pathname, refreshUserPermissions]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebarOpen);
    setSidebarOpen(prev => !prev);
  };

  const menuIcons: Record<string, React.ReactNode> = {
    'new-request': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    'my-requests': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'dashboard': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    ),
    'admin/request-management': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    'organization': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    'admin/organization': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
      </svg>
    ),
    'admin/users': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    'admin/roles': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    'management': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  };

  const filteredMenuItems = PAGE_DEFINITIONS.filter(page => 
    user?.allowedPages?.includes(page.key)
  );

  const managementItems = filteredMenuItems.filter(item => item.group === 'management');
  const regularItems = filteredMenuItems.filter(item => !item.group);

  return (
    <div className="min-h-screen w-full bg-[#F49B00] flex overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Blue Theme */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 bg-[#00488E] shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? 'w-64' : 'w-16'
        } lg:fixed lg:${sidebarOpen ? 'w-64' : 'w-16'}`}
      >
        {/* Logo Section */}
        <div className={`flex items-center h-16 px-4 flex-shrink-0 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <div className={`flex items-center space-x-2 transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#00488E] text-lg font-bold">İ</span>
            </div>
            <h1 className="text-white text-base font-semibold whitespace-nowrap">İTY App</h1>
          </div>
          
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-gray-300 hover:bg-[#003366] hover:text-white transition-colors h-6 w-6 flex items-center justify-center flex-shrink-0"
          >
            {sidebarOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        <div className={`h-px bg-[#003366] transition-all duration-300 ${sidebarOpen ? 'mx-4' : 'mx-2'}`}></div>

        {/* Navigation */}
        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {/* Regular menu items */}
            {regularItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  navigate(item.path);
                }}
                className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-[#F49B00] text-white shadow-lg rounded-l-xl rounded-r-none -mr-4 w-[calc(100%+2rem)]'
                    : 'text-gray-300 hover:bg-[#003366] hover:text-white rounded-xl'
                }`}
                title={sidebarOpen ? '' : item.label}
              >
                <div className={`flex items-center ${sidebarOpen ? 'w-full' : 'justify-center'}`}>
                  <span className={`${sidebarOpen ? 'mr-3' : ''} flex-shrink-0`}>{menuIcons[item.key]}</span>
                  <span className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>{item.label}</span>
                </div>
              </button>
            ))}

            {/* Visual separator above management */}
            {managementItems.length > 0 && (
              <div className={`h-px bg-[#003366] my-6 transition-all duration-300 ${sidebarOpen ? 'mx-4' : 'mx-2'}`}></div>
            )}

            {/* Management section */}
            {managementItems.length > 0 && (
              <div>
                <button
                  onClick={() => setManagementOpen(!managementOpen)}
                  className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    managementOpen ? 'bg-[#003366] text-white' : 'text-gray-300 hover:bg-[#003366] hover:text-white'
                  }`}
                  title={sidebarOpen ? '' : 'Yönetim'}
                >
                  <div className={`flex items-center ${sidebarOpen ? 'w-full justify-between' : 'justify-center'}`}>
                    <div className="flex items-center">
                      <span className={`${sidebarOpen ? 'mr-3' : ''} flex-shrink-0`}>{menuIcons['management']}</span>
                      <span className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>Yönetim</span>
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform flex-shrink-0 ${managementOpen ? 'rotate-180' : ''} ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {managementOpen && (
                  <div className={`mt-3 space-y-2 ${sidebarOpen ? 'ml-6' : 'ml-0'}`}>
                    {managementItems.map((item) => (
                                              <button
                          key={item.key}
                          onClick={() => {
                            navigate(item.path);
                          }}
                          className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            location.pathname === item.path
                              ? 'bg-[#F49B00] text-white rounded-l-lg rounded-r-none -mr-4 w-[calc(100%+2rem)]'
                              : 'text-gray-400 hover:bg-[#003366] hover:text-white rounded-lg'
                          }`}
                          title={sidebarOpen ? '' : item.label}
                        >
                          <div className={`flex items-center ${sidebarOpen ? 'w-full' : 'justify-center'}`}>
                            <span className={`${sidebarOpen ? 'mr-3' : ''} flex-shrink-0`}>{menuIcons[item.key]}</span>
                            <span className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>{item.label}</span>
                          </div>
                        </button>
                    ))}
                  </div>
                )}
                

              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#003366] flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-[#003366] hover:text-white rounded-xl transition-all duration-200"
            title="Çıkış Yap"
          >
            <div className={`flex items-center ${sidebarOpen ? 'w-full' : 'justify-center'}`}>
              <svg className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? 'mr-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>Çıkış Yap</span>
            </div>
          </button>
          

        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 w-full overflow-x-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Top bar - Light Gray Theme */}
        <div className="bg-white shadow-sm border-b border-gray-200 w-full">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 w-full">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <h2 className="text-lg font-semibold text-gray-800 truncate">Dashboard</h2>
            </div>

            {/* Search Bar - Hidden on very small screens */}
            <div className="hidden sm:flex flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search something here..."
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F4F4] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00488E] focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Right side - User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              {/* User Profile */}
              <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-gray-300 min-w-0">
                <div className="w-8 h-8 bg-[#00488E] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right min-w-0 hidden sm:block">
                  <p className="text-sm font-medium text-gray-800 truncate">{user?.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                </div>
                {/* Show only username on very small screens */}
                <div className="text-right min-w-0 sm:hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">{user?.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

                      {/* Page content */}
              <main className="p-4 sm:p-6 bg-[#F49B00] w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Floating action button for new request */}
      {user && location.pathname !== '/new-request' && (
        <button
          onClick={() => navigate('/new-request')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#00488E] text-white rounded-full shadow-lg hover:bg-[#003366] transition-all duration-300 flex items-center justify-center z-30"
          title="Yeni Talep Oluştur"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}; 