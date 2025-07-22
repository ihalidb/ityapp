import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const menuIcons = {
  'Yeni Talep': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
  ),
  'Kendi Taleplerim': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v1.5M3 7.5v9A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5v-9M3 7.5h18" /></svg>
  ),
  'Kullanıcılar': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m0 0A4 4 0 1116 9a4 4 0 01-7 3.13z" /></svg>
  ),
  'Roller': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
  ),
  'Tüm Talepler': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v1.5M3 7.5v9A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5v-9M3 7.5h18" /></svg>
  ),
  'Çıkış': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg>
  ),
};

export const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // masaüstü için, başlangıçta kapalı
  const [plusAnimating, setPlusAnimating] = useState(false);

  const menuItems = [
    {
      label: 'Yeni Talep',
      to: '/requests/new',
      show: isAuthenticated,
    },
    {
      label: 'Kendi Taleplerim',
      to: '/my-requests',
      show: isAuthenticated && user?.role !== 'admin',
    },
    {
      label: 'Kullanıcılar',
      to: '/admin/users',
      show: isAuthenticated && user?.role === 'admin',
    },
    {
      label: 'Roller',
      to: '/admin/roles',
      show: isAuthenticated && user?.role === 'admin',
    },
    {
      label: 'Tüm Talepler',
      to: '/admin/requests',
      show: isAuthenticated && user?.role === 'admin',
    },
  ];

  return (
    <div className="flex min-h-screen h-full w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className={`fixed z-40 inset-y-0 left-0 bg-white shadow-xl border-r border-gray-200 transform transition-all duration-200 ease-in-out
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:flex md:flex-col
        ${sidebarOpen ? 'md:w-60' : 'md:w-20'} md:min-h-screen md:shadow-none`}
        style={{ minHeight: '100vh' }}
      >
        {/* Masaüstü için aç/kapa butonu */}
        <div className="hidden md:flex items-center justify-between px-4 py-4 border-b">
          <span className={`font-bold text-xl text-gray-800 tracking-wide transition-all duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Menü</span>
          <button
            className="p-2 rounded hover:bg-gray-100 transition ml-auto"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Menüyü Daralt/Genişlet"
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobilde başlık ve kapama */}
        <div className="flex items-center justify-between px-6 py-5 border-b md:hidden">
          <span className="font-bold text-xl text-gray-800 tracking-wide">Menü</span>
          <button onClick={() => setDrawerOpen(false)} aria-label="Menüyü Kapat">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex flex-col gap-1 mt-4 px-2">
          {menuItems.filter(item => item.show).map(item => (
            <button
              key={item.label}
              className={`group flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all justify-start hover:bg-blue-100 hover:text-blue-700 text-gray-700 font-medium text-base shadow-sm
                ${(sidebarOpen || drawerOpen) ? '' : 'justify-center px-2'}
              `}
              onClick={() => { navigate(item.to); setDrawerOpen(false); }}
              title={item.label}
            >
              <span className="transition-colors group-hover:text-blue-700">{menuIcons[item.label]}</span>
              <span className={`truncate transition-all duration-200 ${(sidebarOpen || drawerOpen) ? 'opacity-100 ml-2' : 'opacity-0 w-0 overflow-hidden ml-0'}`}>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto mb-6 px-2">
          <button
            className={`group flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all justify-start hover:bg-red-100 hover:text-red-700 text-gray-700 font-medium text-base shadow-sm
              ${sidebarOpen ? '' : 'justify-center px-2'}
            `}
            onClick={() => { logout(); setDrawerOpen(false); }}
            title="Çıkış"
          >
            <span className="transition-colors group-hover:text-red-700">{menuIcons['Çıkış']}</span>
            <span className={`truncate transition-all duration-200 ${sidebarOpen ? 'opacity-100 ml-2' : 'opacity-0 w-0 overflow-hidden ml-0'}`}>Çıkış</span>
          </button>
        </div>
      </aside>
      {/* Overlay for mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden" onClick={() => setDrawerOpen(false)}></div>
      )}
      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all ${sidebarOpen ? 'md:ml-60' : 'md:ml-20'}`}>
        {/* Top Bar */}
        <header className="w-full sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm flex items-center h-16 px-4 md:px-8">
          {/* Hamburger for mobile (header içinde, solda) */}
          <button
            className="p-3 mr-2 focus:outline-none hover:bg-gray-100 flex items-center justify-center md:hidden rounded-full bg-white shadow border border-gray-200"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menüyü Aç"
            style={{ display: drawerOpen ? 'none' : undefined }}
          >
            <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-bold text-2xl tracking-wide text-gray-800 flex-1 text-center md:text-left">Talep Yönetimi</span>
        </header>
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto overflow-x-auto">
          <Outlet />
        </main>
      </div>
      {/* Sabit + butonu: sadece giriş yapılmışsa, her ekranda sol altta */}
      {isAuthenticated && location.pathname !== '/requests/new' && (
        <button
          onClick={() => {
            setPlusAnimating(true);
            setTimeout(() => {
              setPlusAnimating(false);
              navigate('/requests/new');
            }, 350);
          }}
          className={`fixed right-4 bottom-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-4xl transition-all duration-300
            ${plusAnimating ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`}
          style={{ pointerEvents: plusAnimating ? 'none' : undefined }}
          title="Yeni Talep Oluştur"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        </button>
      )}
    </div>
  );
}; 