import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSecrets } from '../data/mockSecrets';
import { initialCertificates } from '../data/mockCertificates';
import { mockDashboardData } from '../data/mockDashboard';
import api from '../services/api';

const VaultContext = createContext(null);

export const VaultProvider = ({ children }) => {
  const [secrets, setSecrets] = useState(() => {
    const saved = localStorage.getItem('kv_secrets');
    return saved ? JSON.parse(saved) : initialSecrets;
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('kv_certificates');
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  const [softDeletedItems, setSoftDeletedItems] = useState(() => {
    const saved = localStorage.getItem('kv_soft_deleted');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 101,
        type: 'SECRET',
        name: 'LEGACY_PAYMENT_KEY',
        category: 'API',
        deletedOn: '2026-09-20T10:00:00Z',
        retentionDays: 90,
        daysRemaining: 85,
        purgeProtection: true,
        deletedBy: 'security@example.com'
      },
      {
        id: 102,
        type: 'CERTIFICATE',
        name: 'staging-auth-cert',
        category: 'CERTIFICATE',
        deletedOn: '2026-09-18T14:30:00Z',
        retentionDays: 90,
        daysRemaining: 83,
        purgeProtection: true,
        deletedBy: 'admin@example.com'
      }
    ];
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('kv_audit_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        action: 'SECRET_CREATED',
        resource: 'DATABASE_PASSWORD',
        user: 'admin@example.com',
        time: 'Just now',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        type: 'secret',
        details: 'Secret version v1 created in category DATABASE'
      },
      ...mockDashboardData.recentActivity
    ];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('kv_settings');
    if (saved) return JSON.parse(saved);
    return {
      vaultName: 'kv-prod-eastus-01',
      location: 'East US (eastus)',
      sku: 'PREMIUM (HSM)',
      softDeleteEnabled: true,
      retentionDays: 90,
      purgeProtection: true,
      authModel: 'AZURE_RBAC', // 'AZURE_RBAC' or 'ACCESS_POLICIES'
      environment: 'MOCK', // 'MOCK' or 'AZURE'
    };
  });

  const [servicesStatus, setServicesStatus] = useState({
    apiGateway: { name: 'API Gateway', port: 8080, status: 'ONLINE', latency: '12ms' },
    authService: { name: 'Auth Service', port: 8081, status: 'ONLINE', latency: '18ms' },
    secretService: { name: 'Secret Service', port: 8082, status: 'ONLINE', latency: '15ms' },
    certificateService: { name: 'Certificate Service', port: 8083, status: 'ONLINE', latency: '22ms' },
    vaultService: { name: 'Vault Service', port: 8084, status: 'ONLINE', latency: '14ms' },
    auditService: { name: 'Audit Service', port: 8085, status: 'ONLINE', latency: '19ms' },
    eureka: { name: 'Eureka Server', port: 8761, status: 'ONLINE', latency: '8ms' },
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('kv_secrets', JSON.stringify(secrets));
  }, [secrets]);

  useEffect(() => {
    localStorage.setItem('kv_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('kv_soft_deleted', JSON.stringify(softDeletedItems));
  }, [softDeletedItems]);

  useEffect(() => {
    localStorage.setItem('kv_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('kv_settings', JSON.stringify(settings));
  }, [settings]);

  // Add audit log helper
  const addAuditLog = (action, resource, user, type, status = 'SUCCESS', details = '') => {
    const newLog = {
      id: Date.now(),
      action,
      resource,
      user: user || 'admin@example.com',
      time: 'Just now',
      timestamp: new Date().toISOString(),
      status,
      type,
      details: details || `Performed ${action} on ${resource}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Secret Operations
  const createSecret = (newSecretData) => {
    const newSecret = {
      id: Date.now(),
      name: newSecretData.name.toUpperCase().replace(/\s+/g, '_'),
      value: newSecretData.value,
      category: newSecretData.category || 'DATABASE',
      application: newSecretData.application || 'General App',
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: newSecretData.expiresAt || '2026-12-31T23:59:59Z',
      status: 'ACTIVE',
      tags: newSecretData.tags || { env: 'prod' },
      versionCount: 1,
      versions: [
        {
          version: 'v1',
          created: new Date().toISOString(),
          status: 'CURRENT',
          createdBy: 'admin@example.com'
        }
      ]
    };

    setSecrets((prev) => [newSecret, ...prev]);
    addAuditLog('SECRET_CREATED', newSecret.name, 'admin@example.com', 'secret', 'SUCCESS', `Secret ${newSecret.name} created.`);
    return newSecret;
  };

  const updateSecret = (id, updatedFields) => {
    setSecrets((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = {
            ...s,
            ...updatedFields,
            updatedAt: new Date().toISOString()
          };
          addAuditLog('SECRET_UPDATED', s.name, 'admin@example.com', 'secret', 'SUCCESS', `Secret ${s.name} updated.`);
          return updated;
        }
        return s;
      })
    );
  };

  const rotateSecret = (id) => {
    setSecrets((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newVersionNum = s.versionCount + 1;
          const updated = {
            ...s,
            versionCount: newVersionNum,
            updatedAt: new Date().toISOString(),
            value: `Rotated_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`
          };
          addAuditLog('SECRET_ROTATED', s.name, 'admin@example.com', 'secret', 'SUCCESS', `Secret ${s.name} rotated to version v${newVersionNum}.`);
          return updated;
        }
        return s;
      })
    );
  };

  const softDeleteSecret = (id) => {
    const target = secrets.find((s) => s.id === id);
    if (!target) return;

    setSecrets((prev) => prev.filter((s) => s.id !== id));

    const deletedItem = {
      id: Date.now(),
      type: 'SECRET',
      name: target.name,
      category: target.category,
      deletedOn: new Date().toISOString(),
      retentionDays: settings.retentionDays || 90,
      daysRemaining: settings.retentionDays || 90,
      purgeProtection: settings.purgeProtection,
      deletedBy: 'admin@example.com',
      originalData: target
    };

    setSoftDeletedItems((prev) => [deletedItem, ...prev]);
    addAuditLog('SECRET_SOFT_DELETED', target.name, 'admin@example.com', 'deletion', 'WARNING', `Secret ${target.name} soft-deleted. Retention: 90 days.`);
  };

  // Certificate Operations
  const createCertificate = (certData) => {
    const newCert = {
      id: Date.now(),
      name: certData.name.toLowerCase().replace(/\s+/g, '-'),
      subject: certData.subject || `CN=${certData.name}.enterprise.com`,
      issuer: certData.issuer || 'Azure Internal Enterprise CA',
      thumbprint: certData.thumbprint || Array.from({length: 20}, () => Math.floor(Math.random()*16).toString(16).toUpperCase()).join(''),
      sans: certData.sans || [certData.name],
      createdAt: new Date().toISOString(),
      expiresAt: certData.expiresAt || new Date(Date.now() + 365*24*60*60*1000).toISOString(),
      validityDays: 365,
      status: 'ACTIVE',
      autoRenew: certData.autoRenew !== undefined ? certData.autoRenew : true,
      renewBeforeDays: 30,
      application: certData.application || 'Enterprise Gateway'
    };

    setCertificates((prev) => [newCert, ...prev]);
    addAuditLog('CERTIFICATE_CREATED', newCert.name, 'admin@example.com', 'certificate', 'SUCCESS', `Certificate ${newCert.name} issued.`);
    return newCert;
  };

  const renewCertificate = (id) => {
    setCertificates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newExpiry = new Date(Date.now() + 365*24*60*60*1000).toISOString();
          const updated = {
            ...c,
            expiresAt: newExpiry,
            status: 'ACTIVE',
            updatedAt: new Date().toISOString()
          };
          addAuditLog('CERTIFICATE_RENEWED', c.name, 'admin@example.com', 'certificate', 'SUCCESS', `Certificate ${c.name} manually renewed for 365 days.`);
          return updated;
        }
        return c;
      })
    );
  };

  const softDeleteCertificate = (id) => {
    const target = certificates.find((c) => c.id === id);
    if (!target) return;

    setCertificates((prev) => prev.filter((c) => c.id !== id));

    const deletedItem = {
      id: Date.now(),
      type: 'CERTIFICATE',
      name: target.name,
      category: 'CERTIFICATE',
      deletedOn: new Date().toISOString(),
      retentionDays: settings.retentionDays || 90,
      daysRemaining: settings.retentionDays || 90,
      purgeProtection: settings.purgeProtection,
      deletedBy: 'admin@example.com',
      originalData: target
    };

    setSoftDeletedItems((prev) => [deletedItem, ...prev]);
    addAuditLog('CERTIFICATE_SOFT_DELETED', target.name, 'admin@example.com', 'deletion', 'WARNING', `Certificate ${target.name} soft-deleted.`);
  };

  // Soft Delete Recovery & Purge
  const recoverItem = (id) => {
    const item = softDeletedItems.find((i) => i.id === id);
    if (!item) return;

    setSoftDeletedItems((prev) => prev.filter((i) => i.id !== id));

    if (item.type === 'SECRET' && item.originalData) {
      setSecrets((prev) => [item.originalData, ...prev]);
    } else if (item.type === 'CERTIFICATE' && item.originalData) {
      setCertificates((prev) => [item.originalData, ...prev]);
    }

    addAuditLog(`${item.type}_RECOVERED`, item.name, 'admin@example.com', 'system', 'SUCCESS', `Resource ${item.name} recovered from soft-delete.`);
  };

  const purgeItem = (id) => {
    const item = softDeletedItems.find((i) => i.id === id);
    if (!item) return;

    setSoftDeletedItems((prev) => prev.filter((i) => i.id !== id));
    addAuditLog(`${item.type}_PURGED`, item.name, 'admin@example.com', 'deletion', 'WARNING', `Resource ${item.name} permanently purged.`);
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addAuditLog('SETTINGS_UPDATED', 'KeyVaultConfig', 'admin@example.com', 'system', 'SUCCESS', 'Vault settings updated.');
  };

  return (
    <VaultContext.Provider
      value={{
        secrets,
        certificates,
        softDeletedItems,
        auditLogs,
        settings,
        servicesStatus,
        createSecret,
        updateSecret,
        rotateSecret,
        softDeleteSecret,
        createCertificate,
        renewCertificate,
        softDeleteCertificate,
        recoverItem,
        purgeItem,
        updateSettings,
        addAuditLog
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => useContext(VaultContext);
