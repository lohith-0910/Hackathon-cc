export const initialCertificates = [
  {
    id: 1,
    name: "student-portal-cert",
    subject: "CN=portal.student.edu",
    issuer: "DigiCert Global TLS RSA SHA256 2020 CA1",
    thumbprint: "4A991F2C88910023AB4567890123456789ABCDEF",
    sans: ["portal.student.edu", "api.student.edu"],
    createdAt: "2025-10-20T00:00:00Z",
    expiresAt: "2026-10-20T23:59:59Z", // Expiry countdown dynamic calculation
    validityDays: 365,
    status: "EXPIRING_SOON",
    autoRenew: true,
    renewBeforeDays: 30,
    application: "Student Portal"
  },
  {
    id: 2,
    name: "payment-api-cert",
    subject: "CN=pay.api.enterprise.com",
    issuer: "Azure Public Certificate Authority",
    thumbprint: "B823F11A77401928374650192837465019283746",
    sans: ["pay.api.enterprise.com"],
    createdAt: "2026-01-10T00:00:00Z",
    expiresAt: "2027-01-10T23:59:59Z",
    validityDays: 365,
    status: "ACTIVE",
    autoRenew: true,
    renewBeforeDays: 45,
    application: "Payment Gateway"
  },
  {
    id: 3,
    name: "ecommerce-tls-cert",
    subject: "CN=shop.enterprise.com",
    issuer: "Let's Encrypt Authority X3",
    thumbprint: "9910A8877B66554433221100AABBCCDDEEFF0011",
    sans: ["shop.enterprise.com", "m.shop.enterprise.com"],
    createdAt: "2026-07-01T00:00:00Z",
    expiresAt: "2026-10-01T23:59:59Z",
    validityDays: 90,
    status: "CRITICAL",
    autoRenew: false,
    renewBeforeDays: 15,
    application: "E-Commerce Platform"
  },
  {
    id: 4,
    name: "api-gateway-cert",
    subject: "CN=gateway.internal.az",
    issuer: "Azure Internal Enterprise CA",
    thumbprint: "0102030405060708090A0B0C0D0E0F1011121314",
    sans: ["gateway.internal.az", "*.gateway.internal.az"],
    createdAt: "2025-05-15T00:00:00Z",
    expiresAt: "2026-05-15T23:59:59Z",
    validityDays: 365,
    status: "EXPIRED",
    autoRenew: false,
    renewBeforeDays: 30,
    application: "Mobile API"
  }
];
