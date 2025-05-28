module.exports = {
  // ... your existing config
  theme: {
    extend: {
      animation: {
        'float-1': 'float 15s ease-in-out infinite',
        'float-2': 'float 12s ease-in-out infinite reverse',
        'float-3': 'float 18s ease-in-out infinite 2s',
        'float-4': 'float 14s ease-in-out infinite reverse 1s',
        'pothole-pulse': 'potholePulse 8s infinite',
        'pothole-fill': 'potholeFill 8s infinite',
        'particle-float': 'particleFloat 10s infinite linear',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        potholePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        potholeFill: {
          '0%, 100%': { transform: 'scale(0.9)', opacity: '0.7' },
          '50%': { transform: 'scale(1)', opacity: '0.4' },
        },
        particleFloat: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) translateX(20px)', opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}