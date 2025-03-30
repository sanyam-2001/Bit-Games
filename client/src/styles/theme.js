// Tron-inspired theme with neon colors
const theme = {
  colors: {
    background: '#0c0e14',
    backgroundGradient: 'linear-gradient(180deg, #0c0e14 0%, #1a1d2d 100%)',
    neonBlue: '#08f7fe',
    neonPink: '#fe53bb',
    neonCyan: '#09fbd3',
    text: '#f7f8f9',
    textSecondary: '#8b8da0',
    grid: 'rgba(24, 202, 230, 0.08)',
    gridLines: 'rgba(24, 202, 230, 0.15)',
    overlay: 'rgba(12, 14, 20, 0.8)',
    shadowBlue: '0 0 10px #08f7fe, 0 0 20px rgba(8, 247, 254, 0.5)',
    shadowPink: '0 0 10px #fe53bb, 0 0 20px rgba(254, 83, 187, 0.5)',
  },
  fonts: {
    main: "'Rajdhani', sans-serif",
    mono: "'Share Tech Mono', monospace",
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
};

export default theme; 