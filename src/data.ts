/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TicketTier, Speaker, EventSession, LanguageCode } from './types';

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'early_bird',
    name: 'Early Bird Cosmos Pass',
    description: 'Discounted access for early-registering seekers of the unknown. Full entry into all standard exhibit halls, general panels, and skywatching decks.',
    originalPrice: 75,
    currentPrice: 49,
    isEarlyBird: true,
    perks: [
      'General Admission seating',
      'The Unknown swag merch starter pack',
      'Standard access to the Waco Gathering Exhibit Hall'
    ],
    remainingStock: 24,
    totalStock: 100
  },
  {
    id: 'standard',
    name: 'Anomaly Standard Pass',
    description: 'General admission registration. Provides entry to all general panels, exhibition floors, evening cryptid hunts, and UFO night watches.',
    originalPrice: 85,
    currentPrice: 75,
    isEarlyBird: false,
    perks: [
      'Standard general admission entry',
      'Access to 25+ Unknown & Mystery vendor booths',
      'Electronic certificate of unexplained encounter'
    ],
    remainingStock: 142,
    totalStock: 250
  },
  {
    id: 'vip_forensics',
    name: 'VIP Forensics Pass',
    description: 'Priority access for serious investigators. Front-row seating at all keynote panels plus hands-on entry to the restricted Forensics Vault sessions.',
    originalPrice: 199,
    currentPrice: 149,
    isEarlyBird: false,
    perks: [
      'Reserved front-row keynote seating',
      'Restricted access to the Forensics Vault workshops',
      'Limited-edition evidence-file dossier & lanyard',
      'Priority touchless check-in lane'
    ],
    remainingStock: 38,
    totalStock: 80
  },
  {
    id: 'elite_cryptid',
    name: 'Elite Cryptid Pass',
    description: 'The supreme all-access tier. Everything in VIP plus the after-dark cryptid night hunt, the private speaker reception, and the collector relic crate.',
    originalPrice: 399,
    currentPrice: 299,
    isEarlyBird: false,
    perks: [
      'All VIP Forensics perks included',
      'After-dark guided cryptid night hunt',
      'Private reception with keynote speakers',
      'Exclusive collector relic crate & signed print'
    ],
    remainingStock: 11,
    totalStock: 40
  }
];

export const SPEAKERS: Speaker[] = [
  {
    id: 'abigail_vance',
    name: 'Dr. Abigail Vance',
    role: 'Chief Forensic Pathologist & Author',
    bio: 'With over twenty years analyzing mysterious cold cases, Dr. Vance reveals how forensic anthropology and bone trauma decoding bring truth to light when human voices fail, with a special focus on anomalous markings.',
    topic: '🦴 Skeletal Secrets of Unexplained Cold Cases: Decoding Forensic Curiosities',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    isKeynote: true,
    sessions: ['session_1', 'session_5']
  },
  {
    id: 'victor_sterling',
    name: 'Victor "Phantasm" Sterling',
    role: 'Lead Paranormal Investigator & Demonic Occultist',
    bio: 'Victor has led spectral investigations inside haunted asylums, catacombs, and ancient battlefields across the Deep South. He is the host of popular paranormal podcast "Whispers from the Beyond".',
    topic: '🔮 Waco\'s Cosmic Portal: Ley Lines & Aerial Anomalies near the Historic Suspension Bridge',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    isKeynote: true,
    sessions: ['session_2', 'session_4']
  },
  {
    id: 'chloe_blackwood',
    name: 'Chloe Blackwood',
    role: 'Investigative Podcaster & Cryptid Theorist',
    bio: 'Host of the chart-topping True Crime podcast "Shadowed Footsteps", Chloe specializes in connecting regional cryptid sightings like Bigfoot and Skinwalkers with historical mystery files.',
    topic: '👣 Bigfoot, Skinwalkers, & Woodland Howlers: Where Human Evil Meets Cryptid Folklore',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    isKeynote: false,
    sessions: ['session_3', 'session_7']
  },
  {
    id: 'marcus_frost',
    name: 'Prof. Marcus Frost',
    role: 'Ufologist & Professor of Anomalous Aerial Phenomena',
    bio: 'A leading expert in Roswell documents, military declassification history, and physical evidence of close encounters, Prof. Frost correlates ancient sky-god mythology with modern anomalous aerial sightings.',
    topic: '🛸 Close Encounters of the Southwest: Declassified UFO Cases & Saucer Retrieval Secrets',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    isKeynote: false,
    sessions: ['session_4', 'session_6']
  }
];

