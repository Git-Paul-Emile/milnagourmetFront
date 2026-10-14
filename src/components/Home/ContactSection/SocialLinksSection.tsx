import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react';
import { SocialLink } from '@/lib/contactUtils';
import { cn } from '@/lib/utils';

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
}

const NETWORK_BACKGROUND: Record<string, string> = {
  instagram: 'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
  tiktok: 'bg-gradient-to-br from-[#25f4ee] via-[#111111] to-[#fe2c55]',
  facebook: 'bg-gradient-to-br from-[#1877f2] to-[#0a3d91]',
  twitter: 'bg-gradient-to-br from-[#1da1f2] to-[#0d47a1]',
};

interface CardImage {
  src: string;
  alt: string;
  credit: string;
}

const CARD_IMAGES: CardImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1552320764-9fc870798a3f?w=600&h=800&fit=crop&auto=format&q=70',
    alt: 'Bol de granola et de fruits sur fond clair',
    credit: 'Niclas Illg / Unsplash',
  },
  {
    src: 'https://images.unsplash.com/photo-1593450298197-e6031f033a44?w=600&h=800&fit=crop&auto=format&q=70',
    alt: 'Bol de yaourt aux fraises et kiwis',
    credit: 'Daniel Cabriles / Unsplash',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1713551474697-15fe83485bc7?w=600&h=800&fit=crop&auto=format&q=70',
    alt: 'Trois verrines de fruits rouges sur une table',
    credit: 'Olimpia Davies / Unsplash+',
  },
];

const CARD_WIDTH = 230;
const CARD_HEIGHT = 300;
const CARD_STEP_X = 18;
const CARD_STEP_Y = 26;

