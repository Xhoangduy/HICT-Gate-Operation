import React from 'react';
import { LayoutDashboard, FileBarChart, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
        active
          ? 'bg-white text-[#2c92d5] font-bold shadow-sm'
          : 'text-blue-100 hover:bg-white/10 hover:text-white font-medium'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens/session logic here
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      {/* Horizontal Header Navbar */}
      <header className="h-16 bg-[#2c92d5] shadow-md z-50 flex items-center justify-between px-6 shrink-0 relative">
        <div className="flex items-center gap-8">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-extrabold text-[#2c92d5] shadow-sm text-xl">G</div>
                <h1 className="text-white font-bold text-sm tracking-tight leading-tight">
                    GATE OPERATION <br/>
                    <span className="text-blue-100 font-medium opacity-90">SYSTEM</span>
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-2">
                <NavItem
                to="/dashboard"
                icon={LayoutDashboard}
                label="Giám sát"
                active={location.pathname === '/dashboard'}
                />
                <NavItem
                to="/reports"
                icon={FileBarChart}
                label="Báo cáo"
                active={location.pathname === '/reports'}
                />
            </nav>
        </div>

        {/* Right Side: User & Actions */}
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-blue-400/30">
                <div className="flex flex-col items-end hidden md:flex text-white">
                    <span className="text-sm font-bold">HTIT_User</span>
                    <span className="text-xs text-blue-100 bg-white/10 px-2 py-0.5 rounded-full">Ca A - Cổng 01</span>
                </div>
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
                <User size={18} />
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Đăng xuất"
            >
                <LogOut size={20} />
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
          <Outlet />
      </main>
    </div>
  );
};