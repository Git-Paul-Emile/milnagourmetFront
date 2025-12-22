import React, { useEffect, useRef } from 'react';

const NewYearEffects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    // Créer des confettis
    function createConfetti() {
      if (!containerRef.current) return;

      const confetti = document.createElement('div');
      confetti.classList.add('confetti');

      // Couleurs possibles pour les confettis
      const colors = ['#FFD700', '#C0C0C0', '#9B59B6', '#FFD700'];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      // Position horizontale aléatoire
      confetti.style.left = Math.random() * window.innerWidth + 'px';

      // Durée de chute aléatoire (entre 3 et 8 secondes)
      const duration = Math.random() * 5 + 3;
      confetti.style.animationDuration = duration + 's';

      // Opacité aléatoire
      confetti.style.opacity = (Math.random() * 0.4 + 0.6).toString();

      // Taille aléatoire
      const size = Math.random() * 8 + 3;
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';

      // Rotation aléatoire
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      containerRef.current.appendChild(confetti);

      // Supprimer le confetti après qu'il soit tombé
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.remove();
        }
      }, duration * 1000);
    }

    // Créer un feu d'artifice
    function createFirework() {
      if (!containerRef.current) return;

      const firework = document.createElement('div');
      firework.classList.add('firework');

      // Position horizontale aléatoire
      const x = Math.random() * window.innerWidth;
      firework.style.left = x + 'px';

      // Couleur principale
      const colors = ['#FFD700', '#9B59B6', '#C0C0C0'];
      const mainColor = colors[Math.floor(Math.random() * colors.length)];

      // Créer les particules
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('firework-particle');
        particle.style.backgroundColor = mainColor;
        particle.style.setProperty('--angle', (i * 18) + 'deg');
        particle.style.animationDelay = (Math.random() * 0.5) + 's';
        firework.appendChild(particle);
      }

      containerRef.current.appendChild(firework);

      // Supprimer le feu d'artifice après l'animation
      setTimeout(() => {
        if (firework.parentNode) {
          firework.remove();
        }
      }, 3000);
    }

    // Démarrer les animations
    const confettiInterval = setInterval(createConfetti, 200);
    const fireworkInterval = setInterval(createFirework, 2000); // Un feu d'artifice toutes les 2 secondes

    // Ajuster lors du redimensionnement
    const handleResize = () => {
      // Les confettis existants continueront leur animation
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(confettiInterval);
      clearInterval(fireworkInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <style>
        {`
          .confetti {
            position: fixed;
            top: -10px;
            z-index: 9998;
            animation: fallConfetti linear infinite;
            pointer-events: none;
            user-select: none;
            border-radius: 50%;
          }

          /* Animation de chute des confettis */
          @keyframes fallConfetti {
            to {
              transform: translateY(100vh) rotate(720deg);
            }
          }

          .firework {
            position: fixed;
            bottom: 0;
            z-index: 9997;
            width: 4px;
            height: 80px;
            background: #FFD700;
            animation: launch 1s ease-out forwards;
          }

          .firework-particle {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            animation: explode 2s ease-out forwards;
            transform-origin: center;
          }

          @keyframes launch {
            to {
              transform: translateY(-300px);
              opacity: 0;
            }
          }

          @keyframes explode {
            0% {
              transform: rotate(var(--angle)) translateY(0) scale(1);
              opacity: 1;
            }
            50% {
              transform: rotate(var(--angle)) translateY(-50px) scale(1.5);
              opacity: 1;
            }
            100% {
              transform: rotate(var(--angle)) translateY(-100px) scale(0);
              opacity: 0;
            }
          }
        `}
      </style>
      <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9997 }}></div>
    </>
  );
};

export default NewYearEffects;