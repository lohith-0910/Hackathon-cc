import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import { Trash2, RotateCcw, ShieldAlert, CheckCircle2, ShieldCheck, AlertOctagon } from 'lucide-react';

export const SoftDelete = () => {
  const { softDeletedItems, recoverItem, purgeItem, settings } = useVault();
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, SECRET, CERTIFICATE
  const [purgeTarget, setPurgeTarget] = useState(null);

  const filteredItems = softDeletedItems.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.type === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#DC2626] uppercase tracking-wider mb-1">
          <Trash2 className="w-4 h-4" />
          <span>Recycle Bin & Data Protection</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
          Soft Delete & Purge
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Recover deleted resources or permanently remove them according to your vault's protection settings.
        </p>
      </div>

      {/* Vault Purge Protection Status Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 text-[#16A34A] border border-green-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-[#0F172A]">
              Soft-Delete Retention Buffer: {settings.retentionDays || 90} Days Active
            </div>
            <div className="text-[#64748B] text-[11px] mt-0.5">
              Purge Protection: <strong className="text-[#16A34A]">{settings.purgeProtection ? 'ENABLED (Prevents Forced Deletion)' : 'DISABLED'}</strong>
            </div>
          </div>
        </div>

        <span className="text-xs font-mono text-[#64748B] bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0] hidden sm:inline-block">
          Deleted Count: {softDeletedItems.length}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#E2E8F0] bg-white p-2 rounded-t-xl">
        {[
          { id: 'ALL', label: 'All Resources' },
          { id: 'SECRET', label: 'Secrets' },
          { id: 'CERTIFICATE', label: 'Certificates' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === t.id
                ? 'bg-blue-50 text-[#0078D4] font-bold border border-blue-200'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Soft Delete Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3.5">Resource</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Deleted On</th>
                <th className="px-4 py-3.5">Retention</th>
                <th className="px-4 py-3.5">Days Remaining</th>
                <th className="px-4 py-3.5">Purge Protection</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#1E293B]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#64748B]">
                    Recycle bin is empty. No soft-deleted items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-bold font-mono text-[#0F172A]">
                      {item.name}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[#64748B] font-mono text-[10px] border border-slate-200">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#64748B]">
                      {item.deletedOn?.split('T')[0] || '2026-09-20'}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#64748B]">
                      {item.retentionDays || 90} Days
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-[#F59E0B]">
                      {item.daysRemaining || 85} Days
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#16A34A] border border-green-200">
                        {item.purgeProtection ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => recoverItem(item.id)}
                        className="px-3 py-1 bg-green-50 border border-green-200 hover:bg-green-100 text-[#16A34A] font-medium text-[11px] rounded transition-colors inline-flex items-center space-x-1"
                        title="Recover resource back to active vault"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Recover</span>
                      </button>

                      <button
                        onClick={() => setPurgeTarget(item)}
                        className="px-3 py-1 bg-white border border-red-200 hover:bg-red-50 text-[#DC2626] font-medium text-[11px] rounded transition-colors inline-flex items-center space-x-1"
                        title="Permanently purge resource"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Purge</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purge Confirmation Modal */}
      {purgeTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center space-x-2 bg-red-50">
              <AlertOctagon className="w-5 h-5 text-[#DC2626]" />
              <h3 className="font-bold text-[#0F172A] text-base">Permanently Purge Resource?</h3>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-center font-bold text-[#0F172A]">
                {purgeTarget.name}
              </div>

              <p className="text-[#64748B] leading-relaxed">
                Purging is <strong>irreversible</strong>. Once purged, this resource cannot be recovered under any retention period.
              </p>

              {settings.purgeProtection && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[#F59E0B] font-semibold">
                  Note: Purge Protection is active on this vault. Admin confirmation required.
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end space-x-3">
              <button
                onClick={() => setPurgeTarget(null)}
                className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  purgeItem(purgeTarget.id);
                  setPurgeTarget(null);
                }}
                className="px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-medium rounded-lg shadow-sm"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