export function SocialLinksSection({ socialLinks }: SocialLinksSectionProps) {
  const [order, setOrder] = useState<string[]>(() => socialLinks.map((s) => s.name));
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwipingRef = useRef(false);
  const isScrollingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const namesKey = useMemo(() => socialLinks.map((s) => s.name).join('|'), [socialLinks]);

  useEffect(() => {
    setOrder(socialLinks.map((s) => s.name));
  }, [namesKey]);

  const cycleNext = useCallback(() => {
    if (isAnimating || socialLinks.length <= 1) return;
    setIsAnimating(true);
    setExitDirection('left');
    setTimeout(() => {
      setOrder((prev) => [...prev.slice(1), prev[0]]);
      setExitDirection(null);
      setDragOffset(null);
      setIsAnimating(false);
    }, 180);
  }, [isAnimating, socialLinks.length]);

  const cyclePrev = useCallback(() => {
    if (isAnimating || socialLinks.length <= 1) return;
    setIsAnimating(true);
    setExitDirection('right');
    setTimeout(() => {
      setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
      setExitDirection(null);
      setDragOffset(null);
      setIsAnimating(false);
    }, 180);
  }, [isAnimating, socialLinks.length]);

  const bringToFront = (name: string) => {
    if (isAnimating) return;
    setOrder((previous) => {
      if (previous[0] === name) return previous;
      return [name, ...previous.filter((item) => item !== name)];
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnimating || socialLinks.length <= 1) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    pointerIdRef.current = e.pointerId;
    isSwipingRef.current = false;
    isScrollingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStartRef.current || pointerIdRef.current !== e.pointerId || isAnimating) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    if (!isSwipingRef.current && !isScrollingRef.current) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        isScrollingRef.current = true;
        return;
      }
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
        isSwipingRef.current = true;
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          // ignore si échec de capture
        }
      }
    }

    if (isSwipingRef.current) {
      setDragOffset({ x: dx, y: dy * 0.2 });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStartRef.current || pointerIdRef.current !== e.pointerId) return;

    if (isSwipingRef.current && dragOffset) {
      const dt = Math.max(Date.now() - pointerStartRef.current.time, 1);
      const vx = dragOffset.x / dt;

      if (dragOffset.x < -45 || vx < -0.3) {
        cycleNext();
      } else if (dragOffset.x > 45 || vx > 0.3) {
        cyclePrev();
      } else {
        setDragOffset(null);
      }
    } else {
      setDragOffset(null);
    }

    try {
      if (isSwipingRef.current) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    pointerStartRef.current = null;
    pointerIdRef.current = null;
    isSwipingRef.current = false;
    isScrollingRef.current = false;
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    handlePointerUp(e);
  };

  const stackWidth = CARD_WIDTH + (socialLinks.length - 1) * CARD_STEP_X;
  const stackHeight = CARD_HEIGHT + (socialLinks.length - 1) * CARD_STEP_Y;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-[#212121]">Suivez-Nous</h3>

      {/* Pile de cartes interactive avec geste de balayage */}
      <div
        className="relative mx-auto mb-5 touch-pan-y select-none"
        style={{ width: stackWidth, height: stackHeight }}
      >
        {socialLinks.map((social, index) => {
          const rawPosition = order.indexOf(social.name);
          const position = rawPosition === -1 ? index : rawPosition;
          const isFront = position === 0;
          const networkKey = social.name.toLowerCase();
          const image = CARD_IMAGES[index % CARD_IMAGES.length];

          let transform = `translate(${position * CARD_STEP_X}px, ${position * CARD_STEP_Y}px) rotate(${
            isFront ? 0 : (position % 2 === 0 ? 1 : -1) * position * 1.5
          }deg)`;
          let transition = 'transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease';
          let opacity = 1;

          if (isFront) {
            if (exitDirection) {
              const exitX = exitDirection === 'left' ? -320 : 320;
              const exitRot = exitDirection === 'left' ? -18 : 18;
              transform = `translate(${exitX}px, 20px) rotate(${exitRot}deg)`;
              opacity = 0;
              transition = 'transform 180ms ease-out, opacity 180ms ease-out';
            } else if (dragOffset) {
              const dragRot = dragOffset.x * 0.08;
              transform = `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragRot}deg)`;
              transition = 'none';
            }
          }

          return (
            <div
              key={social.name}
              onPointerDown={isFront ? handlePointerDown : undefined}
              onPointerMove={isFront ? handlePointerMove : undefined}
              onPointerUp={isFront ? handlePointerUp : undefined}
              onPointerCancel={isFront ? handlePointerCancel : undefined}
              className={cn(
                'absolute left-0 top-0 overflow-hidden rounded-2xl shadow-xl',
                isFront ? (dragOffset ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer',
                NETWORK_BACKGROUND[networkKey] || 'bg-gradient-primary'
              )}
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transform,
                transition,
                opacity,
                zIndex: socialLinks.length - position,
              }}
            >
              {/* Image de fond */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
              />

              {/* Voile sombre pour lisibilité */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Clic direct pour remonter une carte en arrière-plan */}
              {!isFront && (
                <button
                  type="button"
                  onClick={() => bringToFront(social.name)}
                  aria-label={`Mettre la carte ${social.name} au premier plan`}
                  className="absolute inset-0 z-0 cursor-pointer"
                />
              )}

              {/* Badge "Balayer" discret sur la carte de tête */}
              {isFront && socialLinks.length > 1 && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium pointer-events-none">
                  <ArrowLeftRight className="w-3 h-3 text-white/80" />
                  <span>Balayer</span>
                </div>
              )}

              {/* Contenu : pseudo + accès profil */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 p-4">
                <div className="flex min-w-0 items-center gap-2">
                  {social.faIcon && (
                    <FontAwesomeIcon
                      icon={social.faIcon}
                      className="h-4 w-4 shrink-0 text-white"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-white">{social.handle}</div>
                    <div className="truncate text-xs text-white/80">{social.name}</div>
                  </div>
                </div>

                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="pointer-events-auto shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#212121] transition-transform hover:scale-105 hover:bg-white/95 shadow-sm active:scale-95"
                >
                  Voir le fil
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commandes et indicateurs de balayage */}
      {socialLinks.length > 1 && (
        <div className="flex flex-col items-center gap-3">
          {/* Points indicateurs */}
          <div className="flex items-center justify-center gap-2">
            {socialLinks.map((social) => {
              const isFront = order[0] === social.name;
              return (
                <button
                  key={social.name}
                  type="button"
                  onClick={() => bringToFront(social.name)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    isFront ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                  )}
                  aria-label={`Afficher ${social.name}`}
                />
              );
            })}
          </div>

          {/* Boutons de navigation gauche / droite pour accessibilité */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={cyclePrev}
              disabled={isAnimating}
              className="p-1.5 rounded-full border border-border/70 hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
              aria-label="Réseau précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium select-none">Balayer pour explorer</span>
            <button
              type="button"
              onClick={cycleNext}
              disabled={isAnimating}
              className="p-1.5 rounded-full border border-border/70 hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
              aria-label="Réseau suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
