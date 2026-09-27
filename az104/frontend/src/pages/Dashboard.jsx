import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { useVault } from '../context/VaultContext';
import {
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  Lock,
  RefreshCw,
  Wand2,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { secrets, certificates, softDeletedItems, auditLogs } = useVault();

  // Calculate dynamic stats
  const totalSecrets = secrets.length;
  const activeCerts = certificates.filter(c => c.status === 'ACTIVE' || c.status === 'EXPIRING_SOON').length;
  const expiringSoonCount = certificates.filter(c => c.status === 'EXPIRING_SOON' || c.status === 'CRITICAL').length;
  const deletedCount = softDeletedItems.length;

  const statsList = [
    {
      title: 'Total Secrets',
      value: totalSecrets || 24,
      icon: KeyRound,
      trend: '↑ 8% this month',
      subtext: 'Credentials and connection strings stored',
      onClick: () => navigate('/secrets')
    },
    {
      title: 'Active Certificates',
      value: activeCerts || 12,
      icon: ShieldCheck,
      subtext: `${expiringSoonCount} expiring soon - action required`,
      onClick: () => navigate('/certificates')
    },
    {
      title: 'Security Alerts',
      value: expiringSoonCount + 1,
      icon: ShieldAlert,
      subtext: '1 critical RBAC conflict detected',
      onClick: () => navigate('/access-control')
    },
    {
      title: 'Deleted Resources',
      value: deletedCount || 5,
      icon: Trash2,
      subtext: '90 day retention soft-delete buffer',
      onClick: () => navigate('/soft-delete')
    },
  ];

  const expiryChartData = [
    { month: 'Jan', active: 12, expiring: 0 },
    { month: 'Feb', active: 14, expiring: 1 },
    { month: 'Mar', active: 15, expiring: 0 },
    { month: 'Apr', active: 16, expiring: 2 },
    { month: 'May', active: 14, expiring: 1 },
    { month: 'Jun', active: 18, expiring: 3 },
  ];

  const categoryBreakdownData = [
    { name: 'Database', value: secrets.filter(s => s.category === 'DATABASE').length || 6, color: '#0078D4' },
    { name: 'API Key', value: secrets.filter(s => s.category === 'API').length || 5, color: '#004E8C' },
    { name: 'Storage', value: secrets.filter(s => s.category === 'STORAGE').length || 4, color: '#16A34A' },
    { name: 'Authentication', value: secrets.filter(s => s.category === 'AUTHENTICATION').length || 3, color: '#64748B' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Monitor your Key Vault security posture and resource health.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/migration-wizard')}
            className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] font-medium text-xs rounded-lg transition-colors flex items-center space-x-2"
          >
            <Wand2 className="w-4 h-4 text-[#0078D4]" />
            <span>Migration Wizard</span>
          </button>
          <button
            onClick={() => navigate('/secrets')}
            className="px-4 py-2 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-xs rounded-lg transition-colors shadow-sm flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Secret</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((st) => (
          <StatCard
            key={st.title}
            title={st.title}
            value={st.value}
            icon={st.icon}
            trend={st.trend}
            subtext={st.subtext}
            onClick={st.onClick}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificate Expiration Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#0078D4]" />
                <span>Certificate Expiration</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">Forecasted monthly certificate statuses</p>
            </div>
            <span className="text-[11px] text-[#64748B] font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Auto-Renewal Active
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expiryChartData}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A', fontSize: '12px' }}
                />
                <Bar dataKey="active" fill="#0078D4" radius={[4, 4, 0, 0]} name="Active" />
                <Bar dataKey="expiring" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Expiring Soon" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secret Categories Donut Chart */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
              <Lock className="w-4 h-4 text-[#0078D4]" />
              <span>Secret Categories</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Distribution by asset type</p>
          </div>

          <div className="h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-[#0078D4]" />
              <span>Recent Activity</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Audit log stream across Key Vault services</p>
          </div>
          <button
            onClick={() => navigate('/activity-logs')}
            className="text-xs text-[#0078D4] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#1E293B]">
              {auditLogs.slice(0, 5).map((act) => (
                <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">
                    <span className="inline-flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        act.status === 'SUCCESS' ? 'bg-[#16A34A]' :
                        act.status === 'WARNING' ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'
                      }`} />
                      <span>{act.action}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[#0078D4] font-medium">
                    {act.resource}
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">
                    {act.user}
                  </td>
                  <td className="px-4 py-3 text-right text-[#64748B] font-mono">
                    {act.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
