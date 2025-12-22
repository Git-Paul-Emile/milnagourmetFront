import React, { useEffect, useRef } from 'react';

const ChristmasSnow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let snowActive = true;
    let snowInterval: NodeJS.Timeout;
    const snowIntensity = 300; // ms entre chaque flocon

    // Créer un flocon de neige
    function createSnowflake() {
      if (!snowActive || !containerRef.current) return;

      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');

      // Symboles possibles pour les flocons
      const symbols = ['❄', '❅', '❆', '✻', '✼', '❉'];
      snowflake.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

      // Position horizontale aléatoire
      snowflake.style.left = Math.random() * window.innerWidth + 'px';

      // Durée de chute aléatoire (entre 5 et 12 secondes)
      const duration = Math.random() * 7 + 5;
      snowflake.style.animationDuration = duration + 's';

      // Opacité aléatoire
      snowflake.style.opacity = (Math.random() * 0.6 + 0.4).toString();

      // Taille aléatoire
      snowflake.style.fontSize = (Math.random() * 15 + 10) + 'px';

      // Ajouter des animations variées (30% de chance pour chaque type)
      const random = Math.random();
      if (random < 0.3) {
        snowflake.classList.add('rotate');
        snowflake.style.animationDuration = duration + 's, ' + (Math.random() * 3 + 2) + 's';
      } else if (random < 0.6) {
        snowflake.classList.add('sway');
        snowflake.style.animationDuration = duration + 's, ' + (Math.random() * 2 + 3) + 's';
      }

      containerRef.current.appendChild(snowflake);

      // Supprimer le flocon après qu'il soit tombé
      setTimeout(() => {
        if (snowflake.parentNode) {
          snowflake.remove();
        }
      }, duration * 1000);
    }

    // Démarrer l'animation de neige
    function startSnow() {
      if (snowInterval) clearInterval(snowInterval);
      snowInterval = setInterval(createSnowflake, snowIntensity);
    }

    startSnow();

    // Ajuster les flocons lors du redimensionnement de la fenêtre
    const handleResize = () => {
      const flakes = containerRef.current?.querySelectorAll('.snowflake');
      flakes?.forEach(flake => {
        const left = parseInt((flake as HTMLElement).style.left);
        if (left > window.innerWidth) {
          (flake as HTMLElement).style.left = window.innerWidth - 50 + 'px';
        }
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      snowActive = false;
      if (snowInterval) clearInterval(snowInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <style>
        {`
          .snowflake {
            position: fixed;
            top: -10px;
            z-index: 9999;
            color: rgba(255, 255, 255, 0.8);
            font-size: 1em;
            animation: fall linear infinite;
            pointer-events: none;
            user-select: none;
          }

          /* Animation de chute des flocons */
          @keyframes fall {
            to {
              transform: translateY(100vh);
            }
          }

          /* Animation de rotation pour certains flocons */
          .snowflake.rotate {
            animation: fall linear infinite, rotate linear infinite;
          }

          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          /* Animation de balancement latéral */
          .snowflake.sway {
            animation: fall linear infinite, sway ease-in-out infinite;
          }

          @keyframes sway {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(30px);
            }
          }
        `}
      </style>
      <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}></div>
    </>
  );
};

export default ChristmasSnow;