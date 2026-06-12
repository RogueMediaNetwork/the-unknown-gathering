/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Globe, Ghost, Volume2, VolumeX, Menu, X, Bell } from 'lucide-react';
import { LanguageCode } from '../types';

interface NavigationProps {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notificationCount: number;
  toggleNotifications: () => void;
}

export default function Navigation({
  currentLanguage,
  setLanguage,
  activeTab,
  setActiveTab,
  notificationCount,
  toggleNotifications
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Fully tear down every audio node and the context itself so nothing
  // keeps running after the synth is toggled off or the component unmounts.
  const stopAudio = () => {
    for (const ref of [oscRef, lfoRef]) {
      if (ref.current) {
        try { ref.current.stop(); } catch (e) { /* already stopped */ }
        try { ref.current.disconnect(); } catch (e) { /* not connected */ }
        ref.current = null;
      }
    }
    filterRef.current = null;
    gainRef.current = null;
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) { /* already closed */ }
      audioCtxRef.current = null;
    }
  };

  // Handle ambient spooky synth
  const toggleSpookySound = () => {
    if (audioActive) {
      stopAudio();
      setAudioActive(false);
    } else {
      try {
        // Create audio context
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Low heavy hum osc
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(45, ctx.currentTime); // Hum at 45Hz

        // Lowpass filter for dark drone sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, ctx.currentTime);

        // Slow LFO for creepy swell effect
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // 5 seconds cycle

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(30, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime); // Safe, low volume whisper

        // Connect LFO to control filter frequency
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        // Core line
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Start
        osc.start();
        lfo.start();

        oscRef.current = osc;
        lfoRef.current = lfo;
        filterRef.current = filter;
        gainRef.current = gainNode;
        setAudioActive(true);
      } catch (err) {
        console.warn('Audio generation unsupported or blocked by user guest gestures', err);
        stopAudio();
      }
    }
  };

  // Ensure the synth is torn down if the user navigates away with it playing.
  useEffect(() => {
    return () => stopAudio();
  }, []);

  const tongues = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'spooky', name: '⛧ GOTHIC ⛧' }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav id="nav-header" className="sticky top-0 z-50 bg-[#060608]/90 border-b border-red-950/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700"></span>
            </span>
            <Ghost className="h-6 w-6 text-red-600 animate-pulse" />
            <span className="font-mono text-sm tracking-wider font-semibold text-white uppercase sm:block hidden hover:text-red-500 transition-colors">
              UNKNOWN 2026
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 items-center">
            <button
              id="nav-tab-home"
              onClick={() => handleTabClick('home')}
              className={`px-3 py-2 rounded-md text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'home' 
                  ? 'bg-red-950/40 text-red-500 border border-red-900/50' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
              }`}
            >
              🧙 Ritual Grounds
            </button>
            <button
              id="nav-tab-schedule"
              onClick={() => handleTabClick('schedule')}
              className={`px-3 py-2 rounded-md text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'schedule' 
                  ? 'bg-red-950/40 text-red-500 border border-red-900/50' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
              }`}
            >
              📆 Chrono Seals
            </button>
            <button
              id="nav-tab-checkin"
              onClick={() => handleTabClick('checkin')}
              className={`px-3 py-2 rounded-md text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'checkin' 
                  ? 'bg-red-950/40 text-red-500 border border-red-900/50' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
              }`}
            >
              👁 Soul Ticket Check-In
            </button>
            <button
              id="nav-tab-organizer"
              onClick={() => handleTabClick('organizer')}
              className={`px-3 py-2 rounded-md text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'organizer' 
                  ? 'bg-red-950/40 text-red-500 border border-red-900/50 hover:bg-red-950/60' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
              }`}
            >
              🎛 Necromancer Core
            </button>
            <a
              id="nav-link-horrify"
              href="/horrify.html"
              title="HORRIFY: A Film Speed Run — films screened at The Unknown Gathering"
              className="px-3 py-2 rounded-md text-xs font-mono tracking-wider uppercase transition-all duration-300 text-red-400 border border-red-900/40 hover:text-white hover:bg-red-900/40"
            >
              🎬 Horrify Film Run
            </a>
          </div>

          {/* Actions & Accessibility Panel */}
          <div className="flex items-center space-x-2">
            
            {/* Ambient Synth Controller */}
            <button
              id="btn-screaming-synth"
              onClick={toggleSpookySound}
              title="Spooky Atmos Synthesizer (Ambient Hum)"
              className={`p-2 rounded-full border transition-all duration-300 ${
                audioActive
                  ? 'bg-red-950/50 text-red-500 border-red-900 animate-pulse'
                  : 'bg-black text-gray-500 border-gray-800 hover:text-red-400 hover:border-red-900'
              }`}
            >
              {audioActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Persistent Notifications Toggle */}
            <button
              id="nav-notifications-toggle"
              onClick={toggleNotifications}
              className="relative p-2 rounded-full bg-black border border-gray-800 text-gray-400 hover:text-red-500 hover:border-red-950/60 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-mono font-bold text-white leading-none">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Language Selection Portal */}
            <div className="relative flex items-center bg-black rounded-md border border-gray-800 px-2 py-1">
              <Globe className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
              <select
                id="select-language-portal"
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-gray-300 text-xs font-mono focus:outline-none border-none py-0.5 pr-2 cursor-pointer"
              >
                {tongues.map((tng) => (
                  <option key={tng.code} value={tng.code} className="bg-black text-white">
                    {tng.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md bg-black border border-gray-800 text-gray-400 hover:text-red-500 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-gradient-to-b from-[#060608] to-black border-b border-red-950/50 py-3 px-4 space-y-2">
          <button
            onClick={() => handleTabClick('home')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-mono uppercase ${
              activeTab === 'home' ? 'bg-red-950/50 text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            🧙 Ritual Grounds
          </button>
          <button
            onClick={() => handleTabClick('schedule')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-mono uppercase ${
              activeTab === 'schedule' ? 'bg-red-950/50 text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            📆 Chrono Seals
          </button>
          <button
            onClick={() => handleTabClick('checkin')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-mono uppercase ${
              activeTab === 'checkin' ? 'bg-red-950/50 text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            👁 Ticket Check-In
          </button>
          <button
            onClick={() => handleTabClick('organizer')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-mono uppercase ${
              activeTab === 'organizer' ? 'bg-red-950/40 text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            🎛 Organizer Engine
          </button>
          <a
            href="/horrify.html"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-mono uppercase text-red-400 border border-red-900/40 hover:text-white hover:bg-red-900/40"
          >
            🎬 Horrify Film Run
          </a>
        </div>
      )}
    </nav>
  );
}
