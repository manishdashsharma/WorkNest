import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Zap, Activity, XCircle, Star, Shield } from 'lucide-react';

const LogoutPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800/20 to-slate-900" />
        
        <div className="absolute w-[800px] h-[800px] -top-40 -right-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute w-[800px] h-[800px] -bottom-40 -left-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        {[...Array(25)].map((_, i) => (
          <div key={i} className="relative">
            <div
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 4 + 'px',
                height: Math.random() * 4 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                opacity: Math.random() * 0.6,
                filter: 'blur(1px)'
              }}
            >
              <div className="absolute w-full h-full bg-white/30 blur-sm"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md p-6 relative">
        <div className="relative bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-slate-700 group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 opacity-0"></div>
          
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-cyan-400 relative overflow-hidden">
            <div className="absolute inset-0 w-1/2 bg-white/30 blur-sm"></div>
          </div>

          <div className="flex flex-col items-center py-12 space-y-8">
            <div className="relative group/logo">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full blur-2xl opacity-50"></div>
              <div className="relative p-6 bg-slate-800/90 rounded-full border border-slate-700/50">
                <LogOut className="w-16 h-16 text-cyan-400" />
              </div>
              
              <div className="absolute -inset-8">
                <div className="w-full h-full">
                  <Shield className="absolute top-0 left-1/2 -translate-x-1/2 text-cyan-400/70" size={20} />
                  <Star className="absolute bottom-0 left-1/2 -translate-x-1/2 text-cyan-400/70" size={20} />
                  <Activity className="absolute left-0 top-1/2 -translate-y-1/2 text-cyan-400/70" size={20} />
                  <Zap className="absolute right-0 top-1/2 -translate-y-1/2 text-cyan-400/70" size={20} />
                </div>
              </div>
            </div>

            <div className="text-center space-y-3 relative">
              <h2 className="text-4xl font-bold text-white tracking-tight">
                See You Soon!
              </h2>
              <p className="text-slate-400">
                Are you sure you want to logout?
              </p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-4 px-6 rounded-xl font-semibold text-slate-300
                  bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700
                  flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0"></div>
                <ArrowLeft size={18} />
                <span>Cancel</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 py-4 px-6 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-cyan-600 to-cyan-500
                  flex items-center justify-center gap-2
                  relative overflow-hidden shadow-lg"
              >
                <div className="absolute inset-0 bg-white/20"></div>
                <span className="relative flex items-center gap-2">
                  Yes, Logout
                  <XCircle size={18} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;