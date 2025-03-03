import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { dashboardConfig } from './dashboardConfig';

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleSubmenu = (index) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800/20 to-slate-900"
        />
        <div className="absolute w-[800px] h-[800px] -top-40 -right-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-[800px] h-[800px] -bottom-40 -left-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="flex min-h-screen relative">
        {/* Sidebar */}
        <aside
          className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 w-64 bg-slate-800/90 border-r border-slate-700 flex flex-col h-screen fixed z-50 md:static md:translate-x-0 backdrop-blur-xl`}
        >
          <div className="p-4 flex items-center justify-between border-b border-slate-700">
            <span className="text-4xl font-bold bg-gradient-to-r from-slate-200 to-cyan-300 bg-clip-text text-transparent">
            WorkNest
            </span>
            <button onClick={toggleMobileMenu} className="md:hidden text-slate-400 hover:text-cyan-300">
              ✖️
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-4">
              <div className="space-y-1">
                {dashboardConfig.generalItems.map((item, index) => (
                  <div key={index}>
                    <div
                      className="flex items-center text-sm py-3 px-4 cursor-pointer rounded-lg transition-colors duration-300 text-slate-300 hover:bg-slate-700 hover:text-cyan-300"
                      onClick={() => navigate(`${item.path}`)}
                    >
                      <item.icon className="w-5 h-5 mr-3 text-indigo-400" />
                      <span>{item.label}</span>
                      {item.sublabels?.length > 0 && (
                        <button
                          className="ml-auto text-slate-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubmenu(index);
                          }}
                        >
                          {openSubmenus[index] ? '▲' : '▼'}
                        </button>
                      )}
                    </div>

                    {openSubmenus[index] && item.sublabels?.length > 0 && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.sublabels.map((sublabel, subIndex) => (
                          <div
                            key={subIndex}
                            className="flex items-center text-sm py-2 px-4 cursor-pointer rounded-lg transition-colors duration-300 text-slate-400 hover:bg-slate-700 hover:text-cyan-300"
                            onClick={() => navigate(`/dashboard${sublabel.path}`)}
                          >
                            <sublabel.icon className="w-4 h-4 mr-2 text-indigo-400" />
                            <span>{sublabel.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto h-screen scrollbar-hide relative">
          <div className="flex items-center justify-between bg-slate-800 border-b border-slate-700 p-4 fixed top-0 left-0 right-0 z-40 md:hidden">
            <span className="text-xl font-bold bg-gradient-to-r from-slate-200 to-cyan-300 bg-clip-text text-transparent">
              Tradescribe
            </span>
            <button onClick={toggleMobileMenu}>
              <span className="text-indigo-400">☰</span>
            </button>
          </div>

          <div className="pt-16 md:pt-0">
            <Outlet />
          </div>
        </main>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;