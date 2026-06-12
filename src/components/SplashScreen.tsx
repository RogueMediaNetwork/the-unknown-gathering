/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Intro splash shown once per browser session. Auto-fades after a few
// seconds and can be dismissed early by clicking anywhere.
export default function SplashScreen() {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem('tug_splash_seen') !== '1';
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem('tug_splash_seen', '1');
    } catch {
      /* storage unavailable — non-fatal */
    }
  };

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(dismiss, 3200);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          onClick={dismiss}
          role="button"
          aria-label="Enter The Unknown Gathering"
        >
          <img
            src="/splash.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Darkening + vignette for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]" />

          <motion.div
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <span className="font-mono text-[10px] text-red-500 uppercase tracking-[0.3em] block mb-3 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              October 10 • Waco, Texas
            </span>
            <h1 className="gothic-title text-4xl md:text-6xl font-black text-white uppercase tracking-wide drop-shadow-[0_2px_30px_rgba(139,0,0,0.6)]">
              The Unknown Gathering
            </h1>
            <p className="mt-5 font-mono text-[11px] text-zinc-300 uppercase tracking-[0.25em] animate-pulse">
              ⛧ Click to enter ⛧
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
