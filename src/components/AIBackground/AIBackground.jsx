/* ============================================================
   AIBackground.jsx
   Animated neural-network / particle canvas background.
   - Draws nodes that pulse and drift
   - Connects nearby nodes with fading edges
   - Color-keyed to cyan/violet accent palette
   - Canvas resizes with window
   - Respects prefers-reduced-motion (falls back to static dots)
   ============================================================ */

import React, { useEffect, useRef } from 'react';

const NODE_COUNT    = 48;
const CONNECT_DIST  = 150;   // max px between connected nodes
const SPEED         = 0.3;   // drift speed
const NODE_RADIUS   = 2.5;

export default function AIBackground({ style = {} }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Respect reduced-motion preference
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Resize handler ──
    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Node factory ──
    function makeNode(w, h) {
      return {
        x:   Math.random() * w,
        y:   Math.random() * h,
        vx:  (Math.random() - 0.5) * SPEED,
        vy:  (Math.random() - 0.5) * SPEED,
        r:   NODE_RADIUS + Math.random() * 1.5,
        // randomly tint cyan or violet
        hue: Math.random() > 0.5 ? '188' : '262',
        pulse: Math.random() * Math.PI * 2,  // phase offset for pulsing
      };
    }

    let nodes = Array.from({ length: NODE_COUNT }, () =>
      makeNode(canvas.width, canvas.height)
    );

    // ── Draw frame ──
    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Update positions
      if (!reduced) {
        nodes.forEach(n => {
          n.pulse += 0.015;
          n.x += n.vx;
          n.y += n.vy;
          // Bounce off edges
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
        });
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            // Alternate cyan/violet for edges based on node hues
            const edgeHue = nodes[i].hue === '188' ? '188' : '262';
            ctx.strokeStyle = `hsla(${edgeHue}, 100%, 65%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const pulse = 0.7 + Math.sin(n.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue}, 100%, 65%, 0.7)`;
        ctx.fill();

        // Glow ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue}, 100%, 65%, 0.06)`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.55,
        ...style,
      }}
    />
  );
}
