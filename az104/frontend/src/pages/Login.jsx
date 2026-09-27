import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(usernameOrEmail, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Authentication failed. Please check credentials.');
    }
  };

  const setDemoCredentials = (email, pwd) => {
    setUsernameOrEmail(email);
    setPassword(pwd);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#0078D4] text-white shadow-sm mb-3">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Azure Key Vault Manager
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Enterprise Security & Credentials Control Center
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[#DC2626] text-xs font-medium flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#0078D4] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#0078D4] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#0078D4] hover:bg-[#0062AD] text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center space-x-2 group"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Security Dashboard'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Quick Fill Seed Buttons */}
          <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] font-semibold mb-3 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] mr-1.5" />
              Quick Fill Hackathon Seed Credentials:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setDemoCredentials('admin@example.com', 'admin123')}
                type="button"
                className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0078D4] text-[#1E293B] text-left transition-colors font-mono"
              >
                <div className="font-bold text-[#0078D4]">ADMIN</div>
                <div className="text-[10px] text-[#64748B] truncate">admin@example.com</div>
              </button>

              <button
                onClick={() => setDemoCredentials('security@example.com', 'security123')}
                type="button"
                className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0078D4] text-[#1E293B] text-left transition-colors font-mono"
              >
                <div className="font-bold text-[#0078D4]">SECURITY_ADMIN</div>
                <div className="text-[10px] text-[#64748B] truncate">security@example.com</div>
              </button>

              <button
                onClick={() => setDemoCredentials('developer@example.com', 'dev123')}
                type="button"
                className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0078D4] text-[#1E293B] text-left transition-colors font-mono"
              >
                <div className="font-bold text-[#0078D4]">DEVELOPER</div>
                <div className="text-[10px] text-[#64748B] truncate">developer@example.com</div>
              </button>

              <button
                onClick={() => setDemoCredentials('viewer@example.com', 'viewer123')}
                type="button"
                className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0078D4] text-[#1E293B] text-left transition-colors font-mono"
              >
                <div className="font-bold text-[#0078D4]">VIEWER</div>
                <div className="text-[10px] text-[#64748B] truncate">viewer@example.com</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
