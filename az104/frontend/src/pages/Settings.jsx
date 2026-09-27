import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import { Settings as SettingsIcon, ShieldCheck, Save, CheckCircle2, Lock, Server } from 'lucide-react';

export const Settings = () => {
  const { settings, updateSettings } = useVault();
  const [formSettings, setFormSettings] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#0078D4] uppercase tracking-wider mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Vault System Configuration</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
          Settings
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Configure Key Vault SKU, soft-delete retention, purge protection, and authorization model.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-xs text-[#16A34A] font-bold flex items-center space-x-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          <span>Vault configuration settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Section 1: Vault Information */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
              <Server className="w-4 h-4 text-[#0078D4]" />
              <span>Vault Information</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Core resource properties and deployment location</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Vault Name</label>
              <input
                type="text"
                value={formSettings.vaultName || 'kv-prod-eastus-01'}
                onChange={(e) => setFormSettings({ ...formSettings, vaultName: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
              />
              <p className="text-[11px] text-[#64748B] mt-1">Unique DNS vault identifier in Azure region</p>
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Location</label>
              <input
                type="text"
                disabled
                value={formSettings.location || 'East US (eastus)'}
                className="w-full p-2.5 rounded-lg bg-slate-100 border border-[#E2E8F0] text-[#64748B] cursor-not-allowed font-mono"
              />
              <p className="text-[11px] text-[#64748B] mt-1">Azure region hosting Key Vault HSM hardware</p>
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">SKU Tier</label>
              <select
                value={formSettings.sku || 'PREMIUM (HSM)'}
                onChange={(e) => setFormSettings({ ...formSettings, sku: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-[#0078D4]"
              >
                <option value="STANDARD">STANDARD (Software-protected keys)</option>
                <option value="PREMIUM (HSM)">PREMIUM (HSM FIPS 140-2 Level 3)</option>
              </select>
              <p className="text-[11px] text-[#64748B] mt-1">Premium tier includes Hardware Security Module protection</p>
            </div>
          </div>
        </div>

        {/* Section 2: Data Protection */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Data Protection</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Recycle bin retention and permanent purge protection controls</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Soft Delete Switch */}
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <div>
                <div className="font-bold text-[#0F172A]">Soft Delete Protection</div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  Allows recovery of deleted secrets and certificates during the retention period. Mandatory in Azure Key Vault.
                </div>
              </div>
              <span className="px-3 py-1 bg-green-50 text-[#16A34A] border border-green-200 font-bold rounded-full text-[11px]">
                ON (Always Active)
              </span>
            </div>

            {/* Retention Period Dropdown */}
            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Soft-Delete Retention Period</label>
              <select
                value={formSettings.retentionDays || 90}
                onChange={(e) => setFormSettings({ ...formSettings, retentionDays: Number(e.target.value) })}
                className="w-full sm:w-64 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-[#0078D4]"
              >
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
                <option value={90}>90 Days (Recommended)</option>
              </select>
              <p className="text-[11px] text-[#64748B] mt-1">
                Number of days soft-deleted resources are recoverable before automatic purge.
              </p>
            </div>

            {/* Purge Protection Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <div>
                <div className="font-bold text-[#0F172A]">Purge Protection</div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  Enforces mandatory retention duration and blocks permanent deletion by any user until retention expires.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formSettings.purgeProtection}
                  onChange={(e) => setFormSettings({ ...formSettings, purgeProtection: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0078D4]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Authorization Model */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
              <Lock className="w-4 h-4 text-[#0078D4]" />
              <span>Authorization</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Select Key Vault access permission model</p>
          </div>

          <div className="space-y-3 text-xs">
            <label className={`flex items-start p-3.5 rounded-lg border cursor-pointer transition-all ${
              formSettings.authModel === 'ACCESS_POLICIES' ? 'bg-blue-50 border-[#0078D4]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
            }`}>
              <input
                type="radio"
                name="authModel"
                value="ACCESS_POLICIES"
                checked={formSettings.authModel === 'ACCESS_POLICIES'}
                onChange={(e) => setFormSettings({ ...formSettings, authModel: e.target.value })}
                className="mt-0.5 text-[#0078D4] focus:ring-[#0078D4]"
              />
              <div className="ml-3">
                <span className="font-bold text-[#0F172A]">Access Policies</span>
                <p className="text-[#64748B] text-[11px] mt-0.5">
                  Granular Key Vault level permissions per principal. Simple setup for legacy isolated Key Vaults.
                </p>
              </div>
            </label>

            <label className={`flex items-start p-3.5 rounded-lg border cursor-pointer transition-all ${
              formSettings.authModel === 'AZURE_RBAC' ? 'bg-blue-50 border-[#0078D4]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
            }`}>
              <input
                type="radio"
                name="authModel"
                value="AZURE_RBAC"
                checked={formSettings.authModel === 'AZURE_RBAC'}
                onChange={(e) => setFormSettings({ ...formSettings, authModel: e.target.value })}
                className="mt-0.5 text-[#0078D4] focus:ring-[#0078D4]"
              />
              <div className="ml-3">
                <span className="font-bold text-[#0F172A]">Azure RBAC (Recommended)</span>
                <p className="text-[#64748B] text-[11px] mt-0.5">
                  Integrated with Azure IAM. Allows role assignments across management groups, subscriptions, and resource groups.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Section 4: Backend Mode */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="text-base font-bold text-[#0F172A]">Environment & Backend Mode</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Toggle between offline state engine and active Spring Boot API Gateway</p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="environment"
                value="MOCK"
                checked={formSettings.environment === 'MOCK'}
                onChange={(e) => setFormSettings({ ...formSettings, environment: e.target.value })}
                className="text-[#0078D4]"
              />
              <span className="text-[#0F172A]">Mock Environment (Offline Ready)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="environment"
                value="AZURE"
                checked={formSettings.environment === 'AZURE'}
                onChange={(e) => setFormSettings({ ...formSettings, environment: e.target.value })}
                className="text-[#0078D4]"
              />
              <span className="text-[#0F172A]">Live Azure SDK Mode</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0078D4] hover:bg-[#0062AD] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
