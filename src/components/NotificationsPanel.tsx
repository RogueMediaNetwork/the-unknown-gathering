/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Bell, Skull, ShieldAlert, Sparkles, X, Archive } from 'lucide-react';
import { LanguageCode } from '../types';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'critical' | 'reminder' | 'security' | 'general';
  isRead: boolean;
}

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  onClose: () => void;
  isOpen: boolean;
  currentLanguage: LanguageCode;
}

export default function NotificationsPanel({
  notifications,
  setNotifications,
  onClose,
  isOpen,
  currentLanguage
}: NotificationsPanelProps) {
  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <motion.div
      id="notifications-tray"
      initial={{ opacity: 0, x: 320 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 320 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed right-0 top-16 z-40 w-full sm:w-96 h-[calc(100vh-4rem)] bg-gradient-to-b from-[#090a0f] to-[#040406] border-l border-red-950/60 p-4 shadow-2xl flex flex-col justify-between"
    >
      {/* Header */}
      <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4 text-red-500 animate-bounce" />
          <h3 className="font-mono text-sm uppercase tracking-widest text-[#f5f5f5]">
            {currentLanguage === 'spooky' ? '⛧ TRANSMITTED APPARITIONS ⛧' : 'Incarnated Alerts'}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            id="btn-mark-spirit-read"
            onClick={markAllAsRead}
            className="text-[10px] font-mono text-yellow-500 hover:text-yellow-400 border border-yellow-950 px-1.5 py-0.5 rounded bg-amber-950/10 cursor-pointer"
          >
            Soothe All
          </button>
          <button
            id="btn-close-notify-panel"
            onClick={onClose}
            className="p-1 rounded bg-gray-900 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications Scroll */}
      <div className="flex-1 overflow-y-auto py-2 space-y-2.5 pr-1 my-3 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border-dashed border border-gray-900 rounded-lg">
            <Skull className="h-8 w-8 text-zinc-800 mb-3 animate-pulse" />
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              {currentLanguage === 'spooky' ? 'SILENCE RESTS IN THE DEEP' : 'The ethereal radar is empty'}
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            let icon = <Bell className="h-3.5 w-3.5 text-gray-400" />;
            let borderColor = 'border-gray-900 bg-zinc-950/20';
            if (n.type === 'critical') {
              icon = <Skull className="h-3.5 w-3.5 text-red-500 animate-spin" />;
              borderColor = 'border-red-950/80 bg-red-950/10';
            } else if (n.type === 'security') {
              icon = <ShieldAlert className="h-3.5 w-3.5 text-yellow-500" />;
              borderColor = 'border-yellow-950/80 bg-yellow-950/10';
            } else if (n.type === 'reminder') {
              icon = <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-pulse" />;
              borderColor = 'border-gray-800 bg-gray-950/10';
            }

            return (
              <div
                key={n.id}
                id={`notify-card-${n.id}`}
                className={`p-3 rounded border text-left flex items-start gap-2.5 transition-all relative group ${borderColor} ${
                  !n.isRead ? 'ring-1 ring-red-800/40' : ''
                }`}
              >
                {!n.isRead && (
                  <span className="absolute top-2 right-8 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                )}
                
                <div className="mt-0.5">{icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-semibold text-gray-200 truncate uppercase tracking-tight">
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="block font-mono text-[9px] text-[#71717a] mt-1.5 uppercase hover:text-gray-400">
                    🛡️ {n.time}
                  </span>
                </div>
                <button
                  onClick={() => clearNotification(n.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-500 transition-opacity"
                  title="Purge alert"
                >
                  <Archive className="h-3 mt-1 cursor-pointer" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Instructions */}
      <div className="border-t border-gray-950 pt-2.5 text-center">
        <p className="font-mono text-[9.5px] text-[#4d4d4d] leading-normal uppercase">
          {currentLanguage === 'spooky'
            ? '⛧ SECURE COVEN PROTOCOL ACTIVE • GDPR-COMPLIANT SHIELDS ⛧'
            : '🛡️ CCPA SECURED CHANNEL • DOUBLE-FACTOR SHIELDS'}
        </p>
      </div>
    </motion.div>
  );
}
