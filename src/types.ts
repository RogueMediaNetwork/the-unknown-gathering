/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TicketTier {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  isEarlyBird: boolean;
  perks: string[];
  remainingStock: number;
  totalStock: number;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string;
  topic: string;
  image: string;
  isKeynote: boolean;
  sessions: string[];
}

export interface EventSession {
  id: string;
  title: string;
  description: string;
  speakerIds: string[];
  location: string;
  timeSlot: string; // e.g., "09:00 AM - 10:15 AM"
  category: 'true_crime' | 'paranormal' | 'forensics' | 'interactive' | 'ufos';
  capacity: number;
}

export interface Attendee {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  ticketTierId: string;
  ticketCode: string; // QR code representation
  languageSelected: string;
  registrationDate: string;
  isCheckedIn: boolean;
  mfaEnabled: boolean;
  consentSigned: boolean; // compliance with GDPR & CCPA
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
  ipAddress: string;
  details: string;
}

export interface OrganizerStats {
  totalRevenue: number;
  ticketsSold: number;
  totalCheckIns: number;
  trafficCount: number;
  suspiciousLogsCount: number;
}

export type LanguageCode = 'en' | 'es' | 'fr' | 'spooky';
