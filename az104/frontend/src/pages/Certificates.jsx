import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import { SoftDeleteModal } from '../components/SoftDeleteModal';
import { getDaysRemaining } from '../utils/formatDate';
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  X,
  Shield,
  Info,
  Layers
} from 'lucide-react';

export const Certificates = () => {
  const { certificates, createCertificate, renewCertificate, softDeleteCertificate } = useVault();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTargetCert, setDeleteTargetCert] = useState(null);
  const [selectedCertForTimeline, setSelectedCertForTimeline] = useState(certificates[0] || null);

  const [newCertForm, setNewCertForm] = useState({
    name: '',
    issuer: 'Azure Public Certificate Authority',
    subject: '',
    application: 'Student Portal',
    autoRenew: true
  });

  const getStatusBadge = (cert) => {
    const days = getDaysRemaining(cert.expiresAt);
    if (days <= 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#DC2626] border border-red-200">
          ✕ EXPIRED
        </span>
      );
    }
    if (days <= 30) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#F59E0B] border border-amber-200">
          ⚠ EXPIRING SOON
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#16A34A] border border-green-200">
        ✓ ACTIVE
      </span>
    );
  };

  const getDaysBadge = (cert) => {
    const days = getDaysRemaining(cert.expiresAt);
    if (days <= 0) return <span className="text-[#DC2626] font-bold">✕ Expired</span>;
    if (days <= 30) return <span className="text-[#F59E0B] font-bold">⚠ {days} days remaining</span>;
    return <span className="text-[#16A34A] font-bold">✓ {days} days remaining</span>;
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newCertForm.name) return;

    createCertificate({
      name: newCertForm.name,
      subject: newCertForm.subject || `CN=${newCertForm.name}.enterprise.com`,
      issuer: newCertForm.issuer,
      application: newCertForm.application,
      autoRenew: newCertForm.autoRenew
    });

    setIsCreateOpen(false);
    setNewCertForm({
      name: '',
      issuer: 'Azure Public Certificate Authority',
      subject: '',
      application: 'Student Portal',
      autoRenew: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
            Certificates
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Manage TLS/SSL certificate lifecycle and auto-renewal policies.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-xs rounded-lg transition-colors shadow-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Certificate</span>
        </button>
      </div>

      {/* Horizontal Certificate Timeline Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#0078D4]" />
              <span>Certificate Lifecycle Timeline</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Inspect issuance, active lifecycle, and auto-renewal triggers
            </p>
          </div>

          <select
            value={selectedCertForTimeline?.id || ''}
            onChange={(e) => {
              const found = certificates.find((c) => c.id === Number(e.target.value));
              if (found) setSelectedCertForTimeline(found);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:outline-none focus:border-[#0078D4]"
          >
            {certificates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({getDaysRemaining(c.expiresAt)} days)
              </option>
            ))}
          </select>
        </div>

        {selectedCertForTimeline && (
          <div className="py-4">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              {/* Timeline Horizontal Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E2E8F0] -translate-y-1/2 z-0" />

              {/* Step 1: Issued */}
              <div className="relative z-10 flex flex-col items-center bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-[#0078D4] flex items-center justify-center text-[#0078D4] text-xs font-bold shadow-xs">
                  ✓
                </div>
                <span className="text-xs font-bold text-[#0F172A] mt-2">Issued</span>
                <span className="text-[10px] text-[#64748B] font-mono">{selectedCertForTimeline.createdAt?.split('T')[0] || '2026-01-01'}</span>
              </div>

              {/* Step 2: Active */}
              <div className="relative z-10 flex flex-col items-center bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-[#16A34A] flex items-center justify-center text-[#16A34A] text-xs font-bold shadow-xs">
                  ●
                </div>
                <span className="text-xs font-bold text-[#0F172A] mt-2">Active</span>
                <span className="text-[10px] text-[#16A34A] font-mono">100% TLS Valid</span>
              </div>

              {/* Step 3: Renewing / Threshold */}
              <div className="relative z-10 flex flex-col items-center bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-[#F59E0B] flex items-center justify-center text-[#F59E0B] text-xs font-bold shadow-xs">
                  ⌛
                </div>
                <span className="text-xs font-bold text-[#0F172A] mt-2">Auto-Renew Trigger</span>
                <span className="text-[10px] text-[#64748B] font-mono">30 Days Before Expiry</span>
              </div>

              {/* Step 4: Renewed */}
              <div className="relative z-10 flex flex-col items-center bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-[#0078D4] flex items-center justify-center text-[#0078D4] text-xs font-bold shadow-xs">
                  ↻
                </div>
                <span className="text-xs font-bold text-[#0F172A] mt-2">Renewed</span>
                <span className="text-[10px] text-[#64748B] font-mono">{selectedCertForTimeline.expiresAt?.split('T')[0]}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certificates Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3.5">Certificate</th>
                <th className="px-4 py-3.5">Issuer</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Days Remaining</th>
                <th className="px-4 py-3.5">Auto Renewal</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#1E293B]">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-[#0F172A] font-mono">{cert.name}</div>
                    <div className="text-[11px] text-[#64748B]">{cert.subject}</div>
                  </td>
                  <td className="px-4 py-3.5 text-[#64748B]">
                    {cert.issuer}
                  </td>
                  <td className="px-4 py-3.5">
                    {getStatusBadge(cert)}
                  </td>
                  <td className="px-4 py-3.5 font-mono">
                    {getDaysBadge(cert)}
                  </td>
                  <td className="px-4 py-3.5 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cert.autoRenew ? 'bg-green-50 text-[#16A34A] border border-green-200' : 'bg-slate-100 text-[#64748B] border border-slate-200'
                    }`}>
                      {cert.autoRenew ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => renewCertificate(cert.id)}
                      className="px-2.5 py-1 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-[#0078D4] font-medium text-[11px] rounded transition-colors inline-flex items-center space-x-1"
                      title="Trigger immediate certificate renewal"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Renew</span>
                    </button>
                    <button
                      onClick={() => setDeleteTargetCert(cert)}
                      className="px-2.5 py-1 bg-white border border-red-200 hover:bg-red-50 text-[#DC2626] font-medium text-[11px] rounded transition-colors inline-flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Certificate Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A] text-base flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0078D4]" />
                <span>Create TLS/SSL Certificate</span>
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#64748B] mb-1">Certificate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. app-gateway-cert"
                  value={newCertForm.name}
                  onChange={(e) => setNewCertForm({ ...newCertForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#64748B] mb-1">Subject Common Name (CN)</label>
                <input
                  type="text"
                  placeholder="CN=api.enterprise.com"
                  value={newCertForm.subject}
                  onChange={(e) => setNewCertForm({ ...newCertForm, subject: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#64748B] mb-1">Certificate Issuer</label>
                <select
                  value={newCertForm.issuer}
                  onChange={(e) => setNewCertForm({ ...newCertForm, issuer: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
                >
                  <option value="Azure Public Certificate Authority">Azure Public Certificate Authority</option>
                  <option value="DigiCert Global TLS RSA SHA256">DigiCert Global TLS RSA SHA256</option>
                  <option value="Let's Encrypt Authority X3">Let's Encrypt Authority X3</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="autoRenew"
                  checked={newCertForm.autoRenew}
                  onChange={(e) => setNewCertForm({ ...newCertForm, autoRenew: e.target.checked })}
                  className="w-4 h-4 text-[#0078D4] rounded border-[#E2E8F0]"
                />
                <label htmlFor="autoRenew" className="font-semibold text-[#0F172A]">
                  Enable Automated Renewal (30 days before expiration)
                </label>
              </div>

              <div className="flex justify-end space-x-3 border-t border-[#E2E8F0] pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] font-medium text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
                >
                  Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Soft Delete Modal */}
      <SoftDeleteModal
        isOpen={!!deleteTargetCert}
        onClose={() => setDeleteTargetCert(null)}
        item={deleteTargetCert}
        itemType="CERTIFICATE"
        onConfirm={(id) => softDeleteCertificate(id)}
      />
    </div>
  );
};
