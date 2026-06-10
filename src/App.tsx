/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, ShieldCheck, MapPin, Calendar, Lock } from 'lucide-react';

import { TicketTier, Attendee, AuditLog, LanguageCode } from './types';
import { TRANSLATIONS } from './data';

import Navigation from './components/Navigation';
import NotificationsPanel from './components/NotificationsPanel';
import TicketTiers from './components/TicketTiers';
import RegistrationForm from './components/RegistrationForm';
import RegistrationReceipt from './components/RegistrationReceipt';
import EventSchedule from './components/EventSchedule';
import AttendeeCheckIn from './components/AttendeeCheckIn';
import OrganizerDashboard from './components/OrganizerDashboard';
import SpeakersWithNewsletter from './components/SpeakersWithNewsletter';

const PRE_SEEDED_ATTENDEES: Attendee[] = [
  {
    id: "SOUL-48201",
    fullName: "Sarah Black Patterson",
    email: "sarah.p@whisperingghosts.com",
    phone: "(254) 555-0103",
    ticketTierId: "collector",
    ticketCode: "QR-X92F",
    languageSelected: "en",
    registrationDate: "2026-05-24T12:30:19.482Z",
    isCheckedIn: true,
    mfaEnabled: true,
    consentSigned: true
  },
  {
    id: "SOUL-99023",
    fullName: "Detective John Miller",
    email: "miller.j@wacopolice.gov",
    phone: "(254) 555-0911",
    ticketTierId: "standard",
    ticketCode: "QR-Y11B",
    languageSelected: "en",
    registrationDate: "2026-05-25T15:10:04.291Z",
    isCheckedIn: false,
    mfaEnabled: false,
    consentSigned: true
  },
  {
    id: "SOUL-11928",
    fullName: "Marta Gaviria",
    email: "marta.g@ocultos.es",
    phone: "+34 611 292 101",
    ticketTierId: "early_bird",
    ticketCode: "QR-C28D",
    languageSelected: "es",
    registrationDate: "2026-05-26T09:44:22.103Z",
    isCheckedIn: true,
    mfaEnabled: false,
    consentSigned: true
  },
  {
    id: "SOUL-Elite9",
    fullName: "Mike Rogue",
    email: "mike@roguemedianetwork.com",
    phone: "(254) 555-0666",
    ticketTierId: "collector",
    ticketCode: "QR-Z666",
    languageSelected: "spooky",
    registrationDate: "2026-05-28T18:00:00.000Z",
    isCheckedIn: false,
    mfaEnabled: true,
    consentSigned: true
  }
];

const PRE_SEEDED_AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-1",
    timestamp: "2026-05-28T19:50:11.102Z",
    actor: "COVEN_SECURE_GUARD",
    action: "DATABASE_HYDRATED",
    status: "SUCCESS",
    ipAddress: "127.0.0.1",
    details: "Automated salted registers initialized. GDPR compliant AES-256 standard cryptographic containers active."
  },
  {
    id: "LOG-2",
    timestamp: "2026-05-28T19:53:22.492Z",
    actor: "sarah.p@whisperingghosts.com",
    action: "ATTENDEE_REGISTERED",
    status: "SUCCESS",
    ipAddress: "192.168.1.101",
    details: "Completed standard checkout for VIP experience. CCPA provisions authorized in full."
  },
  {
    id: "LOG-3",
    timestamp: "2026-05-28T19:56:00.000Z",
    actor: "GATEWAY_SENTRY_SOUTH",
    action: "ATTENDEE_CHECK_IN",
    status: "SUCCESS",
    ipAddress: "192.168.1.99",
    details: "Checked-in Sarah Black Patterson manually. Authorized badge print successfully locked."
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "🦴 AUTO PANEL ALERT",
    message: "Advanced Forensic Skeletal Panel is nearing full capacity. Pre-register coordinates now.",
    time: "2 mins ago",
    type: "reminder" as const,
    isRead: false
  },
  {
    id: "notif-2",
    title: "🛡️ COVEN RECORD LOCKED",
    message: "CCPA & GDPR cryptographic safeguards validated. Standard AES-256 local profiles sealed.",
    time: "10 mins ago",
    type: "security" as const,
    isRead: false
  },
  {
    id: "notif-3",
    title: "⚠️ SPECTRAL ADVISORY",
    message: "Waco downtown weather looks misty. Atmospheric density is optimal for ghost hunt sensors.",
    time: "35 mins ago",
    type: "general" as const,
    isRead: true
  }
];

