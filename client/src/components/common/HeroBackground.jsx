import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HeroBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Mouse & Touch Tracking (Passive listeners for performance)
  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            mouseRef.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            };
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0 && !ticking) {
        window.requestAnimationFrame(() => {
          const touch = e.touches[0];
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            mouseRef.current = {
              x: touch.clientX - rect.left,
              y: touch.clientY - rect.top,
            };
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // HTML5 Canvas Lightweight Optimized 3D RBC Particle Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const isMobile = window.innerWidth < 768;

    const updateSize = () => {
      if (!canvas || !canvas.parentElement) return;
      // Cap devicePixelRatio at 1.5 to maintain smooth 60fps on high-DPI screens
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Highly optimized cell count: 12 on mobile, 22 on desktop
    const cellCount = isMobile ? 12 : 22;
    const cells = Array.from({ length: cellCount }, () => {
      const depth = Math.random(); // 0 (far) to 1 (near)
      const baseRadius = 12 + depth * 18; // 12px to 30px
      return {
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * (0.3 + depth * 0.4),
        vy: -0.3 - Math.random() * (0.4 + depth * 0.5), // gentle upward flow
        baseRadius,
        radius: baseRadius,
        depth,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: (Math.random() - 0.5) * 0.015,
        aspectRatio: 0.4 + Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        opacity: 0.3 + depth * 0.5,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    });

    // Sort cells once by depth so farther cells render behind nearer ones
    cells.sort((a, b) => a.depth - b.depth);

    // Optimized plasma sparkles (12 particles)
    const plasmaCount = isMobile ? 8 : 16;
    const plasmaParticles = Array.from({ length: plasmaCount }, () => ({
      x: Math.random() * (width || 800),
      y: Math.random() * (height || 600),
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.2 - Math.random() * 0.4,
      radius: 1 + Math.random() * 2,
      opacity: 0.25 + Math.random() * 0.5,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Draw single 3D Biconcave Red Blood Cell (Hardware-accelerated simple rendering)
    const drawBloodCell = (cell) => {
      ctx.save();
      ctx.translate(cell.x, cell.y);
      ctx.rotate(cell.rotation);
      ctx.scale(1, cell.aspectRatio);

      const r = cell.radius;
      const opacity = cell.opacity;

      // Outer Toroidal Rim Gradient
      const rimGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
      rimGrad.addColorStop(0, `rgba(239, 68, 68, ${opacity})`);
      rimGrad.addColorStop(0.5, `rgba(220, 38, 38, ${opacity})`);
      rimGrad.addColorStop(1, `rgba(153, 27, 27, ${opacity * 0.9})`);

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = rimGrad;
      ctx.fill();

      // Center Biconcave Indent
      const dimpleRadius = r * 0.45;
      const dimpleGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, dimpleRadius);
      dimpleGrad.addColorStop(0, `rgba(127, 29, 29, ${opacity * 0.85})`);
      dimpleGrad.addColorStop(1, `rgba(185, 28, 28, 0)`);

      ctx.beginPath();
      ctx.arc(0, 0, dimpleRadius, 0, Math.PI * 2);
      ctx.fillStyle = dimpleGrad;
      ctx.fill();

      // Highlight Spot
      if (cell.depth > 0.4) {
        ctx.beginPath();
        ctx.arc(-r * 0.3, -r * 0.3, r * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 202, 202, ${opacity * 0.5})`;
        ctx.fill();
      }

      ctx.restore();
    };

    // Render Loop
    let lastTime = performance.now();
    const render = (currentTime) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // 1. Draw Plasma Sparkles
      for (let i = 0; i < plasmaParticles.length; i++) {
        const p = plasmaParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 113, 113, ${currentOpacity})`;
        ctx.fill();
      }

      // 2. Animate and Draw Red Blood Cells
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.x += cell.vx;
        cell.y += cell.vy;
        cell.rotation += cell.rotationSpeed;

        cell.tiltAngle += cell.tiltSpeed;
        cell.aspectRatio = 0.4 + Math.abs(Math.sin(cell.tiltAngle)) * 0.5;

        // Mouse Deflection Physics (Lightweight distance check)
        if (mx > 0 && my > 0) {
          const dx = cell.x - mx;
          const dy = cell.y - my;
          const distSq = dx * dx + dy * dy;
          const maxDist = 120 + cell.depth * 50;

          if (distSq < maxDist * maxDist && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * (1.2 + cell.depth * 2);
            cell.x += (dx / dist) * force;
            cell.y += (dy / dist) * force;
          }
        }

        // Screen Boundary Wrap
        if (cell.y < -cell.radius * 2) {
          cell.y = height + cell.radius * 2;
          cell.x = Math.random() * width;
        }
        if (cell.x < -cell.radius * 2) cell.x = width + cell.radius * 2;
        if (cell.x > width + cell.radius * 2) cell.x = -cell.radius * 2;

        drawBloodCell(cell);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(220,38,38,0.18) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(220,38,38,0.18) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Pulsing Concentric Arterial Waves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/15 dark:border-red-500/10 will-change-transform"
          style={{
            width: `${220 + i * 180}px`,
            height: `${220 + i * 180}px`,
          }}
          animate={{
            scale: [0.9, 1.35, 0.9],
            opacity: [0.2, 0.05, 0.2],
          }}
          transition={{
            duration: 12 + i * 4,
            delay: i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* HTML5 Canvas Blood Cell Particle Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-10"
      />

      {/* Ambient Subtle Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/10 dark:bg-red-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-rose-600/10 dark:bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Readability Overlay */}
      <div className="absolute inset-0 z-20 bg-black/15 dark:bg-black/25 backdrop-blur-[2px] pointer-events-none select-none" />
    </div>
  );
};

export default HeroBackground;
