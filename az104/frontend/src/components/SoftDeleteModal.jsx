import React from 'react';
import { AlertTriangle, Trash2, ShieldCheck, X } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const SoftDeleteModal = ({ isOpen, onClose, item, itemType, onConfirm }) => {
  const { settings } = useVault();

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-red-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-red-100 rounded-lg text-[#DC2626]">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0F172A] text-base">
              Delete {itemType === 'SECRET' ? 'Secret' : 'Certificate'}?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-center">
            <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Resource Name</span>
            <span className="font-bold text-[#0F172A] text-base">{item.name}</span>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            This resource will be moved to the <strong>soft-delete</strong> state. It can be recovered anytime during the retention period before permanent deletion.
          </p>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Retention Period:</span>
              <span className="font-bold text-[#0F172A]">{settings.retentionDays || 90} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Purge Protection:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#16A34A] border border-green-200">
                <ShieldCheck className="w-3 h-3 mr-1" />
                {settings.purgeProtection ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] font-medium text-xs rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(item.id);
              onClose();
            }}
            className="px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Soft Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
