/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DollarSign, Users, CheckSquare, ShieldAlert, FileText, Download, Play } from 'lucide-react';
import { Attendee, AuditLog, LanguageCode } from '../types';
import { TICKET_TIERS } from '../data';

interface OrganizerDashboardProps {
  currentLanguage: LanguageCode;
  attendees: Attendee[];
  auditLogs: AuditLog[];
  onTriggerMockAlert: (actor: string, action: string, details: string) => void;
  onClearDatabase: () => void;
}

export default function OrganizerDashboard({
  attendees,
  auditLogs,
  onTriggerMockAlert,
  onClearDatabase
}: OrganizerDashboardProps) {
  const [filterType, setFilterType] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'ALERT'>('ALL');

  // Calculate statistics
  const ticketsSold = attendees.length;
  const totalRevenue = attendees.reduce((acc, a) => {
    const tier = TICKET_TIERS.find(t => t.id === a.ticketTierId);
    return acc + (tier ? tier.currentPrice : 0);
  }, 0);
  const totalCheckIns = attendees.filter(a => a.isCheckedIn).length;
  const alertCount = auditLogs.filter(l => l.status === 'ALERT').length;

  const filteredLogs = auditLogs.filter(log => {
    if (filterType === 'ALL') return true;
    return log.status === filterType;
  });

  // Render a value as a safe CSV cell: escape quotes, and neutralize
  // spreadsheet formula-injection by prefixing cells that begin with a
  // formula trigger (=, +, -, @, tab, CR) with a single quote.
  const csvCell = (value: unknown): string => {
    let s = value === null || value === undefined ? '' : String(value);
    if (/^[=+\-@\t\r]/.test(s)) {
      s = "'" + s;
    }
    return `"${s.replace(/"/g, '""')}"`;
  };

  const triggerCsvDownload = (headers: string[], rows: string[][], filename: string) => {
    const body = [headers, ...rows].map(cols => cols.map(csvCell).join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(body);
    const link = document.createElement('a');
    link.href = csvContent;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV of Registered Souls/Attendees for regulatory data transparency
  const handleExportCsv = () => {
    const headers = ['AttendeeID', 'FullName', 'Email', 'Phone', 'TicketTier', 'TicketCode', 'RegisterDate', 'CheckedInStatus', 'MFAEnabled', 'CCPA_GDPR_Consent'];
    const rows = attendees.map(a => {
      const tier = TICKET_TIERS.find(t => t.id === a.ticketTierId)?.name || 'Unknown';
      return [a.id, a.fullName, a.email, a.phone || '', tier, a.ticketCode, a.registrationDate, String(a.isCheckedIn), String(a.mfaEnabled), String(a.consentSigned)];
    });
    triggerCsvDownload(headers, rows, 'Attendee_Audit_Report_Waco2026.csv');
  };

  // Export Auditor Logs CSV for CCPA and forensic compliance transparency
  const handleExportAuditLogs = () => {
    const headers = ['AuditLogID', 'Timestamp', 'OperatorNode', 'ActionClass', 'StatusAlert', 'IPKey', 'OperationDetails'];
    const rows = auditLogs.map(l => [l.id, l.timestamp, l.actor, l.action, l.status, l.ipAddress, l.details]);
    triggerCsvDownload(headers, rows, 'Audit_Trail_Report_Waco2026.csv');
  };

  // Fire simulation alert test to check network safeguards in real-time
  const handleSimulateBruteForce = () => {
    const randomIp = `${Math.floor(110 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 90)}.${Math.floor(1 + Math.random() * 254)}.${Math.floor(11 + Math.random() * 200)}`;
    onTriggerMockAlert(
      'IDS_SENTRY_NODE_W3',
      'SUSPICIOUS_VOLUME_ANOMALY',
      `Shield warning: Brute-force credentials scanning signature observed from rogue IP ${randomIp}. Intercept sequence initiated.`
    );
  };

  const handleSimulateCredentialLeak = () => {
    onTriggerMockAlert(
      'DATA_INTEGRITY_SHIELD',
      'DECRYPTION_SIGNATURE_COLLISION',
      'GDPR Leak guard: Unauthorized attempt to decrypted standard bulk email headers without validated cryptographic multi-factor signature.'
    );
  };

  return (
    <div id="organizer-dashboard-panel" className="max-w-7xl mx-auto px-4 py-8 text-left space-y-8">
      
      {/* Overview stats cards line */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-lg border border-zinc-900 bg-[#07070a]/40 backdrop-blur-sm flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] text-[#71717a] uppercase block tracking-wider">Accumulated Coins</span>
            <span className="text-2xl font-mono font-bold text-red-500">${totalRevenue}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">Gross Ticketing Funds</span>
          </div>
          <div className="p-2.5 rounded-full bg-red-950/20 border border-red-900/40 text-red-500 shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-lg border border-zinc-900 bg-[#07070a]/40 backdrop-blur-sm flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] text-[#71717a] uppercase block tracking-wider">Registered Souls</span>
            <span className="text-2xl font-mono font-bold text-white">{ticketsSold}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">Passes Active</span>
          </div>
          <div className="p-2.5 rounded-full bg-green-950/20 border border-green-900/40 text-green-500 shrink-0">
            <Users className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        <div className="p-5 rounded-lg border border-zinc-900 bg-[#07070a]/40 backdrop-blur-sm flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] text-[#71717a] uppercase block tracking-wider">Soul Check-Ins</span>
            <span className="text-2xl font-mono font-bold text-yellow-500">{totalCheckIns}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">
              {ticketsSold > 0 ? Math.round((totalCheckIns / ticketsSold) * 100) : 0}% Admission Rate
            </span>
          </div>
          <div className="p-2.5 rounded-full bg-yellow-950/20 border border-yellow-900/40 text-yellow-500 shrink-0">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-lg border-red-900/40 border bg-gradient-to-r from-red-950/10 to-black/10 backdrop-blur-sm flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] text-red-500 uppercase block tracking-wider font-semibold">Active Alerts Flagged</span>
            <span className="text-2xl font-mono font-bold text-red-500 animate-pulse">{alertCount}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">Suspicious Logs Captured</span>
          </div>
          <div className="p-2.5 rounded-full bg-red-900/30 text-red-500 shrink-0">
            <ShieldAlert className="h-5 w-5 animate-bounce" />
          </div>
        </div>

      </div>

      {/* Database control dashboard & simulation panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Dynamic Graphic Analytics Diagram Panel (SVG based for ultimate compatibility) */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col justify-between whitespace-normal">
          <div>
            <div className="flex items-center justify-between border-b border-gray-950 pb-3 mb-4">
              <h3 className="font-mono text-sm uppercase text-[#ffffff]">
                📊 Real-Time Dynamic Ticket Distribution & Logistics
              </h3>
              <span className="text-[9px] font-mono text-zinc-400 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
                Waco Gathering Dome Sighting metrics
              </span>
            </div>

            {/* Simulated Data Bar Chart */}
            <div className="space-y-4 my-4">
              {TICKET_TIERS.map((tier) => {
                const tierCount = attendees.filter(a => a.ticketTierId === tier.id).length;
                const percentage = tier.totalStock > 0 ? (tierCount / tier.totalStock) * 100 : 0;

                return (
                  <div key={tier.id} className="space-y-1">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-gray-300 font-semibold">{tier.name}</span>
                      <span className="text-red-500 font-bold">
                        {tierCount} registered ({Math.round(percentage)}%)
                      </span>
                    </div>
                    {/* Visual bar tracker */}
                    <div className="w-full h-4 bg-black rounded overflow-hidden flex">
                      <div
                        className="h-full bg-red-700 rounded-r-sm shadow transition-all duration-1000"
                        style={{ width: `${Math.max(percentage, 3)}%` }} // Minimum width so it aligns nicely
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger panel */}
          <div className="pt-4 border-t border-zinc-950 flex flex-wrap gap-2.5">
            <button
              id="btn-export-registered-souls"
              onClick={handleExportCsv}
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white hover:text-red-500 border border-gray-800 hover:border-red-950 rounded font-mono text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>Export Registered Souls (CSV)</span>
            </button>
            <button
              id="btn-export-audit-trail"
              onClick={handleExportAuditLogs}
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-[#ffffff] hover:text-red-500 border border-gray-800 hover:border-red-950 rounded font-mono text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Export Audit Logs (CSV)</span>
            </button>
            <button
              id="btn-reset-database-organizer"
              onClick={onClearDatabase}
              className="px-4 py-2 bg-red-950/20 hover:bg-red-950/40 text-red-500 border border-red-950/80 hover:border-red-600 rounded font-mono text-xs uppercase cursor-pointer"
            >
              ⚠️ Reset Vault Database
            </button>
          </div>

        </div>

        {/* Security Alert Simulator Controls */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col justify-between">
          <div className="space-y-4 text-left">
            <div className="border-b border-gray-900 pb-3">
              <h3 className="font-mono text-sm uppercase text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-yellow-600 animate-pulse" />
                Security Gateway Command
              </h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Verify the automatic firewall intrusion detectors and CCPA compliant reporting tools by manually triggering these simulated suspicious events.
            </p>

            <div className="space-y-2 pt-2">
              <button
                id="btn-sim-intrusion-one"
                onClick={handleSimulateBruteForce}
                className="w-full p-2.5 bg-black hover:bg-zinc-900 border border-red-950/50 hover:border-red-900 rounded text-left flex items-start gap-3 transition-colors cursor-pointer"
              >
                <div className="p-1 rounded bg-red-950/20 text-red-500 shrink-0 mt-0.5">
                  <Play className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="block font-mono text-xs uppercase text-red-400 font-bold">Simulate IP Brute-Force</span>
                  <span className="block text-[10px] text-zinc-500 leading-normal">Fires sentinel firewall alarm for bulk ticket queries.</span>
                </div>
              </button>

              <button
                id="btn-sim-intrusion-two"
                onClick={handleSimulateCredentialLeak}
                className="w-full p-2.5 bg-black hover:bg-zinc-900 border border-yellow-950/50 hover:border-yellow-900 rounded text-left flex items-start gap-3 transition-colors cursor-pointer"
              >
                <div className="p-1 rounded bg-yellow-950/20 text-yellow-600 shrink-0 mt-0.5">
                  <Play className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="block font-mono text-xs uppercase text-yellow-500 font-bold">Simulate MFA Leak Attempt</span>
                  <span className="block text-[10px] text-zinc-500 leading-normal">Triggers anti-tamper log of bulk decryption locks.</span>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-950 text-center">
            <span className="font-mono text-[9px] text-[#424248] uppercase tracking-wider block">
              🛡️ COMPLIANCE SHIELD • ENVELOPS GDPR ART.32 CERTIFICATE
            </span>
          </div>

        </div>

      </div>

      {/* Section: Automated GDPR Cryptographic Audit Trail log table */}
      <div className="rounded-xl border border-zinc-900 bg-black/40 p-6 text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-950 pb-4 mb-4">
          <div>
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              Automated Forensic Audit Trail Log (CCPA/GDPR Decoded)
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Every critical user registration, payment gateway handshake, scan-verification or security override logs a salted entry automatically.
            </p>
          </div>

          {/* Table filter options */}
          <div className="flex bg-black/90 p-1.5 rounded border border-gray-900 font-mono text-[10px] uppercase gap-1.5">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded cursor-pointer ${filterType === 'ALL' ? 'bg-red-950/60 text-red-400 font-bold border border-red-900/30' : 'text-zinc-500'}`}
            >
              All Threads
            </button>
            <button
              onClick={() => setFilterType('SUCCESS')}
              className={`px-2.5 py-1 rounded cursor-pointer ${filterType === 'SUCCESS' ? 'bg-green-950/60 text-green-400 font-bold border border-green-900/30' : 'text-zinc-500'}`}
            >
              Success
            </button>
            <button
              onClick={() => setFilterType('WARNING')}
              className={`px-2.5 py-1 rounded cursor-pointer ${filterType === 'WARNING' ? 'bg-yellow-950/60 text-yellow-500 font-bold border border-yellow-900/30' : 'text-zinc-500'}`}
            >
              Unsecured MFA
            </button>
            <button
              onClick={() => setFilterType('ALERT')}
              className={`px-2.5 py-1 rounded cursor-pointer ${filterType === 'ALERT' ? 'bg-red-950/85 text-red-500 font-bold border border-red-900/30' : 'text-zinc-500'}`}
            >
              Suspicious Alert
            </button>
          </div>
        </div>

        {/* Audit Log Table visual rendering */}
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 text-left uppercase">
                <th className="py-2.5 pr-4">Timestamp</th>
                <th className="py-2.5 px-4">Operator Node</th>
                <th className="py-2.5 px-4">Action Method</th>
                <th className="py-2.5 px-4">IP coord</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 pl-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0c0d12]">
              {filteredLogs.map((log) => {
                let badgeClass = 'text-green-500 bg-green-950/10 border-green-950';
                if (log.status === 'WARNING') badgeClass = 'text-yellow-600 bg-yellow-950/10 border-yellow-950';
                if (log.status === 'ALERT') badgeClass = 'text-red-500 bg-red-950/10 border-red-950 animate-pulse';

                return (
                  <tr key={log.id} id={`audit-card-${log.id}`} className="hover:bg-zinc-950/30 transition-colors">
                    <td className="py-2.5 pr-4 text-zinc-600 min-w-[130px]">{log.timestamp.slice(11, 19)} (UTC)</td>
                    <td className="py-2.5 px-4 text-gray-300 font-semibold">{log.actor}</td>
                    <td className="py-2.5 px-4 text-gray-400">{log.action}</td>
                    <td className="py-2.5 px-4 text-gray-500 font-light">{log.ipAddress}</td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] uppercase border font-semibold ${badgeClass}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 pl-4 text-zinc-400 font-sans max-w-sm break-words md:truncate md:hover:whitespace-normal">
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
