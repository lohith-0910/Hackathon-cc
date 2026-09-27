export const mockDashboardData = {
  stats: {
    totalSecrets: 18,
    activeCertificates: 12,
    expiringSoon: 3,
    deletedItems: 4,
    securityAlerts: 1,
    connectedApps: 6
  },
  expiryChart: [
    { month: 'Jan', active: 12, expiring: 0 },
    { month: 'Feb', active: 14, expiring: 1 },
    { month: 'Mar', active: 15, expiring: 0 },
    { month: 'Apr', active: 16, expiring: 2 },
    { month: 'May', active: 14, expiring: 1 },
    { month: 'Jun', active: 18, expiring: 3 },
  ],
  categoryBreakdown: [
    { name: 'Database', value: 6, color: '#0078D4' },
    { name: 'API Key', value: 5, color: '#00BCF2' },
    { name: 'Storage', value: 4, color: '#10B981' },
    { name: 'Auth', value: 3, color: '#8B5CF6' },
  ],
  recentActivity: [
    {
      id: 101,
      user: 'security@example.com',
      action: 'SECRET_ROTATED',
      resource: 'DATABASE_PASSWORD',
      time: '2 minutes ago',
      status: 'SUCCESS',
      type: 'secret'
    },
    {
      id: 102,
      user: 'admin@example.com',
      action: 'CERTIFICATE_RENEWED',
      resource: 'payment-api-cert',
      time: '10 minutes ago',
      status: 'SUCCESS',
      type: 'certificate'
    },
    {
      id: 103,
      user: 'developer@example.com',
      action: 'ACCESS_DENIED',
      resource: 'vault-prod-eastus',
      time: '20 minutes ago',
      status: 'WARNING',
      type: 'security'
    },
    {
      id: 104,
      user: 'system_auto_renewal',
      action: 'CERTIFICATE_AUTO_RENEW',
      resource: 'student-portal-cert',
      time: '1 hour ago',
      status: 'INFO',
      type: 'system'
    },
    {
      id: 105,
      user: 'security@example.com',
      action: 'SOFT_DELETE_PERFORMED',
      resource: 'LEGACY_PAYMENT_KEY',
      time: '3 hours ago',
      status: 'WARNING',
      type: 'deletion'
    }
  ]
};
