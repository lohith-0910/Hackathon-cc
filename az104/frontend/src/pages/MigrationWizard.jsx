import React, { useState } from 'react';
import { Wand2, CheckCircle2, ArrowRight, ShieldCheck, Copy, Code2, Lock, Plus } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useNavigate } from 'react-router-dom';

export const MigrationWizard = () => {
  const { createSecret } = useVault();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Detect, 2: Secure, 3: Replace
  const [inputText, setInputText] = useState('String dbPassword = "SecretPass123!";');
  const [detectedType, setDetectedType] = useState('Database Password');
  const [secretName, setSecretName] = useState('DATABASE_PASSWORD');
  const [category, setCategory] = useState('DATABASE');
  const [secretValue, setSecretValue] = useState('SecretPass123!');
  const [application, setApplication] = useState('Student Portal');
  const [activeTab, setActiveTab] = useState('java'); // java, node, python, csharp
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState(false);

  const handleAnalyze = () => {
    // Simple heuristic detection logic
    if (inputText.toLowerCase().includes('key') || inputText.toLowerCase().includes('sk_')) {
      setDetectedType('API Key');
      setSecretName('API_SECRET_KEY');
      setCategory('API');
      const match = inputText.match(/"([^"]+)"|'([^']+)'/);
      if (match) setSecretValue(match[1] || match[2]);
    } else if (inputText.toLowerCase().includes('jdbc') || inputText.toLowerCase().includes('connection') || inputText.toLowerCase().includes('host=')) {
      setDetectedType('Connection String');
      setSecretName('DB_CONNECTION_STRING');
      setCategory('DATABASE');
      const match = inputText.match(/"([^"]+)"|'([^']+)'/);
      if (match) setSecretValue(match[1] || match[2]);
    } else {
      setDetectedType('Database Password');
      setSecretName('DATABASE_PASSWORD');
      setCategory('DATABASE');
      const match = inputText.match(/"([^"]+)"|'([^']+)'/);
      if (match) setSecretValue(match[1] || match[2] || 'SecretPass123!');
    }
    setStep(2);
  };

  const handleSaveToVault = () => {
    createSecret({
      name: secretName,
      value: secretValue,
      category,
      application
    });
    setCreated(true);
    setStep(3);
  };

  const getBeforeCode = () => {
    return inputText || `String password = "mypassword";`;
  };

  const getAfterCode = (lang) => {
    const formattedName = secretName.toLowerCase().replace(/_/g, '-');
    switch (lang) {
      case 'node':
        return `// Secure Azure Key Vault SDK
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const credential = new DefaultAzureCredential();
const client = new SecretClient("https://kv-prod-eastus-01.vault.azure.net", credential);

// Fetch credential dynamically at runtime
const secret = await client.getSecret("${formattedName}");
const password = secret.value;`;

      case 'python':
        return `# Secure Azure Key Vault SDK
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://kv-prod-eastus-01.vault.azure.net", credential=credential)

# Fetch credential dynamically at runtime
secret = client.get_secret("${formattedName}")
password = secret.value`;

      case 'csharp':
        return `// Secure Azure Key Vault SDK
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

var client = new SecretClient(new Uri("https://kv-prod-eastus-01.vault.azure.net"), new DefaultAzureCredential());

// Fetch credential dynamically at runtime
KeyVaultSecret secret = await client.GetSecretAsync("${formattedName}");
string password = secret.Value;`;

      default: // java / spring
        return `// Secure Azure Key Vault SDK Integration
@Autowired
private SecretClient secretClient;

// Fetch credential dynamically at runtime
KeyVaultSecret secret = secretClient.getSecret("${formattedName}");
String password = secret.getValue();`;
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#0078D4] uppercase tracking-wider mb-1">
          <Wand2 className="w-4 h-4" />
          <span>Security Automation</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
          Credential Migration Wizard
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Eliminate hardcoded source code secrets by detecting, securing in Azure Key Vault, and replacing with SDK calls.
        </p>
      </div>

      {/* 3 Step Indicator */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          <div className={`p-3 rounded-lg flex items-center justify-center space-x-2 border transition-all ${
            step === 1 ? 'bg-blue-50 border-[#0078D4] text-[#0078D4]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
          }`}>
            <span className="w-5 h-5 rounded-full bg-[#0078D4] text-white text-[11px] flex items-center justify-center font-bold">1</span>
            <span>1. Detect</span>
          </div>

          <div className={`p-3 rounded-lg flex items-center justify-center space-x-2 border transition-all ${
            step === 2 ? 'bg-blue-50 border-[#0078D4] text-[#0078D4]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
          }`}>
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-[#0078D4] text-white' : 'bg-slate-200 text-[#64748B]'
            }`}>2</span>
            <span>2. Secure</span>
          </div>

          <div className={`p-3 rounded-lg flex items-center justify-center space-x-2 border transition-all ${
            step === 3 ? 'bg-blue-50 border-[#0078D4] text-[#0078D4]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
          }`}>
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
              step === 3 ? 'bg-[#0078D4] text-white' : 'bg-slate-200 text-[#64748B]'
            }`}>3</span>
            <span>3. Replace</span>
          </div>
        </div>
      </div>

      {/* Step 1: Detect */}
      {step === 1 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-[#0078D4]" />
            <span>Step 1: Paste hardcoded credential from your source code</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Code Snippet or Raw Credential String
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. String dbPassword = &quot;mypassword123&quot;;"
              className="w-full p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              className="px-5 py-2.5 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-xs rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
            >
              <span>Analyze & Detect</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Secure */}
      {step === 2 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-[#004E8C]">
            <CheckCircle2 className="w-5 h-5 text-[#0078D4] shrink-0" />
            <div>
              <span className="font-bold">Credential Detected:</span> {detectedType} found in snippet.
            </div>
          </div>

          <h2 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#0078D4]" />
            <span>Step 2: Store securely in Key Vault</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Secret Key Name</label>
              <input
                type="text"
                value={secretName}
                onChange={(e) => setSecretName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
              >
                <option value="DATABASE">DATABASE</option>
                <option value="API">API</option>
                <option value="STORAGE">STORAGE</option>
                <option value="AUTHENTICATION">AUTHENTICATION</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Extracted Value</label>
              <input
                type="password"
                value={secretValue}
                onChange={(e) => setSecretValue(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Target Application</label>
              <input
                type="text"
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0078D4]"
              />
            </div>
          </div>

          <div className="flex justify-between border-t border-[#E2E8F0] pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] font-medium text-xs rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSaveToVault}
              className="px-5 py-2.5 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-xs rounded-lg transition-colors shadow-sm flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Store Secret & Generate SDK Code</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Replace Code Comparison */}
      {step === 3 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-[#16A34A] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#16A34A]" />
              <span>Secret <strong>{secretName}</strong> successfully stored in Azure Key Vault!</span>
            </div>
            <button
              onClick={() => navigate('/secrets')}
              className="text-[11px] text-[#0078D4] font-bold hover:underline"
            >
              View in Vault →
            </button>
          </div>

          <h2 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-[#0078D4]" />
            <span>Step 3: Code Comparison (Replace in Source Code)</span>
          </h2>

          {/* Language Tabs */}
          <div className="flex space-x-2 border-b border-[#E2E8F0]">
            {[
              { id: 'java', label: 'Java / Spring Boot' },
              { id: 'node', label: 'Node.js / Express' },
              { id: 'python', label: 'Python' },
              { id: 'csharp', label: 'C# .NET' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === t.id
                    ? 'border-[#0078D4] text-[#0078D4] font-bold'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Before & After Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-bold text-[#DC2626] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>BEFORE (Insecure Hardcoded)</span>
                <span className="text-[10px] bg-red-50 text-[#DC2626] px-2 py-0.5 rounded border border-red-200 font-mono">RISK</span>
              </div>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto min-h-[140px] border border-slate-800">
                <code>{getBeforeCode()}</code>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#16A34A] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>AFTER (Secure Key Vault SDK)</span>
                <button
                  onClick={() => copyCode(getAfterCode(activeTab))}
                  className="text-[11px] text-[#0078D4] hover:underline flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto min-h-[140px] border border-slate-800">
                <pre>{getAfterCode(activeTab)}</pre>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-[#E2E8F0] pt-4">
            <button
              onClick={() => {
                setStep(1);
                setCreated(false);
              }}
              className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] font-medium text-xs rounded-lg transition-colors"
            >
              Migrate Another Secret
            </button>
            <button
              onClick={() => navigate('/secrets')}
              className="px-5 py-2.5 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
            >
              Done & Go to Secrets Table
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
