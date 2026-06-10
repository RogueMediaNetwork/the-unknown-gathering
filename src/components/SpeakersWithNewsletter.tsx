/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Skull, CheckCircle2, ChevronRight } from 'lucide-react';
import { Speaker, LanguageCode, AuditLog } from '../types';
import { SPEAKERS, TRANSLATIONS } from '../data';

interface SpeakersWithNewsletterProps {
  currentLanguage: LanguageCode;
  onSubscribeNewsletter: (email: string, logItem: AuditLog) => void;
}

export default function SpeakersWithNewsletter({
  currentLanguage,
  onSubscribeNewsletter
}: SpeakersWithNewsletterProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    const logItem: AuditLog = {
      id: 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: new Date().toISOString(),
      actor: email,
      action: 'NEWSLETTER_SUBSCRIBE',
      status: 'SUCCESS',
      ipAddress: '192.168.1.' + Math.floor(10 + Math.random() * 240),
      details: `Newsletter subscription committed. Enrolled address for secret updates. Standard CCPA GDPR privacy keys linked.`
    };

    onSubscribeNewsletter(email, logItem);
    setSuccess(true);
    setEmail('');

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  return (
    <div id="speakers-newsletter-section" className="py-12 max-w-7xl mx-auto px-4 space-y-16 text-left">
      
      {/* Featured Speakers Layout */}
      <div>
        <div className="text-center md:text-left space-y-2 mb-10 border-b border-red-950/40 pb-4">
          <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest block">
            {currentLanguage === 'spooky' ? '★ APPARITIONAL DISCOURSES ★' : '★ THE SHADOW CONJURERS ★'}
          </span>
          <h2 className="font-mono text-2xl font-bold uppercase tracking-wider text-white">
            {t.speakersHeader || 'Featured Speakers of the Arcane'}
          </h2>
          <p className="text-xs text-gray-400">
            Meet the foremost forensic pathologists, demonologists, and cold case authors gathering in Waco, Texas.
          </p>
        </div>

        {/* Dynamic Grid of Speakers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPEAKERS.map((s) => (
            <div
              key={s.id}
              id={`speaker-card-${s.id}`}
              onClick={() => setSelectedSpeaker(s)}
              className="group hover:scale-[1.01] transition-transform duration-300 rounded-lg border border-zinc-950 bg-black/40 overflow-hidden cursor-pointer hover:border-red-950 flex flex-col justify-between"
            >
              {/* Photo section */}
              <div className="relative aspect-square w-full bg-zinc-900 border-b border-zinc-950 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {s.isKeynote && (
                  <span className="absolute bottom-3 left-3 bg-[#7f1d1d]/80 text-[#fecaca] font-mono text-[9px] uppercase px-1.5 py-0.5 rounded tracking-widest border border-red-800 backdrop-blur-sm">
                    ☠ Keynote Presentation
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Speaker metadata */}
              <div className="p-4 space-y-1">
                <h4 className="font-mono text-sm tracking-wide font-bold text-white uppercase group-hover:text-red-500 transition-colors">
                  {s.name}
                </h4>
                <p className="font-mono text-[#eab308] text-[10px] uppercase font-medium">
                  {s.role}
                </p>
                <p className="text-zinc-500 text-[11px] leading-relaxed pt-1 line-clamp-2">
                  {s.bio}
                </p>
              </div>

              {/* View credential trigger */}
              <div className="px-4 py-2 bg-gradient-to-r from-red-950/10 to-transparent border-t border-[#0e0e12] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>VIEW PROFILE ARCHIVES</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spooky Coven Newsletter Form */}
      <div className="p-6 md:p-10 rounded-xl bg-gradient-to-b from-[#090b10] to-[#040407] border border-red-950/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Absolute design accents */}
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-red-600/5 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="flex-1 space-y-3 max-w-xl text-left">
          <div className="flex items-center space-x-1.5 text-red-500 font-mono text-[10px] tracking-wider uppercase font-extrabold animate-pulse">
            <Skull className="h-3.5 w-3.5" />
            <span>{currentLanguage === 'spooky' ? '⛧ INSCRIBE THE CHARTER ⛧' : 'GDPR COMPLIANT ALERTS LAYER'}</span>
          </div>
          <h3 className="font-mono text-xl md:text-2xl font-bold uppercase tracking-wider text-white">
            {t.newsletterTitle || 'Join the Secret Society Newsletter'}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            {t.newsletterSub || 'Receive classified event alerts, speaker briefings, and secret access codes.'}
          </p>
        </div>

        {/* Subscription Engine Form */}
        <div className="w-full md:w-auto min-w-[300px] shrink-0 font-mono relative">
          {success ? (
            <div id="newsletter-success-box" className="p-4 rounded border border-red-950 bg-red-950/10 text-red-400 text-xs flex items-center gap-2.5 animate-pulse max-w-sm whitespace-normal">
              <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0" />
              <p className="leading-snug">
                {t.successNewsletter || 'Your soul is inscribed. Keep a watch on your inbox at night...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  id="newsletter-email-input"
                  type="email"
                  placeholder={t.newsletterEmail || 'Enter your email address...'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full md:w-80 bg-[#060608] border border-zinc-900 focus:border-red-900 py-3.5 pl-11 pr-4 rounded text-xs text-white placeholder-zinc-700 focus:outline-none"
                  required
                />
              </div>
              <button
                id="btn-subscribe-newsletter"
                type="submit"
                className="w-full py-2.5 rounded bg-red-700 hover:bg-red-600 text-white font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors shadow-lg shadow-red-950/30"
              >
                {t.newsletterBtn || 'Subscribe to Shadows'}
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Interactive pop-up speaker credentials details modal */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-lg border border-red-950/40 bg-[#060608]/95 p-6 relative shadow-2xl text-left">
            
            <button
              id="btn-close-pop-speaker-modal"
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="md:flex items-start gap-5 space-y-4 md:space-y-0">
              <img
                src={selectedSpeaker.image}
                alt={selectedSpeaker.name}
                className="h-28 w-28 mx-auto md:mx-0 object-cover rounded-lg border-2 border-red-950 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-[#ef4444] tracking-widest uppercase block mb-0.5">
                  FEATURED ORACLE CREDENTIALS
                </span>
                <h3 className="font-mono text-lg font-bold text-white uppercase">
                  {selectedSpeaker.name}
                </h3>
                <p className="font-mono text-xs text-yellow-500">
                  {selectedSpeaker.role}
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-2 text-justify">
                  {selectedSpeaker.bio}
                </p>
                <div className="p-3 bg-black border border-gray-950 rounded-md mt-4">
                  <span className="font-mono text-[8.5px] text-[#52525b] uppercase block">Assigned Topic</span>
                  <span className="font-mono text-xs text-[#ef4444] uppercase block leading-snug mt-0.5 font-semibold">
                    {selectedSpeaker.topic}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-zinc-900 text-center">
              <button
                id="btn-dismiss-pop-speaker"
                onClick={() => setSelectedSpeaker(null)}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-gray-400 hover:text-white border border-gray-800 rounded font-mono text-xs uppercase cursor-pointer"
              >
                Close Biography
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
