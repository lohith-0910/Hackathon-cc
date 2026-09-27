export const getExpiryBadgeStyle = (daysRemaining) => {
  if (daysRemaining <= 0) {
    return {
      label: 'EXPIRED',
      bgClass: 'bg-red-950/60 text-red-400 border-red-800',
      dotClass: 'bg-red-500 animate-pulse'
    };
  }
  if (daysRemaining < 30) {
    return {
      label: `${daysRemaining}d remaining (CRITICAL)`,
      bgClass: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
      dotClass: 'bg-rose-400 animate-ping'
    };
  }
  if (daysRemaining <= 60) {
    return {
      label: `${daysRemaining}d remaining (EXPIRING SOON)`,
      bgClass: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
      dotClass: 'bg-amber-400'
    };
  }
  return {
    label: `${daysRemaining}d remaining (ACTIVE)`,
    bgClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    dotClass: 'bg-emerald-400'
  };
};
