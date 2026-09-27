import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  KeyRound,
  ShieldCheck,
  UserCheck,
  Trash2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Wand2,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { ServiceHealthModal } from './ServiceHealthModal';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const location = useLocation();
  const { settings } = useVault();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'KEY VAULT',
      items: [
        { path: '/secrets', label: 'Secrets', icon: KeyRound },
        { path: '/certificates', label: 'Certificates', icon: ShieldCheck },
        { path: '/migration-wizard', label: 'Migration Wizard', icon: Wand2 },
      ]
    },
    {
      title: 'SECURITY',
      items: [
        { path: '/access-control', label: 'Access Control', icon: UserCheck },
        { path: '/soft-delete', label: 'Soft Delete & Purge', icon: Trash2 },
        { path: '/activity-logs', label: 'Activity Logs', icon: FileText },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white text-[#1E293B] border-r border-[#E2E8F0]">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#0078D4] flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="whitespace-nowrap">
                <h1 className="font-bold text-sm text-[#0F172A] tracking-tight">
                  Azure Key Vault
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-[#0078D4] font-bold">
                  Manager Console
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-200 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-130px)]">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {(!collapsed || mobileOpen) && (
                <div className="px-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center ${
                        collapsed && !mobileOpen ? 'justify-center px-0' : 'px-3'
                      } py-2 rounded-lg font-medium text-xs transition-colors group ${
                        isActive
                          ? 'bg-blue-50 text-[#0078D4] border-l-4 border-[#0078D4] font-semibold'
                          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#0078D4]' : 'text-[#64748B] group-hover:text-[#1E293B]'
                      }`}
                    />
                    {(!collapsed || mobileOpen) && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Connected Status Footer */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <button
          onClick={() => setIsHealthOpen(true)}
          className={`w-full p-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#0078D4] flex items-center text-left transition-all ${
            collapsed && !mobileOpen ? 'justify-center' : 'space-x-2.5'
          }`}
          title="Click to view Service Health Status"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
          {(!collapsed || mobileOpen) && (
            <div className="text-xs truncate">
              <div className="text-[#0F172A] font-semibold flex items-center justify-between">
                <span>● Connected</span>
                <span className="text-[10px] text-[#64748B] ml-1">Inspect</span>
              </div>
              <div className="text-[10px] text-[#64748B] font-mono">
                {settings.environment === 'AZURE' ? 'AZURE SDK' : 'MOCK ENGINE'}
              </div>
            </div>
          )}
        </button>
      </div>

      <ServiceHealthModal isOpen={isHealthOpen} onClose={() => setIsHealthOpen(false)} />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:block h-screen sticky top-0 z-30 shrink-0 shadow-sm"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="relative w-64 max-w-xs h-full bg-white z-10 shadow-xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
