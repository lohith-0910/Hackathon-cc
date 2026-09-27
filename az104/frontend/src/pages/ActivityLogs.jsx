import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import { FileText, Search, Info, X, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ActivityLogs = () => {
  const { auditLogs } = useVault();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeLogModal, setActiveLogModal] = useState(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
                          log.resource.toLowerCase().includes(search.toLowerCase()) ||
                          log.user.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#16A34A] uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Audit & Telemetry</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
          Security Audit Log Stream
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Immutable audit logging for secret views, credential rotations, and access violations.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search audit events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
          >
            <option value="ALL">Status: All</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>

          <span className="text-xs text-[#64748B] font-mono hidden sm:inline">
            Total Log Entries: {filteredLogs.length}
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3.5">Action Event</th>
                <th className="px-4 py-3.5">Target Resource</th>
                <th className="px-4 py-3.5">Triggered By User</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#1E293B]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 font-bold font-mono text-[#0F172A]">
                    {log.action}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[#0078D4]">
                    {log.resource}
                  </td>
                  <td className="px-4 py-3.5 text-[#64748B]">
                    {log.user}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-green-50 text-[#16A34A] border border-green-200' :
                      log.status === 'WARNING' ? 'bg-amber-50 text-[#F59E0B] border border-amber-200' :
                      'bg-blue-50 text-[#0078D4] border border-blue-200'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[#64748B]">
                    {log.time || log.timestamp?.split('T')[0]}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setActiveLogModal(log)}
                      className="p-1 rounded text-[#0078D4] hover:bg-blue-50 transition-colors"
                      title="View Event Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {activeLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A] text-base">Audit Log Payload</h3>
              <button
                onClick={() => setActiveLogModal(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono space-y-2 text-[#0F172A]">
                <div><span className="text-[#64748B]">Action:</span> <strong>{activeLogModal.action}</strong></div>
                <div><span className="text-[#64748B]">Resource:</span> <strong>{activeLogModal.resource}</strong></div>
                <div><span className="text-[#64748B]">User:</span> {activeLogModal.user}</div>
                <div><span className="text-[#64748B]">Timestamp:</span> {activeLogModal.timestamp || new Date().toISOString()}</div>
                <div><span className="text-[#64748B]">Details:</span> {activeLogModal.details || 'Event logged successfully.'}</div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setActiveLogModal(null)}
                className="px-4 py-2 bg-[#0078D4] hover:bg-[#0062AD] text-white text-xs font-medium rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
