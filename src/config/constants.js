// Raksha — Design System & Configuration
// Minimalist dark theme with layered surfaces

export const COLORS = {
  // Core surfaces
  BG: '#0A0A0A',
  SURFACE: '#161616',
  ELEVATED: '#1E1E1E',
  CARD: '#1A1A1A',

  // Borders
  BORDER: '#2A2A2A',
  BORDER_LIGHT: '#333333',

  // Text
  TEXT: '#E8E8E8',
  TEXT_SECONDARY: '#999999',
  TEXT_MUTED: '#555555',

  // Accent
  ACCENT: '#6C63FF',
  ACCENT_DIM: 'rgba(108, 99, 255, 0.15)',

  // Functional
  DANGER: '#FF4757',
  DANGER_DIM: 'rgba(255, 71, 87, 0.12)',
  SUCCESS: '#2ECC71',
  SUCCESS_DIM: 'rgba(46, 204, 113, 0.12)',
  WARNING: '#F39C12',

  // Special
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
};

export const TYPOGRAPHY = {
  FONT_FAMILY: 'System',
  MONO: 'Courier',

  DISPLAY: 32,
  TITLE: 22,
  HEADING: 18,
  BODY: 15,
  CAPTION: 13,
  TINY: 11,
  MICRO: 9,
};

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};

export const RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  FULL: 999,
};

export const SENSOR_THRESHOLDS = {
  SHAKE_THRESHOLD: 1.78,
  SHAKE_DELAY: 500,
  FALL_IMPACT_THRESHOLD: 3.0,   // Actual drops: 3-8g. Hand movement: 1-2.5g
  FALL_STILLNESS_THRESHOLD: 0.5, // Deviation from 1.0g
  FALL_STILLNESS_DURATION: 2000, // 2s of stillness after impact
  COUNTDOWN_DURATION: 10,
};

export const SCREAM_DETECTION = {
  ENABLED: true,
  AMPLITUDE_THRESHOLD: -20,     // dB — lower = easier to detect
  SUSTAINED_DURATION_MS: 800,   // 0.8s of sustained loud audio
  SAMPLE_INTERVAL_MS: 200,
};

export const EMERGENCY_CONFIG = {
  EMERGENCY_PHONE: '9496064331',
  SOS_MESSAGE_TEMPLATE: (location) =>
    `RAKSHA EMERGENCY ALERT\n\n` +
    `I am in danger and need immediate help!\n\n` +
    `My location:\n${location}\n\n` +
    `Audio evidence is being recorded.\n` +
    `Alert sent: ${new Date().toLocaleString('en-IN')}`,
};

export const FAKE_CALL_CONFIG = {
  RINGTONE_DURATION_MS: 15000,
  CALLER_NAME_STALKER: 'Dad',
  CALLER_NAME_CAB: 'Mom',
  CALL_TYPES: {
    STALKING: 'stalking',
    CAB: 'cab',
  },
};

export const BLACKOUT_CONFIG = {
  CLOCK_OPACITY: 0.3,
  EXIT_TAP_COUNT: 3,
  EXIT_TAP_WINDOW_MS: 1000,
};

export const FEATURE_FLAGS = {
  ENABLE_FALL_DETECTION: true,
  ENABLE_AUDIO_RECORDING: true,
  ENABLE_SCREAM_DETECTION: true,
  ENABLE_BLACKOUT_MODE: true,
  DEBUG_MODE: false,
};