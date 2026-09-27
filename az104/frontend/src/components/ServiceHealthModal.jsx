import React from 'react';
import { X, CheckCircle2, Server, Activity, ShieldCheck, RefreshCw } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const ServiceHealthModal = ({ isOpen, onClose }) => {
  const { servicesStatus } = useVault();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#0078D4]" />
            <h3 className="font-bold text-[#0F172A] text-base">Key Vault Service Health</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#64748B]">
            Real-time health status of microservices registered with Eureka Discovery Server & API Gateway.
          </p>

          <div className="space-y-2">
            {Object.values(servicesStatus).map((svc) => (
              <div
                key={svc.name}
                className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between font-mono text-xs"
              >
                <div className="flex items-center space-x-3">
                  <Server className="w-4 h-4 text-[#0078D4]" />
                  <div>
                    <span className="font-bold text-[#1E293B]">{svc.name}</span>
                    <span className="text-[#64748B] text-[11px] ml-2">(: {svc.port})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[11px] text-[#64748B]">{svc.latency}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#16A34A] border border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-[#16A34A]" />
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-[#004E8C] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#0078D4]" />
              <span>Gateway Router Endpoint: <strong>http://localhost:8080</strong></span>
            </div>
            <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-blue-300">
              EUREKA OK
            </span>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-xs rounded-lg transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
