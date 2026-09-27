import React, { useState } from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight, Play, HelpCircle, Lock, Shield } from 'lucide-react';

export const AccessControl = () => {
  // Interactive Simulator state
  const [selectedPrincipal, setSelectedPrincipal] = useState('DEVELOPER'); // DEVELOPER, SECURITY_ADMIN, SERVICE_PRINCIPAL, VIEWER
  const [selectedResource, setSelectedResource] = useState('DATABASE_PASSWORD');
  const [selectedOperation, setSelectedOperation] = useState('GET_SECRET'); // GET_SECRET, LIST_SECRETS, SET_SECRET, PURGE_SECRET
  const [selectedModel, setSelectedModel] = useState('AZURE_RBAC'); // ACCESS_POLICIES or AZURE_RBAC

  const evaluatePermission = () => {
    // Evaluation rules logic
    if (selectedPrincipal === 'SECURITY_ADMIN') {
      return {
        decision: 'ALLOW',
        role: 'Key Vault Administrator / Secrets Officer',
        reason: 'Full RBAC administrative access granted across all vault operations.'
      };
    }

    if (selectedPrincipal === 'DEVELOPER') {
      if (selectedOperation === 'GET_SECRET' || selectedOperation === 'LIST_SECRETS') {
        return {
          decision: 'ALLOW',
          role: 'Key Vault Secrets User',
          reason: 'Read-only access granted for runtime secret consumption.'
        };
      } else {
        return {
          decision: 'DENY',
          role: 'Key Vault Secrets User',
          reason: 'DEVELOPER role lacks write or purge permissions on secrets.'
        };
      }
    }

    if (selectedPrincipal === 'SERVICE_PRINCIPAL') {
      if (selectedOperation === 'GET_SECRET') {
        return {
          decision: 'ALLOW',
          role: 'App Service Managed Identity',
          reason: 'Explicit Secret Get policy assigned to Managed Identity.'
        };
      } else {
        return {
          decision: 'DENY',
          role: 'App Service Managed Identity',
          reason: 'Service Principal is scoped strictly to Get operations.'
        };
      }
    }

    if (selectedPrincipal === 'VIEWER') {
      if (selectedOperation === 'LIST_SECRETS') {
        return {
          decision: 'ALLOW',
          role: 'Key Vault Reader',
          reason: 'Metadata list permission allowed under Reader role.'
        };
      } else {
        return {
          decision: 'DENY',
          role: 'Key Vault Reader',
          reason: 'Key Vault Reader role cannot inspect raw secret payload values.'
        };
      }
    }

    return { decision: 'DENY', role: 'Guest', reason: 'Unrecognized principal.' };
  };

  const simResult = evaluatePermission();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#0078D4] uppercase tracking-wider mb-1">
          <UserCheck className="w-4 h-4" />
          <span>Security Authorization</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
          Access Control
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Understand how Key Vault authorization works and simulate permission checks.
        </p>
      </div>

      {/* Two Comparison Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1: Access Policies */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Traditional Model</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#64748B] border border-slate-200">
              LEGACY
            </span>
          </div>

          <h3 className="text-base font-bold text-[#0F172A]">ACCESS POLICIES</h3>
          <p className="text-xs text-[#64748B]">
            Traditional Key Vault permissions model based on explicit per-vault policy assignments.
          </p>

          <ul className="space-y-2 text-xs text-[#1E293B]">
            <li className="flex items-start space-x-2">
              <span className="text-[#0078D4] font-bold">•</span>
              <span>Explicit granular permissions per principal (Keys, Secrets, Certs)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#0078D4] font-bold">•</span>
              <span>Per-vault configuration without Azure Resource Group inheritance</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#0078D4] font-bold">•</span>
              <span>Simple for legacy isolated setups</span>
            </li>
          </ul>
        </div>

        {/* Panel 2: Azure RBAC */}
        <div className="bg-white border border-[#0078D4] rounded-xl p-6 shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0078D4] uppercase tracking-wider">Modern Security</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0078D4] border border-blue-200">
              RECOMMENDED
            </span>
          </div>

          <h3 className="text-base font-bold text-[#0F172A]">AZURE RBAC</h3>
          <p className="text-xs text-[#64748B]">
            Azure role-based access control integrated with Microsoft Entra ID (Azure AD).
          </p>

          <ul className="space-y-2 text-xs text-[#1E293B]">
            <li className="flex items-start space-x-2">
              <span className="text-[#16A34A] font-bold">•</span>
              <span>Centralized Azure IAM role management across subscription scopes</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#16A34A] font-bold">•</span>
              <span>Built-in roles (Key Vault Administrator, Secrets Officer, Secrets User)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#16A34A] font-bold">•</span>
              <span>Recommended for modern enterprise cloud deployments</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Access Simulation Interactive Widget */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-blue-50 text-[#0078D4] font-mono text-[10px] font-bold uppercase tracking-wider">
              <span>Simulation Engine</span>
            </div>
            <h2 className="text-base font-bold text-[#0F172A] mt-1">
              Interactive Access Authorization Simulator
            </h2>
            <p className="text-xs text-[#64748B]">
              Test authorization rules dynamically for different user roles and target actions.
            </p>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#64748B] mb-1">Principal / User Role</label>
            <select
              value={selectedPrincipal}
              onChange={(e) => setSelectedPrincipal(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
            >
              <option value="DEVELOPER">Developer (Alex Mercer)</option>
              <option value="SECURITY_ADMIN">Security Admin (Sarah Vance)</option>
              <option value="SERVICE_PRINCIPAL">App Service Managed Identity</option>
              <option value="VIEWER">Auditor / Viewer (David Clark)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#64748B] mb-1">Target Secret</label>
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
            >
              <option value="DATABASE_PASSWORD">DATABASE_PASSWORD</option>
              <option value="PAYMENT_API_KEY">PAYMENT_API_KEY</option>
              <option value="JWT_SECRET">JWT_SECRET</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#64748B] mb-1">Operation Action</label>
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
            >
              <option value="GET_SECRET">Get Secret Value</option>
              <option value="LIST_SECRETS">List Secrets Metadata</option>
              <option value="SET_SECRET">Set / Create Secret</option>
              <option value="PURGE_SECRET">Purge Permanently</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#64748B] mb-1">Authorization Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
            >
              <option value="AZURE_RBAC">Azure RBAC</option>
              <option value="ACCESS_POLICIES">Access Policies</option>
            </select>
          </div>
        </div>

        {/* Visual Decision Flow Chart */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-around gap-4 text-center">
            {/* Step 1: Principal */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-xs min-w-[140px]">
              <span className="text-[10px] text-[#64748B] font-bold uppercase block">Principal</span>
              <span className="text-xs font-bold text-[#0F172A] mt-1 block">{selectedPrincipal}</span>
            </div>

            <ArrowRight className="w-5 h-5 text-[#64748B] shrink-0 hidden md:block" />

            {/* Step 2: Permission Check */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-xs min-w-[160px]">
              <span className="text-[10px] text-[#64748B] font-bold uppercase block">Permission Check</span>
              <span className="text-xs font-mono text-[#0078D4] mt-1 block">{selectedOperation}</span>
            </div>

            <ArrowRight className="w-5 h-5 text-[#64748B] shrink-0 hidden md:block" />

            {/* Step 3: Result */}
            <div className={`p-4 rounded-lg shadow-xs min-w-[180px] border ${
              simResult.decision === 'ALLOW' ? 'bg-green-50 border-green-200 text-[#16A34A]' : 'bg-red-50 border-red-200 text-[#DC2626]'
            }`}>
              <span className="text-[10px] font-bold uppercase block">Effective Decision</span>
              <span className="text-base font-extrabold mt-0.5 flex items-center justify-center space-x-1">
                {simResult.decision === 'ALLOW' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span>{simResult.decision}</span>
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 text-xs space-y-1">
            <div className="font-bold text-[#0F172A]">Matched Role: {simResult.role}</div>
            <div className="text-[#64748B]">{simResult.reason}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
