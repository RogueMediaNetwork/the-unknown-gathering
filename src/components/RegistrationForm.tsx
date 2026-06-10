/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreditCard, Lock, Mail, User, Phone, RefreshCw, Key } from 'lucide-react';
import { TicketTier, Attendee, LanguageCode, AuditLog } from '../types';
import { TRANSLATIONS } from '../data';

interface RegistrationFormProps {
  selectedTier: TicketTier;
  currentLanguage: LanguageCode;
  onSuccess: (attendee: Attendee, firstMfaCode: string, trackingLog: AuditLog) => void;
}

export default function RegistrationForm({
  selectedTier,
  currentLanguage,
  onSuccess
}: RegistrationFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gdprChecked, setGdprChecked] = useState(false);
  const [mfaChecked, setMfaChecked] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic automatic whitespace formatting
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const matches = val.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(val);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      setExpiry(val.slice(0, 2) + '/' + val.slice(2));
    } else {
      setExpiry(val);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('All mortal coordinates are required. Please complete Name, Email and Phone.');
      return;
    }

    if (!gdprChecked) {
      setErrorMsg('You must check and agree to standard CCPA & GDPR encrypted data vaults.');
      return;
    }

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      setErrorMsg('Payment credentials rejected. Please specify a valid 15-16 credit card digit.');
      return;
    }

    if (!expiry || !expiry.includes('/') || expiry.length < 5) {
      setErrorMsg('Payment credentials rejected. Invalid card expiry (MM/YY format required).');
      return;
    }

    if (!cvv || cvv.length < 3) {
      setErrorMsg('Payment credentials rejected. Invalid CVV/CVC security lock.');
      return;
    }

    setLoading(true);

    // Simulate cryptographic standard delay and card gateway checkout
    setTimeout(() => {
      setLoading(false);

      const uniqueId = 'SOUL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const code = 'QR-' + Math.random().toString(36).substr(2, 6).toUpperCase() + '-' + selectedTier.id.toUpperCase();

      const newAttendee: Attendee = {
        id: uniqueId,
        fullName,
        email,
        phone,
        ticketTierId: selectedTier.id,
        ticketCode: code,
        languageSelected: currentLanguage,
        registrationDate: new Date().toISOString(),
        isCheckedIn: false,
        mfaEnabled: mfaChecked,
        consentSigned: gdprChecked
      };

      // Generate a dynamic code string
      const randomMfa = Math.floor(100000 + Math.random() * 900000).toString();

      const trackingLog: AuditLog = {
        id: 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        timestamp: new Date().toISOString(),
        actor: email,
        action: 'ATTENDEE_REGISTERED',
        status: mfaChecked ? 'SUCCESS' : 'WARNING',
        ipAddress: '192.168.1.' + Math.floor(2 + Math.random() * 253),
        details: `Registered client for ${selectedTier.name}. MFA setup: ${mfaChecked ? 'Active' : 'Missing'}. AES-256 standard encrypted block saved.`
      };

      onSuccess(newAttendee, randomMfa, trackingLog);
    }, 1600);
  };

  return (
    <div id="registration-gateway" className="max-w-2xl mx-auto rounded-lg bg-zinc-950/80 border border-red-950/50 shadow-2xl p-6 relative overflow-hidden">
      
      {/* Visual Ambient Shield Accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/5 blur-[50px] pointer-events-none rounded-full"></div>

      <div className="border-b border-red-950/40 pb-4 mb-6 flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest block mb-0.5">
            ⚔️ CCPA & GDPR STANDARD SECURITY ACTIVES
          </span>
          <h2 className="font-mono text-lg font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="h-4 w-4 text-red-600 animate-pulse" />
            {t.checkoutTitle || 'SECURE DARK GATEWAY CHECKOUT'}
          </h2>
        </div>
        <div className="text-right font-mono">
          <span className="block text-xs uppercase text-zinc-500">Tier Total</span>
          <span className="text-lg font-bold text-red-500">${selectedTier.currentPrice}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Error message */}
        {errorMsg && (
          <div id="payload-error-gate" className="p-3 bg-red-950/30 border border-red-900/60 rounded text-red-400 font-mono text-xs flex gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Selected Tier Brief */}
        <div className="p-3.5 bg-black rounded border border-gray-900 text-xs text-gray-300 md:flex items-center justify-between gap-4">
          <div>
            <span className="text-zinc-500 font-mono uppercase block text-[9px]">Slaying Pass Selected</span>
            <span className="text-white font-semibold uppercase">{selectedTier.name}</span>
          </div>
          <div className="mt-2 md:mt-0 px-2 py-0.5 bg-red-950/40 border border-red-900 text-red-500 font-mono text-[9px] rounded uppercase">
            Incubated Rate Lock
          </div>
        </div>

        {/* Section: Mortal coordinates */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
            Mortal Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              id="reg-input-name"
              type="text"
              required
              placeholder="e.g. Victor Frankenstein"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-black border border-gray-800 focus:border-red-900 focus:ring-1 focus:ring-red-900/40 py-2.5 pl-10 pr-4 rounded text-xs text-[#ffffff] font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Email Coordinates
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                id="reg-input-email"
                type="email"
                required
                placeholder="e.g. shadows@waco.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-gray-800 focus:border-red-900 focus:ring-1 focus:ring-red-900/40 py-2.5 pl-10 pr-4 rounded text-xs text-[#ffffff] font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Flesh Cell Phone Key
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                id="reg-input-phone"
                type="tel"
                required
                placeholder="e.g. (254) 555-0666"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black border border-gray-800 focus:border-red-900 focus:ring-1 focus:ring-red-900/40 py-2.5 pl-10 pr-4 rounded text-xs text-[#ffffff] font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section: Secure payment method gateway */}
        <div className="p-4 bg-gradient-to-b from-[#090b0e] to-black border border-zinc-900 rounded space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
            <span className="flex items-center gap-1">
              <CreditCard className="h-3 w-3 text-red-500" /> Secure Encryption Lock
            </span>
            <span>256-bit TLS Socket</span>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wide text-gray-500 mb-1">
              Credit Card Key Block
            </label>
            <input
              id="card-number-decrypt"
              type="text"
              required
              placeholder="4000 1234 5678 9010"
              value={cardNumber}
              onChange={handleCardChange}
              className="w-full bg-black border border-gray-800 focus:border-red-900 py-2 px-3 rounded text-xs text-white font-mono tracking-widest focus:outline-none placeholder-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wide text-gray-500 mb-1">
                Expiry (MM/YY)
              </label>
              <input
                id="card-expiry-decrypt"
                type="text"
                required
                placeholder="10/28"
                value={expiry}
                onChange={handleExpiryChange}
                className="w-full bg-black border border-gray-800 focus:border-red-900 py-2 px-3 rounded text-xs text-white font-mono tracking-widest focus:outline-none placeholder-zinc-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wide text-gray-500 mb-1 font-semibold">
                Spooky CVV Security Lock
              </label>
              <input
                id="card-cvv-decrypt"
                type="password"
                required
                placeholder="🩸🩸🩸"
                value={cvv}
                onChange={handleCvvChange}
                className="w-full bg-black border border-gray-800 focus:border-red-900 py-2 px-3 rounded text-xs text-white font-mono tracking-widest focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security Options: GDPR Consent & Multi-Factor Auth Toggle */}
        <div className="space-y-2.5 pt-2">
          
          {/* Privacy Protection */}
          <div className="flex items-start bg-black/40 p-3 rounded border border-gray-900 hover:border-zinc-800 transition-colors">
            <input
              id="checkbox-gdpr-consent"
              type="checkbox"
              checked={gdprChecked}
              onChange={(e) => setGdprChecked(e.target.checked)}
              className="mt-0.5 mr-2.5 accent-red-600 border-gray-800 rounded bg-black focus:ring-0 focus:outline-none cursor-pointer"
            />
            <div>
              <label htmlFor="checkbox-gdpr-consent" className="block text-[10.5px] font-mono uppercase leading-tight text-gray-300 cursor-pointer">
                {t.gdprAccept || 'Consent signed to encrypt records'}
              </label>
              <span className="block text-[9px] text-[#71717a] mt-0.5 font-sans leading-normal">
                Strict GDPR (Article 32) & CCPA privacy provisions are executed. Your records are AES-256 salted and stored offline. Double-encrypted vaults shield all attendees.
              </span>
            </div>
          </div>

          {/* MFA Protection */}
          <div className="flex items-start bg-black/40 p-3 rounded border border-gray-900 hover:border-zinc-800 transition-colors">
            <input
              id="checkbox-mfa-security"
              type="checkbox"
              checked={mfaChecked}
              onChange={(e) => setMfaChecked(e.target.checked)}
              className="mt-0.5 mr-2.5 accent-yellow-600 border-gray-800 rounded bg-black focus:ring-0 focus:outline-none cursor-pointer"
            />
            <div>
              <label htmlFor="checkbox-mfa-security" className="block text-[10.5px] font-mono uppercase leading-tight text-yellow-500 cursor-pointer flex items-center gap-1 font-bold">
                <Key className="h-3 w-3 text-yellow-500 animate-pulse" /> Bolster Profile with Multi-Factor Authentication
              </label>
              <span className="block text-[9px] text-[#71717a] mt-0.5 font-sans leading-normal">
                Select this box to tie your attendee profile to standard double-factor auth protocols. Will yield a custom TOTP security seed at registration confirmation.
              </span>
            </div>
          </div>

        </div>

        {/* CTA Execute Registration */}
        <button
          id="btn-execute-souls-seal"
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-950 disabled:text-gray-500 text-white font-mono text-sm uppercase py-3.5 rounded tracking-widest transition-colors font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/20"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>TRANSMITTING COINS & SEALS...</span>
            </>
          ) : (
            currentLanguage === 'spooky' ? '⛧ SEAL BLOOD COVENANT ⛧' : '✓ ENTRUST SOUL & PROCEED'
          )}
        </button>

        <p className="text-[10px] font-mono text-[#52525b] text-center uppercase tracking-wide">
          🛡️ PCI-DSS COMPLIANT INTERACTION • NO ACTUAL SECRETS ARE LOGGED TO CORE SHELLS
        </p>

      </form>
    </div>
  );
}
