# Azure Key Vault Manager &mdash; Hackathon Platform

Enterprise security management platform demonstrating Azure Key Vault architecture, credential migration, TLS certificate lifecycle, access control policies vs Azure RBAC, soft-delete recovery, purge protection, and microservice orchestration.

---

## Architecture Overview

```text
azure-key-vault-manager/
├── frontend/                     # React JSX + Vite + Tailwind CSS + Framer Motion
├── backend/
│   ├── eureka-server/            # Service Discovery (Port 8761)
│   ├── api-gateway/              # Spring Cloud Gateway (Port 8080)
│   ├── auth-service/             # JWT Authentication & RBAC User Management (Port 8081)
│   ├── secret-service/           # Secret Storage & Versioning (Port 8082)
│   ├── certificate-service/      # Certificate Management & Auto-renewal (Port 8083)
│   ├── vault-service/            # Vault Settings & SKU Configuration (Port 8084)
│   ├── audit-service/            # Immutable Audit Telemetry Stream (Port 8085)
│   └── notification-service/     # In-App Notification Alerts (Port 8086)
├── docker-compose.yml
└── README.md
```

---

## Phase 1 Deliverables Summary

- **Eureka Server (Port 8761)**: Microservices registry.
- **API Gateway (Port 8080)**: Reverse proxy routing, global CORS, and JWT request forwarding.
- **Auth Service (Port 8081)**: User registration, BCrypt password hashing, JWT generation with roles (`ADMIN`, `SECURITY_ADMIN`, `DEVELOPER`, `VIEWER`), and seeded demo accounts.
- **React Frontend (Port 5173)**: Built with React JSX, Vite, Tailwind CSS, Framer Motion, Lucide icons, and Recharts dashboard visualizers.

---

## Quick Start Instructions

### 1. Install Frontend Dependencies & Start Dev Server
```bash
cd frontend
npm install
npm run dev
```
Access UI at: `http://localhost:5173`

### 2. Build & Run Backend Microservices (Java 21)
```bash
cd backend
mvn clean package -DskipTests
```

Run Eureka Server:
```bash
java -jar eureka-server/target/eureka-server-1.0.0.jar
```
Eureka Dashboard at: `http://localhost:8761`

Run API Gateway:
```bash
java -jar api-gateway/target/api-gateway-1.0.0.jar
```

Run Auth Service:
```bash
java -jar auth-service/target/auth-service-1.0.0.jar
```

---

## Seed Demo Credentials

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@example.com` | `admin123` |
| **SECURITY_ADMIN** | `security@example.com` | `security123` |
| **DEVELOPER** | `developer@example.com` | `dev123` |
| **VIEWER** | `viewer@example.com` | `viewer123` |
