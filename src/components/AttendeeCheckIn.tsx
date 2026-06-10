/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, Scan, Skull, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Attendee, LanguageCode, AuditLog } from '../types';

interface AttendeeCheckInProps {
  currentLanguage: LanguageCode;
  registeredAttendees: Attendee[];
  onCheckInSuccess: (ticketCode: string, trackingLog: AuditLog) => void;
}

export default function AttendeeCheckIn({
  registeredAttendees,
  onCheckInSuccess
}: AttendeeCheckInProps) {
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<{ status: 'idle' | 'success' | 'failed'; name?: string; msg?: string }>({ status: 'idle' });

  // Handle mock manual code submission
  const handleCheckInSubmit = (codeVal: string) => {
    if (!codeVal.trim()) return;

    const codeClean = codeVal.trim().toUpperCase();
    const match = registeredAttendees.find(a => a.ticketCode.toUpperCase() === codeClean || a.id.toUpperCase() === codeClean);

    if (match) {
      if (match.isCheckedIn) {
        setScanStatus({
          status: 'failed',
          msg: `ACCESS DENIED: Duplicate ticket scanning. Attendee "${match.fullName}" was already checked-in previously.`
        });
        return;
      }

      // Successful check-in trigger
      const logItem: AuditLog = {
        id: 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        timestamp: new Date().toISOString(),
        actor: 'GATEWAY_SCANNER_A',
        action: 'ATTENDEE_CHECK_IN',
        status: 'SUCCESS',
        ipAddress: '192.168.1.99',
        details: `Successfully check-in verified for QR coordinate: ${match.ticketCode}. Name: ${match.fullName}. Session admission locked.`
      };

      onCheckInSuccess(match.ticketCode, logItem);
      setScanStatus({
        status: 'success',
        name: match.fullName,
        msg: `SOUL CONFIRMED. Gate unlocked for "${match.fullName}" (${match.ticketCode}). Enjoy the coven!`
      });
      setManualCode('');
    } else {
      setScanStatus({
        status: 'failed',
        msg: `ACCESS DENIED: Credentials code "${codeClean}" not located in the archives. CCPA double-check failed.`
      });
    }
  };

  // Simulate scanning experience
  const triggerAutoScanModel = () => {
    if (registeredAttendees.length === 0) {
      setScanStatus({
        status: 'failed',
        msg: 'No souls registered in the local matrix database. Please register for a ticket beforehand.'
      });
      return;
    }

    setScanning(true);
    setScanStatus({ status: 'idle' });

    setTimeout(() => {
      setScanning(false);
      // Select first non-checked in attendee if possible, otherwise first registered
      const target = registeredAttendees.find(a => !a.isCheckedIn) || registeredAttendees[0];
      handleCheckInSubmit(target.ticketCode);
    }, 2200);
  };

  return (
    <div id="checkin-gate-stage" className="max-w-4xl mx-auto px-4 py-8 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left pane: Camera Scanning Viewfinder Mockup */}
        <div className="rounded-xl border border-red-950/60 bg-[#060608]/90 overflow-hidden flex flex-col justify-between p-6 relative">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4 text-red-500 animate-pulse" />
              <h3 className="font-mono text-sm uppercase tracking-widest text-[#ef4444]">
                Touchless Scanner Eye
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
              <span className="font-mono text-[9px] text-zinc-500 uppercase">Live Sensor Online</span>
            </div>
          </div>

          {/* Camera Visual stream Box */}
          <div className="aspect-square w-full rounded bg-black/90 border border-zinc-950 flex flex-col items-center justify-center relative overflow-hidden my-3">
            
            {/* Viewfinder Target corner guides */}
            <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-red-600"></div>
            <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-red-600"></div>
            <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-red-600"></div>
            <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-red-600"></div>

            {/* Pulsing red lasers */}
            {scanning ? (
              <>
                <div className="absolute inset-x-4 h-[2px] bg-red-600 animate-scanner-sweep shadow-lg shadow-red-500"></div>
                <div className="space-y-2 text-center z-10 p-4">
                  <RefreshCw className="h-8 w-8 text-red-500 animate-spin mx-auto mb-3" />
                  <p className="font-mono text-xs uppercase tracking-widest text-red-500 animate-pulse">
                    Parsing QR Coordinates...
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-4 text-center z-10 p-6">
                <Scan className="h-10 w-10 text-zinc-800 mx-auto animate-pulse" />
                <p className="font-mono text-[10.5px] uppercase tracking-wider text-zinc-500 leading-relaxed max-w-xs mx-auto">
                  Hold QR Code pass or souvenir wristband up to your webcam camera stream to check-in.
                </p>
                <button
                  id="btn-simulate-scanner-feed"
                  onClick={triggerAutoScanModel}
                  className="px-4 py-2 bg-red-950/20 hover:bg-red-950/50 border border-red-900/60 text-red-400 font-mono text-xs uppercase tracking-wide rounded cursor-pointer transition-colors"
                >
                  🔮 Simulate Scan Detector
                </button>
              </div>
            )}

            {/* Watermark brand overlay */}
            <span className="absolute bottom-4 right-4 font-mono text-[8px] text-zinc-800 tracking-widest uppercase">
              DEEP-SCAN v2.05-AES
            </span>
          </div>

          <p className="font-mono text-[10px] text-[#52525b] uppercase leading-tight text-center mt-3">
            🛡️ AUTO CCPA COMPLIANCE SCAN FOR SECURE VERIFICATION ON-SITE
          </p>

        </div>

        {/* Right pane: Manual Input / Status Log Lookup */}
        <div className="rounded-xl border border-zinc-950 bg-black/60 p-6 flex flex-col justify-between gap-6">
          <div className="space-y-4 text-left">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wide text-[#ffffff] font-semibold">
                Manual Vault Check-In
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                If touchless scanning is unavailable, administrative gatekeepers may override security by entering the Ticket ID or QR Code below.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400">
                Ticket Code ID / QR Coordination
              </label>
              <div className="flex gap-2">
                <input
                  id="manual-ticket-entry-checkin"
                  type="text"
                  placeholder="e.g. QR-ABC123-STANDARD"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 bg-[#060608] border border-gray-900 focus:border-red-900 focus:ring-1 focus:ring-red-900/40 px-3.5 py-2.5 rounded text-xs text-white font-mono uppercase"
                />
                <button
                  id="btn-submit-manual-code"
                  onClick={() => handleCheckInSubmit(manualCode)}
                  className="bg-red-700 hover:bg-red-600 text-white font-mono text-xs uppercase px-4 py-2.5 rounded tracking-wider cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Quick Helper of registered attendees currently saved */}
            <div className="p-3.5 rounded border border-zinc-900 bg-zinc-950/30 text-xs">
              <span className="font-mono text-[9px] text-[#71717a] uppercase block mb-1.5 font-bold">
                Local Database Index ({registeredAttendees.length} souls registered)
              </span>
              {registeredAttendees.length === 0 ? (
                <p className="text-[11px] text-zinc-600 font-mono">No registered attendees. Passes are completely fresh.</p>
              ) : (
                <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {registeredAttendees.map(a => (
                    <div key={a.id} className="flex items-center justify-between text-[11px] border-b border-gray-950 pb-1 font-mono">
                      <span className="text-gray-300 truncate max-w-[140px]">{a.fullName}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-zinc-500 text-[10px]" title="Click to copy manual code" onClick={() => { setManualCode(a.ticketCode); }}>
                          {a.ticketCode}
                        </span>
                        {a.isCheckedIn ? (
                          <span className="text-green-500 text-[9.5px] uppercase">● In</span>
                        ) : (
                          <span className="text-yellow-600 text-[9.5px] uppercase">● Draft</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Live Scanner Feedback Status */}
          <div id="scanning-feedback-box" className="pt-2">
            {scanStatus.status === 'success' && (
              <div className="p-4 rounded border border-green-950 bg-green-950/10 text-green-400 font-mono text-xs flex items-start gap-2.5 animate-pulse">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold">✓ SECURITY CLEARANCE VERIFIED</span>
                  <span className="block mt-1 text-gray-300 leading-normal">{scanStatus.msg}</span>
                </div>
              </div>
            )}

            {scanStatus.status === 'failed' && (
              <div className="p-4 rounded border border-red-950 bg-red-950/10 text-red-400 font-mono text-xs flex items-start gap-2.5 animate-pulse">
                <Skull className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold">🚨 ACCESS DENIED</span>
                  <span className="block mt-1 text-gray-300 leading-normal">{scanStatus.msg}</span>
                </div>
              </div>
            )}

            {scanStatus.status === 'idle' && (
              <div className="p-4 rounded border border-gray-900 bg-gray-950/10 text-zinc-500 text-center font-mono text-xs">
                Waiting for scanner input feed... Ready to authenticate.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
