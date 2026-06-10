/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Skull, Check } from 'lucide-react';
import { TicketTier, LanguageCode } from '../types';
import { TICKET_TIERS, TRANSLATIONS } from '../data';

// Early Bat (early-bird) pricing runs through the end of August 31, 2026.
const EARLY_BIRD_DEADLINE = new Date('2026-08-31T23:59:59');

interface TicketTiersProps {
  currentLanguage: LanguageCode;
  onSelectTier: (tier: TicketTier) => void;
  selectedTierId?: string;
}

export default function TicketTiers({
  currentLanguage,
  onSelectTier,
  selectedTierId
}: TicketTiersProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  // Live countdown to the Early Bat pricing deadline (Aug 31, 2026).
  const calcTimeLeft = () => {
    const diff = EARLY_BIRD_DEADLINE.getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="ticketing-matrix" className="py-8 text-center">
      {/* Immersive Early Bird Ticking Banner */}
      <div className="max-w-4xl mx-auto mb-10 p-5 rounded bg-gradient-to-r from-red-950/20 via-black to-red-950/20 border-y border-red-900/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/5 blur-[80px] pointer-events-none"></div>

        <div className="text-left">
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs tracking-wider uppercase">
            <Skull className="h-4 w-4 animate-bounce" />
            <span>{t.earlyBirdCountdown || 'Early-bird Spectre passes are vanishing.'}</span>
          </div>
          <h4 className="font-mono text-xl text-[#ffffff] uppercase tracking-wide mt-1 font-semibold">
            {currentLanguage === 'spooky' ? '⏱ COUNTDOWN TO THE RETRIBUTION ⏱' : '🔥 LIMITED-TIME DISCOUNT LOCK'}
          </h4>
          <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-1">
            {timeLeft.expired ? 'Early Bat pricing has ended' : 'Early Bat pricing ends August 31, 2026'}
          </p>
        </div>

        {/* Live Timer */}
        <div className="flex items-center space-x-2 font-mono" id="early-bird-timer">
          <div className="bg-red-950/30 border border-red-950 px-2.5 py-1.5 rounded text-center min-w-[50px] shadow">
            <span className="block text-lg font-bold text-red-500">{timeLeft.days}</span>
            <span className="text-[8px] text-[#8e8e93] uppercase">Days</span>
          </div>
          <span className="text-red-500 font-bold">:</span>
          <div className="bg-red-950/30 border border-red-950 px-2.5 py-1.5 rounded text-center min-w-[50px] shadow">
            <span className="block text-lg font-bold text-red-500">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[8px] text-[#8e8e93] uppercase">Hrs</span>
          </div>
          <span className="text-red-500 font-bold">:</span>
          <div className="bg-red-950/30 border border-red-950 px-2.5 py-1.5 rounded text-center min-w-[50px] shadow">
            <span className="block text-lg font-bold text-red-500">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[8px] text-[#8e8e93] uppercase">Mins</span>
          </div>
          <span className="text-red-500 font-bold">:</span>
          <div className="bg-red-950/30 border border-red-950 px-2.5 py-1.5 rounded text-center min-w-[50px] shadow">
            <span className="block text-lg font-bold text-red-600 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[8px] text-[#8e8e93] uppercase">Secs</span>
          </div>
        </div>
      </div>

      {/* Grid structure of cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {TICKET_TIERS.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          const isLowStock = tier.remainingStock < 25;

          return (
            <motion.div
              key={tier.id}
              id={`ticket-card-${tier.id}`}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
              }}
              whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
              className={`rounded-lg border text-left p-6 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden bg-zinc-950/40 backdrop-blur-sm shadow-xl ${
                isSelected
                  ? 'border-red-600 bg-red-950/5 shadow-red-950/10 ring-1 ring-red-500/20'
                  : 'border-yellow-950/10 hover:border-red-950/60 hover:bg-[#07070a]/60'
              }`}
            >
              {/* Early Bird Badge */}
              {tier.isEarlyBird && (
                <span className="absolute top-3 right-3 bg-red-900/60 text-red-400 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded tracking-widest border border-red-800">
                  ⚡ EARLY SEALS
                </span>
              )}

              {/* Top-tier Collector Badge */}
              {tier.id === 'collector' && (
                <span className="absolute top-3 right-3 bg-orange-950/60 text-orange-400 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded tracking-widest border border-orange-800">
                  🔥 SUPREME COVEN
                </span>
              )}

              {/* Card Meta */}
              <div>
                <h4 className="font-mono text-base font-semibold text-[#f5f5f7] tracking-wider uppercase mb-1 flex items-center justify-between">
                  {tier.name}
                </h4>
                <p className="text-xs text-gray-400 min-h-[48px] leading-relaxed mb-4">
                  {tier.description}
                </p>

                {/* Pricing Block */}
                <div className="mb-4">
                  <span className="text-[10px] text-gray-500 font-mono line-through mr-1.5">
                    ${tier.originalPrice} USD
                  </span>
                  <span className="text-3xl font-mono text-red-500 font-bold">
                    ${tier.currentPrice}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono uppercase ml-1.5">
                    / Soul
                  </span>
                </div>

                {/* Stock Warning Meter */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase mb-1">
                    <span>Availability</span>
                    <span className={isLowStock ? 'text-orange-500 font-bold' : ''}>
                      {tier.remainingStock} remnant passes left
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isLowStock ? 'bg-orange-600 animate-pulse' : 'bg-red-950'
                      }`}
                      style={{ width: `${(tier.remainingStock / tier.totalStock) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Perks Checklist */}
                <ul className="space-y-2 mb-6">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start text-xs text-gray-300">
                      <Check className="h-4 w-4 mr-2 text-red-700 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Select */}
              <button
                id={`btn-select-tier-${tier.id}`}
                onClick={() => onSelectTier(tier)}
                className={`w-full py-2.5 rounded font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-red-700 text-white hover:bg-red-600'
                    : 'bg-zinc-900 text-gray-300 border border-gray-800 hover:border-red-950 hover:bg-black hover:text-white'
                }`}
              >
                {isSelected 
                  ? (currentLanguage === 'spooky' ? '✓ SHACKLED TO REGISTER' : '✓ SELECTED FOR INITIATION') 
                  : (currentLanguage === 'spooky' ? 'SACRIFICE PASS' : 'SELECT PASS')}
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
