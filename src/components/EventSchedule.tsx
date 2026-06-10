/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, CalendarPlus, Skull, Star, Info } from 'lucide-react';
import { EventSession, Speaker, LanguageCode } from '../types';
import { SCHEDULE, SPEAKERS, TRANSLATIONS } from '../data';

interface EventScheduleProps {
  currentLanguage: LanguageCode;
  onSetAlert: (sessionTitle: string, timeSlot: string) => void;
  favorites: string[];
  toggleFavorite: (sessionId: string) => void;
}

export default function EventSchedule({
  currentLanguage,
  onSetAlert,
  favorites,
  toggleFavorite
}: EventScheduleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  // Categories Map
  const categories = [
    { code: 'all', name: t.allCategories || 'All Tracks' },
    { code: 'ufos', name: t.categoryUfos || 'UFOs & Cryptids' },
    { code: 'forensics', name: t.categoryForensics || 'Forensics' },
    { code: 'paranormal', name: t.categoryParanormal || 'Paranormal' },
    { code: 'true_crime', name: t.categoryTrueCrime || 'True Crime' },
    { code: 'interactive', name: t.categoryInteractive || 'Interactive' }
  ];

  const getSpeakerObjects = (session: EventSession): Speaker[] => {
    return SPEAKERS.filter(s => session.speakerIds.includes(s.id));
  };

  const filteredSessions = SCHEDULE.filter(session => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getSpeakerObjects(session).some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="chrono-schedule-panel" className="max-w-7xl mx-auto px-4 py-8 text-left">
      
      {/* Filters and Search Tools */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Full text Query bar */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
          <input
            id="session-search-query"
            type="text"
            placeholder="Translate archives, search speakers or forensic terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060608]/90 border border-zinc-900 focus:border-red-900 focus:ring-1 focus:ring-red-900/40 py-3 pl-11 pr-4 rounded text-xs text-[#f5f5f7] font-mono focus:outline-none"
          />
        </div>

        {/* Category Filter portal */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-gray-500" />
          <select
            id="filter-session-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#060608]/90 border border-zinc-900 focus:border-red-900 focus:ring-1 focus:ring-red-900/40 py-3 pl-11 pr-4 rounded text-xs text-gray-300 font-mono focus:outline-none cursor-pointer appearance-none"
          >
            {categories.map((c) => (
              <option key={c.code} value={c.code} className="bg-black text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Schedule Timeline Cards Grid */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center p-12 border border-[#14151b] rounded-lg bg-black/40">
            <Skull className="h-10 w-10 text-zinc-900 mx-auto mb-4" />
            <p className="font-mono text-sm text-gray-500 uppercase tracking-widest">
              No sorcery matches your search query. Try another term.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const sessionsSpeakers = getSpeakerObjects(session);
            const isFav = favorites.includes(session.id);

            // Category thematic classes
            let badgeStyle = 'text-red-400 bg-red-950/20 border-red-900/30';
            if (session.category === 'ufos') badgeStyle = 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30';
            if (session.category === 'forensics') badgeStyle = 'text-blue-400 bg-blue-950/20 border-blue-900/30';
            if (session.category === 'paranormal') badgeStyle = 'text-purple-400 bg-purple-950/20 border-purple-900/30';
            if (session.category === 'interactive') badgeStyle = 'text-yellow-400 bg-yellow-950/20 border-yellow-900/30';

            return (
              <div
                key={session.id}
                id={`session-card-${session.id}`}
                className="rounded-lg border border-zinc-900 bg-[#07070a]/40 backdrop-blur-sm p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-red-950/40 hover:bg-[#07070a]/80 transition-all duration-300"
              >
                {/* Day / Time slot marker */}
                <div className="md:w-44 shrink-0 font-mono text-left space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Time coordinate</span>
                  <span className="text-sm font-semibold text-red-500 block">{session.timeSlot}</span>
                  <span className="text-xs text-gray-400 block">{session.location}</span>
                </div>

                {/* Session Description */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${badgeStyle} tracking-widest`}>
                      {session.category}
                    </span>
                    <span className="text-zinc-600 text-xs font-mono">• Capacity: {session.capacity} slots</span>
                  </div>

                  <h4 className="font-mono text-base font-semibold text-white uppercase tracking-wide">
                    {session.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
                    {session.description}
                  </p>

                  {/* Speaker Avatars Row */}
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {sessionsSpeakers.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSpeaker(s)}
                        className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 hover:bg-red-950/20 border border-gray-900/85 hover:border-red-900/50 transition-all text-xs font-mono text-gray-300 cursor-pointer"
                        title="Click to view speaker credentials"
                      >
                        <img
                          src={s.image}
                          alt={s.name}
                          className="h-5 w-5 rounded-full object-cover shrink-0 border border-red-950"
                          referrerPolicy="no-referrer"
                        />
                        <span className="hover:text-red-500">{s.name}</span>
                        <Info className="h-3 w-3 text-gray-500 inline" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions: Favoriting & Reminder Alerter */}
                <div className="flex items-center space-x-2 shrink-0 md:self-center">
                  
                  {/* Favourite / Star Toggle */}
                  <button
                    id={`btn-fav-session-${session.id}`}
                    onClick={() => toggleFavorite(session.id)}
                    className={`p-2.5 rounded border transition-colors cursor-pointer ${
                      isFav 
                        ? 'bg-amber-950/20 text-yellow-500 border-yellow-900/50' 
                        : 'bg-black text-zinc-500 border-zinc-900 hover:text-yellow-500'
                    }`}
                    title={isFav ? "Remove from my ritual schedule" : "Pin to my custom schedule"}
                  >
                    <Star className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Notification set alert */}
                  <button
                    id={`btn-alert-session-${session.id}`}
                    onClick={() => onSetAlert(session.title, session.timeSlot)}
                    className="px-3.5 py-2.5 rounded bg-red-950/30 hover:bg-red-900/40 border border-red-900/40 hover:border-red-600 text-red-500 font-mono text-xs uppercase tracking-wide flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CalendarPlus className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                    <span>{t.timeRemindBtn || 'Set Alert'}</span>
                  </button>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Interactive Speaker Credentials Popover Modal */}
      {selectedSpeaker && (
        <div
          id="speaker-credentials-modal animate-fade-in"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="w-full max-w-lg rounded-lg border border-red-950/50 bg-[#060608]/95 p-6 relative shadow-2xl stage-fade-in">
            
            <button
              id="btn-close-speaker-modal"
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="space-y-4 text-center md:text-left md:flex items-start gap-5">
              <img
                src={selectedSpeaker.image}
                alt={selectedSpeaker.name}
                className="h-24 w-24 mx-auto md:mx-0 object-cover rounded-lg border-2 border-red-950 shrink-0 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-[#ef4444] tracking-widest uppercase block">
                  {selectedSpeaker.isKeynote ? '⛧ KEYNOTE ORACLE ⛧' : 'COVEN CONJURER'}
                </span>
                <h3 className="font-mono text-xl text-white uppercase tracking-wide font-bold">
                  {selectedSpeaker.name}
                </h3>
                <p className="font-mono text-xs text-yellow-500">
                  {selectedSpeaker.role}
                </p>
                <div className="py-2.5 border-t border-red-950/40 mt-2">
                  <p className="text-xs text-gray-300 leading-relaxed font-sans text-justify">
                    {selectedSpeaker.bio}
                  </p>
                </div>
                <div className="p-2.5 rounded bg-black border border-gray-950 mt-2 text-left">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase block mb-0.5">Focus Lecture:</span>
                  <span className="font-mono text-xs text-red-500 font-semibold uppercase block leading-snug">
                    {selectedSpeaker.topic}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-900 text-center">
              <button
                id="btn-close-speaker-credentials"
                onClick={() => setSelectedSpeaker(null)}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-gray-300 border border-gray-800 rounded font-mono text-xs uppercase cursor-pointer"
              >
                Retreat to Shadows
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