export const SCHEDULE: EventSession[] = [
  {
    id: 'session_1',
    title: '🦴 Skeletal Secrets of Unexplained Cold Cases: Decoding Forensic Curiosities',
    description: 'Dr. Abigail Vance breaks down unexplained skeletal anomalies piece by piece, demonstrating how trauma footprints distinguish human incidents from cryptid marks.',
    speakerIds: ['abigail_vance'],
    location: 'Chamber A - Forensics Vault',
    timeSlot: '09:00 AM - 10:15 AM',
    category: 'forensics',
    capacity: 120
  },
  {
    id: 'session_2',
    title: '🔮 Hardware of the Unknown: EMF Trailing & EVP Capture Stations',
    description: 'Hands-on hardware session detailing EMF calibration, infrared temperature arrays, and capturing electronic signals of unexplained occurrences.',
    speakerIds: ['victor_sterling'],
    location: 'Chamber B - Spectral Room',
    timeSlot: '10:30 AM - 11:45 AM',
    category: 'paranormal',
    capacity: 90
  },
  {
    id: 'session_7',
    title: '🔪 Cold Case Files of Central Texas: Unsolved Crimes & Missing Persons',
    description: 'True crime podcaster Chloe Blackwood walks through Central Texas\'s most haunting unsolved cases, connecting forensic dead-ends with the folklore that grew around them.',
    speakerIds: ['chloe_blackwood'],
    location: 'Chamber C - Cold Case Room',
    timeSlot: '12:00 PM - 12:50 PM',
    category: 'true_crime',
    capacity: 110
  },
  {
    id: 'session_3',
    title: '🛸 Texas UFO & Cryptid Chronicles: Lone Star Sky Anomalies',
    description: 'A deep investigative report on historical spacecraft sightings, modern close encounters, and regional beast footprints hidden in the Lone Star cedar woods.',
    speakerIds: ['chloe_blackwood'],
    location: 'Main Auditorium - Abyss Stage',
    timeSlot: '01:00 PM - 02:15 PM',
    category: 'ufos',
    capacity: 350
  },
  {
    id: 'session_4',
    title: '💼 Interactive Skywatch & Celestial Deciphering Workshop',
    description: 'Prof. Marcus Frost and Victor Sterling lead an active interactive workshop analyzing historical declassified military documents, night-vision imagery, and high-sensitivity sky sensors.',
    speakerIds: ['marcus_frost', 'victor_sterling'],
    location: 'Chamber B - Spectral Room',
    timeSlot: '02:30 PM - 03:45 PM',
    category: 'interactive',
    capacity: 80
  },
  {
    id: 'session_5',
    title: '🦴 Unexplained DNA Profiles & Forensic Mystery Breakthroughs',
    description: 'Reviewing modern genetic genealogy breakthroughs resolving long-standing unexplained cases, including strange tissue DNA sequencing and hybrid profile controversies.',
    speakerIds: ['abigail_vance'],
    location: 'Chamber A - Forensics Vault',
    timeSlot: '04:00 PM - 05:15 PM',
    category: 'forensics',
    capacity: 150
  },
  {
    id: 'session_6',
    title: '🛸 Keynote: The Cosmic Unknown - UFOs, Cryptids, & Portals',
    description: 'Our final collaborative panel tying UFO sightings, cryptid trackings, paranormal activity, and real-world unsolved true crime puzzles across Texas into a single master map.',
    speakerIds: ['marcus_frost'],
    location: 'Main Auditorium - Abyss Stage',
    timeSlot: '05:30 PM - 06:45 PM',
    category: 'ufos',
    capacity: 400
  }
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    title: 'The Unknown Gathering',
    subtitle: 'UFOs • Cryptids • Paranormal • True Crime • Horror | A One-Day Celebration of the Strange, the Mysterious, and the Unexplained',
    registerBtn: 'Secure Your Pass',
    buyTickets: 'Buy Tickets',
    speakersHeader: 'Featured Specialists of the Unexplained',
    sessionsHeader: 'Interactive Gathering Schedule',
    newsletterTitle: 'Join the Seekers of the Unknown Newsletter',
    newsletterSub: 'Receive classified event alerts, anomaly reports, and special access codes.',
    newsletterEmail: 'Enter your mortal email address...',
    newsletterBtn: 'Subscribe to the Unexplained',
    successNewsletter: 'Your contact details are inscribed. Keep a watch on the sky at night...',
    allCategories: 'All Tracks',
    categoryForensics: 'Forensics',
    categoryParanormal: 'Paranormal',
    categoryTrueCrime: 'True Crime',
    categoryInteractive: 'Interactive Panels',
    categoryUfos: 'UFOs & Cryptids',
    timeRemindBtn: 'Set Alert',
    addToCalendar: 'Add to Digital Planner',
    organizerBtn: 'Organizer Dashboard',
    attendeePortal: 'Attendee Check-In',
    mfaNotice: 'MFA Status',
    gdprAccept: 'I consent to standard CCPA & GDPR secure data storage guidelines.',
    earlyBirdCountdown: 'Early-bird Cosmos passes are vanishing. Secure yours before sunset.',
    checkoutTitle: 'Secure Gateway Checkout'
  },
  es: {
    title: 'The Unknown Gathering',
    subtitle: 'OVNIs • Criptidos • Paranormal • Crímenes Reales • Terror | Celebración de lo Extraño, lo Misterioso y lo Inexplicable',
    registerBtn: 'Asegura tu Pase',
    buyTickets: 'Comprar Entradas',
    speakersHeader: 'Especialistas de lo Inexplicable',
    sessionsHeader: 'Calendario de Eventos Interactivo',
    newsletterTitle: 'Únete al Boletín de Buscadores de lo Desconocido',
    newsletterSub: 'Recibe alertas de eventos clasificados, informes de anomalías y códigos de acceso.',
    newsletterEmail: 'Ingresa tu correo mortal...',
    newsletterBtn: 'Suscribirse a lo Inexplicable',
    successNewsletter: 'Tu alma está inscrita. Vigila los cielos por la noche...',
    allCategories: 'Todos los Temas',
    categoryForensics: 'Forense',
    categoryParanormal: 'Paranormal',
    categoryTrueCrime: 'Crímenes Reales',
    categoryInteractive: 'Paneles Interactivos',
    categoryUfos: 'OVNIs y Criptidos',
    timeRemindBtn: 'Establecer Alerta',
    addToCalendar: 'Agregar al Planificador',
    organizerBtn: 'Panel del Organizador',
    attendeePortal: 'Control de Asistencia',
    mfaNotice: 'Estado MFA',
    gdprAccept: 'Doy mi consentimiento para el almacenamiento seguro de datos según CCPA/GDPR.',
    earlyBirdCountdown: 'Los pases anticipados Cosmos se están desvaneciendo. Asegúralos antes del atardecer.',
    checkoutTitle: 'Pasarela de Pago Segura'
  },
  fr: {
    title: 'The Unknown Gathering',
    subtitle: 'OVNIs • Cryptides • Paranormal • Crime Réel • Horreur | Célébration de l\'Étrange, du Mystérieux et de l\'Inexpliqué',
    registerBtn: 'Sécuriser Votre Pass',
    buyTickets: 'Acheter des Billets',
    speakersHeader: 'Spécialistes Vedettes de l\'Inexpliqué',
    sessionsHeader: 'Programme Interactif du Rassemblement',
    newsletterTitle: 'Rejoindre la Newsletter des Chercheurs de l\'Inconnu',
    newsletterSub: 'Recevez des alertes d\'événements confidentiels, des rapports d\'anomalies et des codes secrets.',
    newsletterEmail: 'Entrez votre adresse email de mortel...',
    newsletterBtn: 'S\'abonner à l\'Inexpliqué',
    successNewsletter: 'Votre adresse est inscrite. Surveillez le ciel pendant la nuit...',
    allCategories: 'Toutes les Thématiques',
    categoryForensics: 'Médecine Légale',
    categoryParanormal: 'Paranormal',
    categoryTrueCrime: 'Enquêtes Criminelles',
    categoryInteractive: 'Panels Interactifs',
    categoryUfos: 'OVNIs et Cryptides',
    timeRemindBtn: 'Créer une Alerte',
    addToCalendar: 'Ajouter à l\'agenda',
    organizerBtn: 'Tableau de l\'Organisateur',
    attendeePortal: 'Enregistrement des Visiteurs',
    mfaNotice: 'Statut MFA',
    gdprAccept: 'Je consens à la conservation de mes données conformément aux directives GDPR & CCPA.',
    earlyBirdCountdown: 'Les pass Cosmos "Early-Bird" s\'estompent. Réservez le vôtre avant le crépuscule.',
    checkoutTitle: 'Passerelle de Paiement Sécurisée'
  },
  spooky: {
    title: '⛧ COSMIC CONVENTICLE OF THE UNKNOWN GATHERING ⛧',
    subtitle: '🛸 UFO BEAMS • CRYPTID CLAWS • PARANORMAL SPELLS • TRUE CRIME INQUESTS ⛧ CELEBRATING THE STRANGE & UNEXPLAINED',
    registerBtn: 'BIND YOUR SOUL NOW',
    buyTickets: 'TRADE COINS FOR TOKENS',
    speakersHeader: 'THE STELLAR EXTRATERRESTRIAL & CRYPTID KEEPERS',
    sessionsHeader: 'CHRONOLOGY OF ANOMALIES & INCIDENTS',
    newsletterTitle: 'OFFER YOUR BLOODLINE TO THE SECRET COUNCIL',
    newsletterSub: 'Classified telepathic whispers. Receive declassified files and close encounter alerts.',
    newsletterEmail: 'Relinquish your mortal address coordinates...',
    newsletterBtn: 'SUMMON THE SPIRITS TO BIND',
    successNewsletter: 'The parchment burns. Your email is written in sacrificial ink. Gaze into the starry void...',
    allCategories: 'All Incident Tracks',
    categoryForensics: 'Abduction Flesh & Anatomy',
    categoryParanormal: 'Haunted Apparitions & Leylines',
    categoryTrueCrime: 'Unsolved Evils',
    categoryInteractive: 'Celestial Deciphering & Skywatches',
    categoryUfos: 'UFOs & Cosmic Sightings',
    timeRemindBtn: 'Hex Reminder',
    addToCalendar: 'Imprint on Personal Grimoire',
    organizerBtn: 'COMMAND CONTROLLER (ADMIN)',
    attendeePortal: 'SOUL PORTAL CHECK-IN',
    mfaNotice: 'Cosmic Safeguard Shield (MFA)',
    gdprAccept: 'I yield my spirit coordinates to be locked securely in the deep vaults under CCPA/GDPR encryption protocols.',
    earlyBirdCountdown: 'The Fledgling early passes are being devoured by alien entities. Snatch yours before nightfall.',
    checkoutTitle: 'CELESTIAL SACRIFICE SECURE GATEWAY'
  }
};
