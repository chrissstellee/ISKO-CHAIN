import React from 'react';

const HolographicBadge: React.FC = () => {
  const styles = {
    container: {
      margin: 0,
      padding: 0,
      background: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
    },
    badge: {
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      position: 'relative' as const,
      background: `conic-gradient(
        from 0deg,
        #c0c0c0 0deg,
        #e8e8e8 15deg,
        #a0a0a0 30deg,
        #d0d0d0 45deg,
        #b8b8b8 60deg,
        #f0f0f0 75deg,
        #c8c8c8 90deg,
        #e0e0e0 105deg,
        #b0b0b0 120deg,
        #d8d8d8 135deg,
        #c0c0c0 150deg,
        #e8e8e8 165deg,
        #a8a8a8 180deg,
        #d0d0d0 195deg,
        #c0c0c0 210deg,
        #f0f0f0 225deg,
        #b8b8b8 240deg,
        #e0e0e0 255deg,
        #c8c8c8 270deg,
        #d8d8d8 285deg,
        #c0c0c0 300deg,
        #e8e8e8 315deg,
        #b0b0b0 330deg,
        #d0d0d0 345deg,
        #c0c0c0 360deg
      )`,
      boxShadow: `
        0 0 30px rgba(255, 255, 255, 0.3),
        inset 0 0 50px rgba(255, 255, 255, 0.1)
      `,
    },
    securityRing: {
      position: 'absolute' as const,
      inset: '-10px',
      borderRadius: '50%',
      border: '2px solid transparent',
      background: `linear-gradient(45deg, 
        rgba(255, 255, 255, 0.8), 
        rgba(220, 220, 220, 0.8),
        rgba(240, 240, 240, 0.8),
        rgba(200, 200, 200, 0.8)
      ) border-box`,
      WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    },
    holographicInner: {
      position: 'absolute' as const,
      inset: '15px',
      borderRadius: '50%',
      background: `radial-gradient(
        circle at 30% 30%,
        rgba(255, 255, 255, 0.6),
        rgba(230, 230, 230, 0.3) 30%,
        rgba(200, 200, 200, 0.2) 50%,
        rgba(180, 180, 180, 0.2) 70%,
        rgba(160, 160, 160, 0.1) 100%
      )`,
      overflow: 'hidden',
    },
    interferencePattern: {
      position: 'absolute' as const,
      inset: 0,
      background: `repeating-linear-gradient(
        45deg,
        transparent,
        rgba(255, 255, 255, 0.1) 1px,
        transparent 2px,
        rgba(255, 255, 255, 0.05) 3px,
        transparent 4px
      )`,
      animation: 'interference 3s ease-in-out infinite alternate',
    },
    diffractionLines: {
      position: 'absolute' as const,
      inset: 0,
      background: `repeating-conic-gradient(
        from 0deg at center,
        transparent 0deg,
        rgba(255, 255, 255, 0.2) 1deg,
        transparent 2deg,
        rgba(255, 255, 255, 0.1) 3deg,
        transparent 6deg
      )`,
      animation: 'diffract 6s linear infinite',
    },
    lightSweep: {
      position: 'absolute' as const,
      inset: 0,
      borderRadius: '50%',
      background: `linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.8) 45%,
        rgba(255, 255, 255, 1) 50%,
        rgba(255, 255, 255, 0.8) 55%,
        transparent 100%
      )`,
      animation: 'sweep 4s linear infinite',
      opacity: 0.7,
    },
    textContainer: {
      position: 'absolute' as const,
      inset: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    mainText: {
      fontSize: '28px',
      fontWeight: 900,
      textAlign: 'center' as const,
      color: '#ffffff',
      textShadow: `
        0 0 5px rgba(0, 0, 0, 0.8),
        0 0 10px rgba(255, 255, 255, 0.8),
        0 0 15px rgba(255, 255, 255, 0.6),
        2px 2px 4px rgba(0, 0, 0, 0.5)
      `,
      animation: 'textPulse 2s ease-in-out infinite alternate',
      letterSpacing: '1px',
    },
    percentage: {
      fontSize: '40px',
      fontWeight: 900,
      margin: '8px 0',
      color: '#ffffff',
      textShadow: `
        0 0 8px rgba(0, 0, 0, 0.9),
        0 0 15px rgba(255, 255, 255, 0.9),
        0 0 25px rgba(255, 255, 255, 0.7),
        0 0 35px rgba(255, 255, 255, 0.5),
        3px 3px 6px rgba(0, 0, 0, 0.6)
      `,
      animation: 'percentGlow 2s ease-in-out infinite alternate',
      letterSpacing: '2px',
    },
    subText: {
      fontSize: '22px',
      fontWeight: 900,
      marginTop: '10px',
      color: '#ffffff',
      textShadow: `
        0 0 5px rgba(0, 0, 0, 0.8),
        0 0 10px rgba(255, 255, 255, 0.8),
        0 0 15px rgba(255, 255, 255, 0.6),
        2px 2px 4px rgba(0, 0, 0, 0.5)
      `,
      animation: 'textPulse 2s ease-in-out infinite alternate',
      letterSpacing: '2px',
    },
    sparkle: {
      position: 'absolute' as const,
      width: '4px',
      height: '4px',
      background: 'white',
      borderRadius: '50%',
      animation: 'sparkle 2s linear infinite',
    },
  };

  const sparklePositions = [
    { top: '20%', left: '30%', animationDelay: '0s' },
    { top: '70%', left: '80%', animationDelay: '0.5s' },
    { top: '40%', left: '20%', animationDelay: '1s' },
    { top: '80%', left: '60%', animationDelay: '1.5s' },
  ];

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
        }

        @keyframes interference {
          0% { 
            transform: translateX(-5px) translateY(-5px) rotate(0deg);
            opacity: 0.3;
          }
          100% { 
            transform: translateX(5px) translateY(5px) rotate(180deg);
            opacity: 0.7;
          }
        }

        @keyframes diffract {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes textPulse {
          0% { 
            transform: scale(1);
            text-shadow: 
              0 0 5px rgba(0, 0, 0, 0.8),
              0 0 10px rgba(255, 255, 255, 0.8),
              0 0 15px rgba(255, 255, 255, 0.6),
              2px 2px 4px rgba(0, 0, 0, 0.5);
          }
          100% { 
            transform: scale(1.05);
            text-shadow: 
              0 0 8px rgba(0, 0, 0, 0.9),
              0 0 20px rgba(255, 255, 255, 1),
              0 0 30px rgba(255, 255, 255, 0.8),
              3px 3px 6px rgba(0, 0, 0, 0.6);
          }
        }

        @keyframes percentGlow {
          0% { 
            transform: scale(1);
            text-shadow: 
              0 0 8px rgba(0, 0, 0, 0.9),
              0 0 15px rgba(255, 255, 255, 0.9),
              0 0 25px rgba(255, 255, 255, 0.7),
              0 0 35px rgba(255, 255, 255, 0.5),
              3px 3px 6px rgba(0, 0, 0, 0.6);
          }
          100% { 
            transform: scale(1.1);
            text-shadow: 
              0 0 12px rgba(0, 0, 0, 1),
              0 0 25px rgba(255, 255, 255, 1),
              0 0 40px rgba(255, 255, 255, 0.9),
              0 0 50px rgba(255, 255, 255, 0.7),
              4px 4px 8px rgba(0, 0, 0, 0.7);
          }
        }

        @keyframes sweep {
          0% { 
            transform: translateX(-100%) rotate(-45deg);
            opacity: 0;
          }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { 
            transform: translateX(100%) rotate(-45deg);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%, 100% { 
            opacity: 0;
            transform: scale(0);
          }
          50% { 
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 15px white;
          }
        }
      `}</style>
      
      <div style={styles.container}>
        <div style={styles.badge}>
          <div style={styles.securityRing}></div>
          <div style={styles.holographicInner}>
            <div style={styles.interferencePattern}></div>
            <div style={styles.diffractionLines}></div>
            <div style={styles.lightSweep}></div>
            {sparklePositions.map((pos, index) => (
              <div
                key={index}
                style={{
                  ...styles.sparkle,
                  top: pos.top,
                  left: pos.left,
                  animationDelay: pos.animationDelay,
                }}
              ></div>
            ))}
          </div>
          <div style={styles.textContainer}>
            <div style={styles.mainText}>
              GENUINE<br />GUARANTEED
            </div>
            <div style={styles.percentage}>100%</div>
            <div style={styles.subText}>ORIGINAL</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HolographicBadge;