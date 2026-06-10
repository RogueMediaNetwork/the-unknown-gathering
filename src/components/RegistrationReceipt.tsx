/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, Calendar, Copy, Check, Key } from 'lucide-react';
import { Attendee, TicketTier, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data';

interface RegistrationReceiptProps {
  attendee: Attendee;
  selectedTier: TicketTier;
  mfaCode: string;
  currentLanguage: LanguageCode;
  onReset: () => void;
}

export default function RegistrationReceipt({
  attendee,
  selectedTier,
  mfaCode,
  currentLanguage,
  onReset
}: RegistrationReceiptProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  // Handle actual ICS file generation for Digital Planner Sync
  const handleIcsDownload = () => {
    // Generate valid iCalendar string
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//The Unknown Gathering//2026 Waco PACC//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:uid_pacc_conv_' + attendee.id,
      'DTSTAMP:20260528T200000Z',
      'DTSTART;TZID=America/Chicago:20261010T090000', // October 10th, 2026 @ 9am
      'DTEND;TZID=America/Chicago:20261010T200000',   // October 10th, 2026 @ 8pm
      'SUMMARY:The Unknown Gathering 2026',
      'DESCRIPTION:Welcome to The Unknown Gathering!\\n\\nYour Registration is SEALED.\\nAttendee: ' + attendee.fullName + '\\nTicket ID: ' + attendee.id + '\\nTicket Tier: ' + selectedTier.name + '\\nCheck-In QR Code ID: ' + attendee.ticketCode + '\\n\\nVenue: Waco Gathering Dome (PACC), Waco, Texas 76701.',
      'LOCATION:Waco Gathering Dome (PACC), Waco, Texas',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Unknown_Gathering_Waco2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, isCode: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="receipt-vault-stage" className="max-w-xl mx-auto rounded-xl border border-red-950/60 bg-[#060608]/95 p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/10 blur-[80px] pointer-events-none rounded-full"></div>

      {/* Spooky Confirmed Emblem */}
      <div className="mx-auto h-14 w-14 rounded-full bg-red-950/40 border border-red-600/40 flex items-center justify-center animate-pulse">
        <CheckCircle2 className="h-8 w-8 text-red-500" />
      </div>

      <div className="space-y-1.5">
        <p className="font-mono text-zinc-500 text-[10px] tracking-widest uppercase">
          {currentLanguage === 'spooky' ? '⛧ INITIATION SACRIFICE WITNESSED ⛧' : '✓ REGISTRATION COMPLETED SECURELY'}
        </p>
        <h2 className="font-mono text-2xl font-bold uppercase tracking-wider text-white">
          {currentLanguage === 'spooky' ? 'YOUR ENCOUNTER IS WITNESSED' : 'Welcome to the Unknown'}
        </h2>
        <p className="text-xs text-gray-400">
          Your reservation is locked for October 10th at the Waco Gathering Dome (PACC). Present your credential card on entry.
        </p>
      </div>

      {/* Aesthetic Spooky Souvenir Lanyard Labeled QR Section */}
      <div className="rounded bg-black border border-[#1b1c23] p-5 space-y-4 relative overflow-hidden">
        
        {/* Ticket Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 text-left">
          <div>
            <span className="font-mono text-[9px] text-zinc-500 uppercase block">Authorized Attendee</span>
            <span className="font-mono text-sm font-bold text-white uppercase">{attendee.fullName}</span>
          </div>
          <div className="text-right">
            <span className="font-mono text-[9px] text-[#71717a] block uppercase">Seal Class</span>
            <span className="font-mono text-xs font-semibold text-red-500 uppercase">{selectedTier.name}</span>
          </div>
        </div>

        {/* Pseudo QR code representation */}
        <div className="my-5 flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-white rounded-lg inline-block shadow-lg">
            {/* SVG mockup of a chillingly detailed gothic binary QR matrix */}
            <svg className="h-36 w-36 text-black" viewBox="0 0 100 100">
              {/* Outer border positions */}
              <rect x="5" y="5" width="25" height="25" fill="black" />
              <rect x="8" y="8" width="19" height="19" fill="white" />
              <rect x="12" y="12" width="11" height="11" fill="black" />

              <rect x="70" y="5" width="25" height="25" fill="black" />
              <rect x="73" y="8" width="19" height="19" fill="white" />
              <rect x="77" y="12" width="11" height="11" fill="black" />

              <rect x="5" y="70" width="25" height="25" fill="black" />
              <rect x="8" y="73" width="19" height="19" fill="white" />
              <rect x="12" y="77" width="11" height="11" fill="black" />

              {/* Random QR code dust noise */}
              <rect x="40" y="10" width="8" height="8" fill="black" />
              <rect x="55" y="5" width="6" height="12" fill="black" />
              <rect x="40" y="25" width="12" height="6" fill="black" />
              <rect x="60" y="22" width="6" height="6" fill="black" />
              
              <rect x="45" y="45" width="10" height="10" fill="red" /> {/* Central spooky seal crimson block */}
              
              <rect x="10" y="40" width="14" height="6" fill="black" />
              <rect x="25" y="50" width="8" height="16" fill="black" />
              <rect x="40" y="60" width="18" height="8" fill="black" />
              <rect x="50" y="80" width="14" height="10" fill="black" />
              <rect x="15" y="60" width="6" height="6" fill="black" />
              
              <rect x="70" y="40" width="10" height="18" fill="black" />
              <rect x="85" y="45" width="8" height="12" fill="black" />
              <rect x="78" y="65" width="17" height="6" fill="black" />
              <rect x="72" y="80" width="12" height="12" fill="black" />
            </svg>
          </div>
          
          <div className="font-mono text-zinc-400 text-xs">
            Unique Token: <span className="text-red-500 font-bold tracking-widest">{attendee.ticketCode}</span>
          </div>
        </div>

        {/* Ticket Footer / Secret ID */}
        <div className="pt-3 border-t border-zinc-900 text-left flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>UNKNOWN SYSTEM SEC_RECORDS</span>
          <span>SYSTEM CODE: {attendee.id}</span>
        </div>
      </div>

      {/* MFA Display (If Enabled) */}
      {attendee.mfaEnabled && (
        <div className="p-4 rounded border border-yellow-950 bg-amber-950/10 text-left space-y-2">
          <div className="flex items-center gap-1.5 text-yellow-500 font-mono text-xs uppercase font-bold">
            <Key className="h-4 w-4 animate-pulse" />
            <span>MFA Security Seed Activated</span>
          </div>
          <p className="text-[11px] text-gray-300">
            Secure multi-factor protocols are locked onto your coordinates. Download your digital authenticator app and enroll using this secret token to permit admin-level edits on-site:
          </p>
          <div className="flex items-center justify-between bg-black p-2 rounded border border-zinc-900 font-mono mt-1">
            <code className="text-yellow-400 text-sm tracking-widest font-bold">{mfaCode}</code>
            <button
              id="btn-copy-mfa-code"
              onClick={() => copyToClipboard(mfaCode, true)}
              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-zinc-900 cursor-pointer"
              title="Copy secret MFA"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Action panel: Digital Planner Sync Icon & Receipt Print */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        
        {/* Planner Sync Downloader */}
        <button
          id="btn-sync-personal-planner"
          onClick={handleIcsDownload}
          className="bg-zinc-900 hover:bg-black text-gray-300 border border-gray-800 hover:border-red-900 py-3.5 rounded font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Calendar className="h-4 w-4 text-red-500 animate-pulse" />
          <span>{t.addToCalendar || 'Add to Digital Planner (.ics)'}</span>
        </button>

        <button
          id="btn-copy-ticket-uuid"
          onClick={() => copyToClipboard(attendee.ticketCode, false)}
          className="bg-red-950/20 hover:bg-red-950/40 border border-red-900/60 text-red-400 py-3.5 rounded font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-white" />
              <span>✓ COPED CREDENTIAL</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-[#ef4444]" />
              <span>COPY TICKET CODE</span>
            </>
          )}
        </button>

      </div>

      {/* Secondary portal link to register again or view schedules */}
      <div className="pt-2">
        <button
          id="btn-return-coven"
          onClick={onReset}
          className="font-mono text-xs text-zinc-500 hover:text-red-500 uppercase tracking-widest transition-colors underline underline-offset-4 cursor-pointer"
        >
          ☠ Return to The Unknown Gathering Grounds
        </button>
      </div>

    </div>
  );
}
