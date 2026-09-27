import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVault } from '../context/VaultContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  LogOut,
  Shield,
  User,
  Search,
  Activity,
  Menu,
  ChevronDown,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ServiceHealthModal } from './ServiceHealthModal';

export const Header = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const { settings, auditLogs } = useVault();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Dashboard', breadcrumb: 'Key Vault Manager / Dashboard' };
      case '/secrets':
        return { title: 'Secrets', breadcrumb: 'Key Vault Manager / Secrets' };
      case '/certificates':
        return { title: 'Certificates', breadcrumb: 'Key Vault Manager / Certificates' };
      case '/migration-wizard':
        return { title: 'Credential Migration', breadcrumb: 'Key Vault Manager / Migration Wizard' };
      case '/access-control':
        return { title: 'Access Control', breadcrumb: 'Key Vault Manager / Security / Access Control' };
      case '/soft-delete':
        return { title: 'Soft Delete & Purge', breadcrumb: 'Key Vault Manager / Security / Soft Delete' };
      case '/activity-logs':
        return { title: 'Activity Logs', breadcrumb: 'Key Vault Manager / Security / Activity Logs' };
      case '/settings':
        return { title: 'Settings', breadcrumb: 'Key Vault Manager / System / Settings' };
      default:
        return { title: 'Key Vault Manager', breadcrumb: 'Key Vault Manager' };
    }
  };

  const { title, breadcrumb } = getPageMeta();

  const notifications = [
    { id: 1, title: 'Certificate Expiry Alert', text: 'student-portal-cert expires in 25 days', time: '10m ago', urgent: true },
    { id: 2, title: 'Secret Rotated', text: 'DATABASE_PASSWORD updated to v3', time: '1h ago', urgent: false },
    { id: 3, title: 'Access Policy Warning', text: 'RBAC conflict check completed', time: '3h ago', urgent: false },
  ];

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Mobile Toggle & Page Title / Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[11px] font-medium text-[#64748B] tracking-wide">
            {breadcrumb}
          </div>
          <h2 className="text-lg font-bold text-[#0F172A] leading-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Environment Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#0078D4] text-xs font-semibold font-mono">
          <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
          <span>Env: {settings.environment || 'MOCK'}</span>
        </div>

        {/* API Health Status Indicator */}
        <button
          onClick={() => setIsHealthOpen(true)}
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-green-50 border border-green-200 text-[#16A34A] text-xs font-semibold hover:bg-green-100 transition-colors"
          title="Click to view backend service status"
        >
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span>Services Healthy</span>
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block w-48 xl:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search resources..."
            onClick={() => navigate('/secrets')}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:border-[#0078D4] transition-colors"
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors border border-[#E2E8F0]"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0078D4] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
              {notifications.length}
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-[#E2E8F0] shadow-xl p-4 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Security Notifications</h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#0078D4] hover:underline font-medium"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2 mt-3 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${n.urgent ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#64748B]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 pl-2 border-l border-[#E2E8F0] focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#0078D4] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-[#0F172A] leading-tight">
                {user?.fullName || 'Azure Admin'}
              </div>
              <div className="text-[10px] text-[#64748B] font-mono">
                {user?.role || 'ADMIN'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#E2E8F0] shadow-xl p-2 z-50 font-sans">
              <div className="px-3 py-2 border-b border-[#E2E8F0] text-xs">
                <div className="font-semibold text-[#0F172A]">{user?.fullName || 'Azure Administrator'}</div>
                <div className="text-[11px] text-[#64748B]">{user?.email || 'admin@example.com'}</div>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#1E293B] hover:bg-slate-100 rounded-lg flex items-center space-x-2"
                >
                  <User className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#DC2626] hover:bg-red-50 rounded-lg flex items-center space-x-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ServiceHealthModal isOpen={isHealthOpen} onClose={() => setIsHealthOpen(false)} />
    </header>
  );
};
