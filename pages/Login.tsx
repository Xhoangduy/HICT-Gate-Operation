import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, ChevronRight, Container, X, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('htit');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login logic
    navigate('/dashboard');
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             {/* Tech grid overlay */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#2796FF]/20 rounded-full blur-[120px]"></div>
             <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-[100px]"></div>
        </div>

      <div className="w-full max-w-md z-10 px-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#2796FF] rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-[#2796FF]/50 transform rotate-3 border border-white/10">
                <Container className="text-white w-9 h-9" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight text-center uppercase">GATE OPERATION SYSTEM</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide uppercase">Hệ thống quản lý cảng thông minh</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Status Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#2796FF] via-blue-400 to-[#2796FF]"></div>
          
          <div className="p-8 pt-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                Đăng nhập hệ thống
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Tên người dùng</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-400 group-focus-within:text-[#2796FF] transition-colors">
                      <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2796FF]/50 focus:border-[#2796FF] transition-all text-slate-900 font-medium placeholder-slate-400"
                    placeholder="Nhập tên tài khoản"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Mật khẩu</label>
                <div className="relative group">
                   <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-400 group-focus-within:text-[#2796FF] transition-colors">
                      <KeyRound size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2796FF]/50 focus:border-[#2796FF] transition-all text-slate-900 font-medium placeholder-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                 <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3.5 border border-slate-200 bg-white text-slate-600 font-semibold rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#2796FF] hover:bg-[#2080db] text-white font-bold py-3.5 rounded-lg shadow-lg shadow-[#2796FF]/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Đăng nhập
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                   <ShieldCheck size={14} />
                   <span>Kết nối an toàn</span>
               </div>
               <span className="text-xs text-slate-400">v2.5.0</span>
          </div>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 opacity-60">
                &copy; 2025 CEH Software Solutions. All rights reserved.
            </p>
        </div>
      </div>
    </div>
  );
};