// --- Safe localStorage helpers ---------------------------------------------
// localStorage can throw (private mode / disabled cookies) and stored JSON can
// be corrupt or from an older app version. These wrappers fall back to defaults
// instead of letting an exception white-screen the whole app on mount.
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage full or unavailable — non-fatal, just don't persist */
  }
};

function loadJSON<T>(key: string, fallback: T): T {
  const raw = safeGetItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
// ---------------------------------------------------------------------------

export default function App() {
  // Localization state
  const [currentLanguage, setLanguage] = useState<LanguageCode>(() => {
    return (safeGetItem('conv_lang') as LanguageCode) || 'en';
  });

  useEffect(() => {
    safeSetItem('conv_lang', currentLanguage);
  }, [currentLanguage]);

  // Tab State
  const [activeTab, setActiveTab] = useState<string>('home');

  // Bookmarked Favorites
  const [favorites, setFavorites] = useState<string[]>(() => loadJSON('conv_favs', [] as string[]));

  useEffect(() => {
    safeSetItem('conv_favs', JSON.stringify(favorites));
  }, [favorites]);

  // Database Seeded lists
  const [attendees, setAttendees] = useState<Attendee[]>(() => loadJSON('conv_attendees', PRE_SEEDED_ATTENDEES));

  useEffect(() => {
    safeSetItem('conv_attendees', JSON.stringify(attendees));
  }, [attendees]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadJSON('conv_audit_logs', PRE_SEEDED_AUDIT_LOGS));

  useEffect(() => {
    safeSetItem('conv_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Notifications
  const [notifications, setNotifications] = useState(() => loadJSON('conv_notifications', INITIAL_NOTIFICATIONS));

  useEffect(() => {
    safeSetItem('conv_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Overlay Panels
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [successReg, setSuccessReg] = useState<{ attendee: Attendee; mfaCode: string } | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  // Toggle bookmarked event sessions
  const toggleFavorite = (sessionId: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(sessionId);
      if (isFav) {
        return prev.filter(id => id !== sessionId);
      } else {
        return [...prev, sessionId];
      }
    });
  };

  // Add Alert to persistent notification logs
  const handleSetAlert = (sessionTitle: string, timeSlot: string) => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      title: '⏰ HEX ALARM ENGAGED',
      message: `Spell alert bound to: "${sessionTitle}" scheduled at ${timeSlot}. Ethereal sirens will trigger!`,
      time: 'Just now',
      type: 'reminder' as const,
      isRead: false
    };

    setNotifications((prev: any) => [newNotif, ...prev]);
    setNotificationsOpen(true);

    // Save to audit logs
    const actionLog: AuditLog = {
      id: 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: new Date().toISOString(),
      actor: 'GUEST_ATTENDEE',
      action: 'NOTIFICATION_ALARM_SET',
      status: 'SUCCESS',
      ipAddress: '127.0.0.1',
      details: `User set a reminder alarm for session: "${sessionTitle}". Automated push protocol queued.`
    };
    setAuditLogs(prev => [actionLog, ...prev]);
  };

  // Handle successful registration checkout flow
  const handleRegistrationSuccess = (newAttendee: Attendee, firstMfaCode: string, trackingLog: AuditLog) => {
    setAttendees(prev => [newAttendee, ...prev]);
    setAuditLogs(prev => [trackingLog, ...prev]);
    setSuccessReg({ attendee: newAttendee, mfaCode: firstMfaCode });

    // Automated Notification addition 
    const checkoutNotif = {
      id: 'notif-reg-' + Date.now(),
      title: '🛡️ REGISTRANT COMMITTED',
      message: `Mortal ${newAttendee.fullName} locked pass [${selectedTier?.name || 'Spectre Pass'}]. Access token issued.`,
      time: 'Just now',
      type: 'general' as const,
      isRead: false
    };
    setNotifications((prev: any) => [checkoutNotif, ...prev]);
  };

  // CheckIn scan success callback
  const handleCheckInSuccess = (ticketCode: string, trackingLog: AuditLog) => {
    setAttendees(prev => {
      return prev.map(a => {
        if (a.ticketCode.toUpperCase() === ticketCode.toUpperCase()) {
          return { ...a, isCheckedIn: true };
        }
        return a;
      });
    });
    setAuditLogs(prev => [trackingLog, ...prev]);

    const target = attendees.find(a => a.ticketCode.toUpperCase() === ticketCode.toUpperCase());
    const notifyItem = {
      id: 'notif-scan-' + Date.now(),
      title: '👁️ CHECK-IN CONFIRMED',
      message: `Seeker checked-in: "${target?.fullName || 'Guest'}" scanned at Waco Gathering Dome Entrance A.`,
      time: 'Just now',
      type: 'critical' as const,
      isRead: false
    };
    setNotifications((prev: any) => [notifyItem, ...prev]);
  };

  // Trigger cyber alarm / threat detector on organizer panel
  const handleTriggerMockAlert = (actor: string, action: string, details: string) => {
    const alertId = 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newLog: AuditLog = {
      id: alertId,
      timestamp: new Date().toISOString(),
      actor,
      action,
      status: 'ALERT',
      ipAddress: '99.231.' + Math.floor(2 + Math.random() * 253) + '.19',
      details
    };

    setAuditLogs(prev => [newLog, ...prev]);

    // Push automated critical warning in notification panel
    const threatNotif = {
      id: 'notif-[#3ff]' + Date.now(),
      title: '🚨 SECURITY SYSTEM INTRUSION',
      message: details,
      time: 'Just now',
      type: 'critical' as const,
      isRead: false
    };
    setNotifications((prev: any) => [threatNotif, ...prev]);
    setNotificationsOpen(true);
  };

  // Reset database values back to seeds
  const handleClearDatabase = () => {
    setAttendees(PRE_SEEDED_ATTENDEES);
    setAuditLogs(PRE_SEEDED_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSuccessReg(null);
    setSelectedTier(null);

    const log: AuditLog = {
      id: 'LOG-RESET-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: 'ADMIN_SUPERUSER',
      action: 'DATABASE_ERASED',
      status: 'WARNING',
      ipAddress: '127.0.0.1',
      details: 'Super administrator executed complete database scrub. Seeding default profiles and logs.'
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Newsletter enrollment handler
  const handleSubscribeNewsletter = (email: string, logItem: AuditLog) => {
    setAuditLogs(prev => [logItem, ...prev]);

    const notif = {
      id: 'notif-news-' + Date.now(),
      title: '📬 COVEN NEWSLETTER JOINED',
      message: `Mortal coordinate "${email}" inscribed successfully to classified updates.`,
      time: 'Just now',
      type: 'general' as const,
      isRead: false
    };
    setNotifications((prev: any) => [notif, ...prev]);
  };

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div id="app-canvas-container" className="bg-[#030304] text-zinc-300 min-h-screen relative overflow-x-hidden font-sans select-none pb-20 selection:bg-red-800 selection:text-white">
      
      {/* Immersive Eerie Dark Atmospheric Grid background styling */}
      <div className="absolute inset-0 bg-[radial-gradient(#1a0505_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

      {/* Primary Navigation bar */}
      <Navigation
        currentLanguage={currentLanguage}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notificationCount={unreadCount}
        toggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
      />

      {/* Side Sliding Notifications Drawer Tray */}
      <AnimatePresence>
        {notificationsOpen && (
          <NotificationsPanel
            notifications={notifications}
            setNotifications={setNotifications}
            onClose={() => setNotificationsOpen(false)}
            isOpen={notificationsOpen}
            currentLanguage={currentLanguage}
          />
        )}
      </AnimatePresence>

      {/* Main Content Layout Engine */}
      <div className="max-w-7xl mx-auto py-6">
        
        {/* TAB 1: RITUAL GROUNDS / HOME */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Split Screen Modern Bento Hero Section */}
            <div className="mx-4 p-6 md:p-10 rounded-2xl border border-red-950/40 bg-zinc-950/40 backdrop-blur-md flex flex-col lg:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
              
              {/* Absolutes graphic glow flares */}
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-800/5 blur-[120px] rounded-full pointer-events-none"></div>

              {/* Left Column: Descriptive gothic headline details */}
              <div className="flex-1 space-y-5 text-left z-10">
                <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                  <Skull className="h-4 w-4 text-red-600 animate-pulse" />
                  {currentLanguage === 'spooky' ? '⛧ INITIATING RITUAL SUMMONS ⛧' : 'OCTOBER 10TH • WACO TEXAS REALM'}
                </span>

                <h1 className="gothic-title text-3xl md:text-5xl font-black text-[#ffffff] uppercase tracking-wide leading-[1.1] text-shadow">
                  {t.title}
                </h1>

                <p className="text-zinc-400 text-xs md:text-sm font-mono uppercase tracking-wider text-red-500 max-w-xl">
                  {t.subtitle}
                </p>

                <p className="typewriter-text text-xs text-[#a0a0ab] tracking-wider leading-relaxed bg-[#0b0c10] p-4 border border-zinc-900 rounded select-all font-mono">
                  VENUE LOCALE: Downtown PACC & Skyline Observatory Dome
                  <br />
                  DOORS UNLOCK: October 10th, 08:30 AM (Central Standard Time)
                  <br />
                  VAULT SAFEGUARD: GDPR Article 32 Standards • Double-Factor Verified
                </p>

                <p className="text-zinc-400 text-sm leading-relaxed max-w-xl font-sans text-justify">
                  Embark on the ultimate gathering of UFO researchers, cryptid hunters, paranormal investigators, true crime analysts, and horror enthusiasts. Explore anomalous aerial sightings, track elusive forest legends, decode forensic cold cases, and reveal cosmic mysteries inside Waco's convention halls.
                </p>

                {/* Primary Anchor Link button */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    id="anchor-secure-ticket-pass"
                    href="#ticketing-anchor"
                    className="px-6 py-3.5 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-lg shadow-red-950/40 cursor-pointer"
                  >
                    {t.registerBtn || 'Secure Your Pass'}
                  </a>
                  <button
                    id="btn-switch-tabs-chrono"
                    onClick={() => setActiveTab('schedule')}
                    className="px-6 py-3.5 rounded bg-zinc-900 hover:bg-black text-gray-300 hover:text-white border border-zinc-800 hover:border-red-950 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer"
                  >
                    🔍 Scout the Chronology
                  </button>
                </div>
              </div>

              {/* Right Column: Original generated spooky art asset card */}
              <div className="w-full lg:w-[420px] shrink-0 z-10">
                <div className="relative p-2 rounded-xl border border-red-950/60 bg-black/80 shadow-2xl shadow-red-950/10 group overflow-hidden">
                  
                  {/* Glowing neon green border hover lines */}
                  <div className="absolute inset-0 border border-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"></div>

                  <img
                    src="/unknown_gathering_hero_1780056577978.png"
                    alt="The Unknown Gathering official cover featuring UFO abduction beam, Bigfoot shadow, and crime scene noir aesthetics"
                    className="w-full aspect-video md:aspect-[4/3] object-cover rounded-lg filter saturate-75 grayscale-[25%] group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Decorative digital overlay coordinates */}
                  <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-black/80 px-2 py-0.5 rounded border border-red-950/50 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                    <span className="font-mono text-[8px] text-[#ef4444] uppercase tracking-widest">SIGHTING RADIUS ALPHA</span>
                  </div>

                  <div className="mt-3 p-2 text-left font-mono">
                    <span className="text-[10px] text-[#71717a] uppercase block tracking-wider">Atmospheric Anomaly Coordinates</span>
                    <span className="text-white text-xs font-semibold uppercase block">Skyline Observatory & Catacombs</span>
                    <span className="text-[9px] text-[#4d4d54] block mt-0.5">LAT 31.5498N | LONG -97.1467W</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Informational Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-4">
              
              <div className="p-5 rounded-xl border border-zinc-950 bg-zinc-950/20 flex gap-4 items-start text-left">
                <div className="p-3 bg-red-950/20 text-[#ef4444] rounded border border-red-900/30">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-mono text-sm text-white uppercase font-bold tracking-wider">Waco Gathering Dome (PACC)</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                    Hosted in the heart of downtown Waco, Texas at the prestigious Waco Gathering Dome and neighboring celestial observation decks.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-zinc-950 bg-zinc-950/20 flex gap-4 items-start text-left">
                <div className="p-3 bg-blue-950/20 text-[#ef4444] rounded border border-blue-900/30">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-mono text-sm text-white uppercase font-bold tracking-wider">October 10th Date</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                    A singular 1-day equinox peak summit. General doors unlock at 8:30 AM; elite demonic receptions conclude at sunset.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-zinc-950 bg-zinc-950/20 flex gap-4 items-start text-left">
                <div className="p-3 bg-yellow-950/20 text-[#ef4444] rounded border border-yellow-900/30">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-mono text-sm text-white uppercase font-bold tracking-wider">GDPR & CCPA Standard</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                    Every attendee profile is double salted, encrypted with SHA-256 blocks, supporting standalone MFA safety overrides.
                  </p>
                </div>
              </div>

            </div>

            {/* Anchor Target for Ticketing System */}
            <div id="ticketing-anchor" className="border-t border-red-950/10 pt-10">
              <div className="text-center space-y-1.5 mb-1">
                <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-extrabold block">
                  {currentLanguage === 'spooky' ? '⛧ HARVEST PASSES MATRIX ⛧' : 'SECURED GATEWAY REGISTER TIER'}
                </span>
                <h2 className="font-mono text-2xl md:text-3xl font-black uppercase text-white tracking-widest">
                  {t.buyTickets || 'Choose Your Entrance Pass'}
                </h2>
              </div>

              {/* Ticketing Matrix with Countdown */}
              <TicketTiers
                currentLanguage={currentLanguage}
                selectedTierId={selectedTier?.id}
                onSelectTier={(tier) => {
                  setSelectedTier(tier);
                  setSuccessReg(null); // Clear previous receipt if selecting new one
                }}
              />
            </div>

            {/* Selected Registration Checkout / Receipt Frame Container */}
            <AnimatePresence>
              {selectedTier && (
                <motion.div
                  id="checkout-portal-frame"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="mx-4 py-8 border-t border-zinc-900"
                >
                  {successReg ? (
                    <RegistrationReceipt
                      attendee={successReg.attendee}
                      selectedTier={selectedTier}
                      mfaCode={successReg.mfaCode}
                      currentLanguage={currentLanguage}
                      onReset={() => {
                        setSuccessReg(null);
                        setSelectedTier(null);
                      }}
                    />
                  ) : (
                    <RegistrationForm
                      selectedTier={selectedTier}
                      currentLanguage={currentLanguage}
                      onSuccess={handleRegistrationSuccess}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Featured Speakers Grid with bio Popups & newsletter */}
            <div className="border-t border-[#14151a] pt-8">
              <SpeakersWithNewsletter
                currentLanguage={currentLanguage}
                onSubscribeNewsletter={handleSubscribeNewsletter}
              />
            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="mx-4 p-5 rounded-xl border border-zinc-950 bg-zinc-950/20 text-center md:text-left">
              <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest block mb-0.5">
                ★ COVEN CHRONOLOGY PROTOCOL ★
              </span>
              <h2 className="font-mono text-2xl font-bold uppercase tracking-wider text-white">
                {t.sessionsHeader || 'Interactive Convention Schedule'}
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                Explore, search and favorite Forensic Autopsy and Demonic Lore panels. Set instant alerts to ping remind you before the heavy velvet doors lock.
              </p>
            </div>

            <EventSchedule
              currentLanguage={currentLanguage}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onSetAlert={handleSetAlert}
            />
          </div>
        )}

        {/* TAB 3: SOUL TICKET CHECK-IN (QR SCANNER) */}
        {activeTab === 'checkin' && (
          <div className="space-y-6">
            <div className="mx-4 p-5 rounded-xl border border-zinc-950 bg-zinc-950/20 text-center md:text-left">
              <span className="font-mono text-[9.5px] text-red-500 uppercase tracking-widest block mb-0.5">
                ✦ TOUCHLESS ENTRY CHANNELS ✦
              </span>
              <h2 className="gothic-title text-2xl text-white uppercase tracking-wider">
                {currentLanguage === 'spooky' ? '☠ SOUL CONJECTURE VERIFY ☠' : 'Touchless Entry Scanner'}
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                Simulate front-gate scanning. Place a visitor credentials card or write the ticket QR-Code manual pass below to verify GDPR-protected check-in databases.
              </p>
            </div>

            <AttendeeCheckIn
              currentLanguage={currentLanguage}
              registeredAttendees={attendees}
              onCheckInSuccess={handleCheckInSuccess}
            />
          </div>
        )}

        {/* TAB 4: ORGANIZER COMMAND COCKPIT */}
        {activeTab === 'organizer' && (
          <div className="space-y-6">
            <div className="mx-4 p-5 rounded-xl border border-zinc-950 bg-zinc-950/20 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest block mb-0.5">
                  ✦ COVEN COMMAND CENTER ✦
                </span>
                <h2 className="font-mono text-2xl font-bold uppercase tracking-wider text-white">
                  {t.organizerBtn || 'Organizer Dashboard'}
                </h2>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                  Real-time visual telemetry, PCI-compliant Gross proceeds, check-in percentages, automated GDPR encrypted logs, and suspicious hack-alert overrides.
                </p>
              </div>
              
              <div className="px-3.5 py-1.5 bg-red-950/20 border border-red-900 text-red-500 font-mono text-[10px] rounded uppercase self-center animate-pulse">
                🔑 Admin Shield Node: Active
              </div>
            </div>

            <OrganizerDashboard
              currentLanguage={currentLanguage}
              attendees={attendees}
              auditLogs={auditLogs}
              onTriggerMockAlert={handleTriggerMockAlert}
              onClearDatabase={handleClearDatabase}
            />
          </div>
        )}

      </div>

      {/* Spooky Footnotes with double locks certifications */}
      <footer className="mt-16 border-t border-[#0e0e12] bg-black/90 py-10 text-center space-y-4">
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 text-zinc-600 font-mono text-xs">
            <Skull className="h-4 w-4 text-red-800" />
            <span>© 2026 The Unknown Gathering • Waco PACC - Skyline Dome.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-mono text-zinc-600 uppercase">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-700" /> SHA-256 SALTED VAULTS
            </span>
            <span>•</span>
            <span>CCPA REGISTER COMPLIANT</span>
            <span>•</span>
            <span>GDPR ART.32 STANDARD</span>
          </div>
        </div>

        <p className="text-[9px] font-mono text-[#303038] uppercase max-w-3xl mx-auto leading-normal px-4">
          Disclaimer: This is a fictional demo. It runs entirely in your browser and stores data unencrypted in local storage. The security and compliance labels shown throughout (AES-256, SHA-256, GDPR, CCPA, PCI-DSS, MFA, TLS) are decorative theming only — no real encryption, authentication, payment processing, or data protection is performed. All transactions and card gateways are simulated; nothing is sent anywhere. No actual financial coins or real souls are consumed during use.
        </p>

      </footer>

    </div>
  );
}
