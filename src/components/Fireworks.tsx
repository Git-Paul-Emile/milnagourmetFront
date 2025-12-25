import React, { useEffect, useRef } from 'react';

interface FireworkType {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  hue: number;
  update: () => boolean;
  draw: () => void;
  explode: () => void;
}

interface ParticleType {
  x: number;
  y: number;
  hue: number;
  angle: number;
  speed: number;
  vx: number;
  vy: number;
  gravity: number;
  friction: number;
  alpha: number;
  decay: number;
  update: () => boolean;
  draw: () => void;
}

const Fireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks: FireworkType[] = [];
    const particles: ParticleType[] = [];

    class Firework implements FireworkType {
      x: number;
      y: number;
      targetY: number;
      speed: number;
      hue: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.5;
        this.speed = Math.random() * 3 + 5;
        this.hue = Math.random() * 360;
      }

      update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.explode();
          return false;
        }
        return true;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.fill();
      }

      explode() {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(this.x, this.y, this.hue));
        }
      }
    }

    class Particle implements ParticleType {
      x: number;
      y: number;
      hue: number;
      angle: number;
      speed: number;
      vx: number;
      vy: number;
      gravity: number;
      friction: number;
      alpha: number;
      decay: number;

      constructor(x: number, y: number, hue: number) {
        this.x = x;
        this.y = y;
        this.hue = hue + Math.random() * 50 - 25;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 5 + 2;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.gravity = 0.1;
        this.friction = 0.98;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        return this.alpha > 0;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.fill();
        ctx.restore();
      }
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05) {
        fireworks.push(new Firework());
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        if (!fireworks[i].update()) {
          fireworks.splice(i, 1);
        } else {
          fireworks[i].draw();
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].update()) {
          particles.splice(i, 1);
        } else {
          particles[i].draw();
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default Fireworks;