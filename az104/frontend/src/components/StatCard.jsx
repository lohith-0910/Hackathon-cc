import React from 'react';

export const StatCard = ({ title, value, icon: Icon, subtext, trend, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-[#0078D4]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#0078D4]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-[#0F172A] font-sans tracking-tight">
          {value}
        </div>
        {trend && (
          <span className="text-xs font-semibold text-[#16A34A] bg-green-50 px-2 py-0.5 rounded border border-green-200">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-[#64748B] mt-2 border-t border-[#E2E8F0] pt-2">
          {subtext}
        </p>
      )}
    </div>
  );
};
