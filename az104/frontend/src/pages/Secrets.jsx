import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { SoftDeleteModal } from '../components/SoftDeleteModal';
import {
  KeyRound,
  Wand2,
  Plus,
  Search,
  Eye,
  EyeOff,
  MoreVertical,
  RotateCw,
  Trash2,
  Edit,
  Info,
  X,
  Copy,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';

export const Secrets = () => {
  const navigate = useNavigate();
  const { secrets, createSecret, rotateSecret, softDeleteSecret } = useVault();

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Secret Mask Toggles per row ID
  const [revealedSecrets, setRevealedSecrets] = useState({});

  // Modals & Drawers state
  const [activeDetailsSecret, setActiveDetailsSecret] = useState(null);
  const [detailRevealed, setDetailRevealed] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTargetSecret, setDeleteTargetSecret] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  // New Secret Form state
  const [newSecretForm, setNewSecretForm] = useState({
    name: '',
    value: '',
    category: 'DATABASE',
    application: 'Student Portal',
    expiresAt: '2026-12-31'
  });

  const toggleRevealRow = (id) => {
    setRevealedSecrets((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newSecretForm.name || !newSecretForm.value) return;

    createSecret({
      name: newSecretForm.name,
      value: newSecretForm.value,
      category: newSecretForm.category,
      application: newSecretForm.application,
      expiresAt: newSecretForm.expiresAt ? `${newSecretForm.expiresAt}T23:59:59Z` : '2026-12-31T23:59:59Z'
    });

    setIsCreateOpen(false);
    setNewSecretForm({
      name: '',
      value: '',
      category: 'DATABASE',
      application: 'Student Portal',
      expiresAt: '2026-12-31'
    });
  };

  const filteredSecrets = secrets.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.application.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
            Secrets
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Manage application credentials securely.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/migration-wizard')}
            className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] font-medium text-xs rounded-lg transition-colors flex items-center space-x-2"
          >
            <Wand2 className="w-4 h-4 text-[#0078D4]" />
            <span>Migrate Credential</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-xs rounded-lg transition-colors shadow-sm flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Secret</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search secrets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
          >
            <option value="ALL">Category: All</option>
            <option value="DATABASE">Database</option>
            <option value="API">API</option>
            <option value="STORAGE">Storage</option>
            <option value="AUTHENTICATION">Authentication</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>

          <span className="text-xs text-[#64748B] font-mono hidden sm:inline">
            Total: {filteredSecrets.length}
          </span>
        </div>
      </div>

      {/* Secrets Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3.5">Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Secret Value</th>
                <th className="px-4 py-3.5">Expires</th>
                <th className="px-4 py-3.5">Version</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#1E293B]">
              {filteredSecrets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#64748B]">
                    No secrets match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSecrets.map((secret) => (
                  <tr key={secret.id} className="hover:bg-slate-50 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3.5 font-bold font-mono text-[#0078D4]">
                      <button
                        onClick={() => {
                          setActiveDetailsSecret(secret);
                          setDetailRevealed(false);
                        }}
                        className="hover:underline text-left"
                      >
                        {secret.name}
                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[#64748B] font-medium text-[11px]">
                        {secret.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#16A34A] border border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {secret.status}
                      </span>
                    </td>

                    {/* Masked Secret Value */}
                    <td className="px-4 py-3.5 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#64748B]">
                          {revealedSecrets[secret.id] ? secret.value : '••••••••••••••••'}
                        </span>
                        <button
                          onClick={() => toggleRevealRow(secret.id)}
                          className="p-1 text-[#64748B] hover:text-[#0F172A] rounded transition-colors"
                          title={revealedSecrets[secret.id] ? "Hide Secret" : "Reveal Secret"}
                        >
                          {revealedSecrets[secret.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Expires */}
                    <td className="px-4 py-3.5 text-[#64748B] font-mono">
                      {secret.expiresAt ? secret.expiresAt.split('T')[0] : 'Never'}
                    </td>

                    {/* Version */}
                    <td className="px-4 py-3.5 font-mono text-[#64748B]">
                      v{secret.versionCount}
                    </td>

                    {/* Actions Dropdown */}
                    <td className="px-4 py-3.5 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          onClick={() => setDropdownOpenId(dropdownOpenId === secret.id ? null : secret.id)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {dropdownOpenId === secret.id && (
                          <div className="absolute right-0 mt-1 w-40 rounded-lg bg-white border border-[#E2E8F0] shadow-lg p-1 z-30 font-sans text-left">
                            <button
                              onClick={() => {
                                setDropdownOpenId(null);
                                setActiveDetailsSecret(secret);
                                setDetailRevealed(false);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#1E293B] hover:bg-slate-100 rounded flex items-center space-x-2"
                            >
                              <Info className="w-3.5 h-3.5 text-[#0078D4]" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => {
                                setDropdownOpenId(null);
                                rotateSecret(secret.id);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#1E293B] hover:bg-slate-100 rounded flex items-center space-x-2"
                            >
                              <RotateCw className="w-3.5 h-3.5 text-[#16A34A]" />
                              <span>Rotate Secret</span>
                            </button>
                            <button
                              onClick={() => {
                                setDropdownOpenId(null);
                                setDeleteTargetSecret(secret);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#DC2626] hover:bg-red-50 rounded flex items-center space-x-2 font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                              <span>Soft Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secret Details Side Drawer / Modal */}
      {activeDetailsSecret && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full border-l border-[#E2E8F0] shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#0078D4] uppercase tracking-wider">Secret Details</span>
                <h3 className="text-lg font-bold text-[#0F172A] font-mono mt-0.5">{activeDetailsSecret.name}</h3>
              </div>
              <button
                onClick={() => setActiveDetailsSecret(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Status:</span>
                  <span className="font-bold text-[#16A34A] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    {activeDetailsSecret.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#64748B]">Category:</span>
                  <span className="font-semibold text-[#0F172A]">{activeDetailsSecret.category}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#64748B]">Application:</span>
                  <span className="font-semibold text-[#0F172A]">{activeDetailsSecret.application}</span>
                </div>

                <div className="flex justify-between font-mono">
                  <span className="text-[#64748B]">Version:</span>
                  <span className="font-bold text-[#0078D4]">v{activeDetailsSecret.versionCount}</span>
                </div>

                <div className="flex justify-between font-mono">
                  <span className="text-[#64748B]">Created Date:</span>
                  <span className="text-[#0F172A]">{activeDetailsSecret.createdAt?.split('T')[0] || '2026-09-20'}</span>
                </div>

                <div className="flex justify-between font-mono">
                  <span className="text-[#64748B]">Expires Date:</span>
                  <span className="text-[#0F172A]">{activeDetailsSecret.expiresAt?.split('T')[0] || '2026-12-20'}</span>
                </div>
              </div>

              {/* Secret Value Display */}
              <div className="border border-[#E2E8F0] rounded-lg p-4 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0F172A]">Secret Value</span>
                  <button
                    onClick={() => setDetailRevealed(!detailRevealed)}
                    className="px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-slate-100 text-[#0078D4] rounded font-medium text-[11px] flex items-center space-x-1"
                  >
                    {detailRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{detailRevealed ? 'Hide' : 'Show'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-xs break-all">
                  {detailRevealed ? activeDetailsSecret.value : '••••••••••••••••••••••••'}
                </div>
              </div>

              {/* Actions in details */}
              <div className="pt-4 border-t border-[#E2E8F0] flex space-x-3">
                <button
                  onClick={() => {
                    rotateSecret(activeDetailsSecret.id);
                    setActiveDetailsSecret(null);
                  }}
                  className="flex-1 py-2 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate Secret</span>
                </button>
                <button
                  onClick={() => {
                    setDeleteTargetSecret(activeDetailsSecret);
                    setActiveDetailsSecret(null);
                  }}
                  className="px-4 py-2 bg-white border border-red-200 text-[#DC2626] hover:bg-red-50 font-medium text-xs rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Soft Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Secret Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A] text-base flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-[#0078D4]" />
                <span>Create New Vault Secret</span>
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
                <label className="block font-semibold text-[#64748B] mb-1">Secret Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STRIPE_API_KEY"
                  value={newSecretForm.name}
                  onChange={(e) => setNewSecretForm({ ...newSecretForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#64748B] mb-1">Secret Value</label>
                <input
                  type="password"
                  required
                  placeholder="Enter secret payload value..."
                  value={newSecretForm.value}
                  onChange={(e) => setNewSecretForm({ ...newSecretForm, value: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#64748B] mb-1">Category</label>
                  <select
                    value={newSecretForm.category}
                    onChange={(e) => setNewSecretForm({ ...newSecretForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
                  >
                    <option value="DATABASE">DATABASE</option>
                    <option value="API">API</option>
                    <option value="STORAGE">STORAGE</option>
                    <option value="AUTHENTICATION">AUTHENTICATION</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#64748B] mb-1">Application</label>
                  <input
                    type="text"
                    value={newSecretForm.application}
                    onChange={(e) => setNewSecretForm({ ...newSecretForm, application: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#64748B] mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={newSecretForm.expiresAt}
                  onChange={(e) => setNewSecretForm({ ...newSecretForm, expiresAt: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
                />
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
                  Save Secret
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Soft Delete Modal */}
      <SoftDeleteModal
        isOpen={!!deleteTargetSecret}
        onClose={() => setDeleteTargetSecret(null)}
        item={deleteTargetSecret}
        itemType="SECRET"
        onConfirm={(id) => softDeleteSecret(id)}
      />
    </div>
  );
};
