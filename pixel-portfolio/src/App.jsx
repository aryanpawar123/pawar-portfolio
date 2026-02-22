import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import './App.css';

gsap.registerPlugin(InertiaPlugin);

// ==========================================
// 1. DOT GRID HELPERS & COMPONENT
// ==========================================
const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const DotGrid = ({
  dotSize = 16, gap = 32, baseColor = '#5227FF', activeColor = '#5227FF',
  proximity = 150, speedTrigger = 100, shockRadius = 250, shockStrength = 5,
  maxSpeed = 5000, resistance = 750, returnDuration = 1.5, className = '', style
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, speed: 0, lastTime: 0, lastX: 0, lastY: 0 });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;
    const p = new window.Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;
    let rafId;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let style = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath);
        ctx.restore();
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

  useEffect(() => {
    buildGrid();
    let ro = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid);
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      window.addEventListener('resize', buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', buildGrid);
    }
  }, [buildGrid]);

  useEffect(() => {
    const onMove = e => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvasRef.current.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = dot.cx - pr.x + vx * 0.005;
          const pushY = dot.cy - pr.y + vy * 0.005;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, { xOffset: 0, yOffset: 0, duration: returnDuration, ease: 'elastic.out(1,0.75)' });
              dot._inertiaApplied = false;
            }
          });
        }
      }
    };

    const onClick = e => {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, { xOffset: 0, yOffset: 0, duration: returnDuration, ease: 'elastic.out(1,0.75)' });
              dot._inertiaApplied = false;
            }
          });
        }
      }
    };

    const throttledMove = throttle(onMove, 50);
    window.addEventListener('mousemove', throttledMove, { passive: true });
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('click', onClick);
    };
  }, [maxSpeed, speedTrigger, proximity, resistance, returnDuration, shockRadius, shockStrength]);

  return (
    <section className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
};

// ==========================================
// 2. CLICK SPARK COMPONENT (Global Overlay)
// ==========================================
const ClickSpark = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimeout;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    window.addEventListener('resize', handleResize);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    t => {
      switch (easing) {
        case 'linear': return t;
        case 'ease-in': return t * t;
        case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default: return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = timestamp => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeFunc(progress);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  // Global click listener for the sparks
  useEffect(() => {
    const handleClick = e => {
      const now = performance.now();
      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      }));
      sparksRef.current.push(...newSparks);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [sparkCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'block',
        userSelect: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none', // Lets you click "through" it to your buttons!
        zIndex: 9999 // Keeps sparks above everything
      }}
    />
  );
};


// ==========================================
// 3. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [isPunching, setIsPunching] = useState(false);

  const handlePunchEffect = () => {
    setIsPunching(true);
    setTimeout(() => {
      setIsPunching(false);
    }, 300);
  };

  // --- CUSTOM 8-BIT TEXT PROXIMITY EFFECT ---
  useEffect(() => {
    const textElements = document.querySelectorAll('.react-text');
    const triggerRadius = 150; 

    const onMouseMove = throttle((e) => {
      const { clientX: mx, clientY: my } = e;

      textElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(cx - mx, cy - my);

        if (dist < triggerRadius) {
          const intensity = 1 - dist / triggerRadius;
          
          gsap.to(el, {
            scale: 1 + (0.15 * intensity),
            textShadow: `${3 * intensity}px ${3 * intensity}px 0px var(--primary-color)`,
            color: '#333', 
            duration: 0.1,
            overwrite: 'auto',
            transformOrigin: "center center"
          });
        } else {
          gsap.to(el, {
            scale: 1,
            textShadow: `0px 0px 0px transparent`,
            color: '',
            duration: 0.3,
            overwrite: 'auto'
          });
        }
      });
    }, 30); 

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      {/* --- GLOBAL CLICK SPARKS --- */}
      <ClickSpark sparkColor="#FF8C00" sparkSize={12} sparkRadius={25} sparkCount={8} duration={400} />

      {/* --- BACKGROUND LAYER --- */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <DotGrid
          dotSize={2} gap={26} baseColor="#dcdcdc" activeColor="#FF8C00"
          proximity={90} shockRadius={250} shockStrength={5} resistance={400} returnDuration={0.5}
        />
      </div>

      {/* --- MAIN FOREGROUND CONTENT --- */}
      <div className="container fade-in">
        
        {/* HERO SECTION */}
        <div className="hero">
          <img 
            src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Aryan123" 
            alt="Avatar" 
            className={`pixel-avatar ${isPunching ? 'punch-anim' : ''}`} 
            onClick={handlePunchEffect} 
          />
          <h1 style={{ fontSize: '32px', color: 'var(--primary-color)', margin: '15px 0' }}>
            <span className="react-text">Aryan Pawar</span>
          </h1>
          <h3 style={{ fontSize: '18px', color: '#666' }}>
            <span className="react-text">AI & ML Enthusiast</span>
          </h3>
          <p style={{ fontSize: '12px', marginTop: '15px' }}>
            <span className="react-text">Nagpur, Maharashtra, India</span>
          </p>
          
          <div className="social-bar">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aryanpawar19122003@gmail.com" target="_blank" rel="noreferrer" title="Gmail">
              <i className="nes-icon gmail is-medium lively-icon"></i>
            </a>
            <a href="https://www.linkedin.com/in/aryan-pawar-650458290/" target="_blank" rel="noreferrer" title="LinkedIn">
              <i className="nes-icon linkedin is-medium lively-icon"></i>
            </a>
            <a href="https://github.com/aryanpawar123" target="_blank" rel="noreferrer" title="GitHub">
              <i className="nes-icon github is-medium lively-icon"></i>
            </a>
            <a href="tel:+917666330853" title="Call">
              <i className="nes-icon phone is-medium lively-icon"></i>
            </a>
          </div>
          
          <div className="contact-details">
            <div><span className="react-text">aryanpawar19122003@gmail.com</span></div>
            <div style={{ marginTop: '5px' }}>
              <span className="react-text">+91 76663 30853</span>
            </div>
          </div>
        </div>

        {/* PROFILE SECTION */}
        <section className="nes-container is-rounded with-title">
          <p className="title" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--primary-color)' }}>
            <span className="react-text">Hero Dialogue (Profile)</span>
          </p>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <i className="nes-icon twitch is-large lively-icon"></i>
            <p className="small-text">
              <span className="react-text">Passionate and dedicated AI & ML student at Ramdeobaba College of Engineering. A quick learner with a hands-on approach to solving problems through data-driven insights. Interested in developing systems that combine creativity and technology.</span>
            </p>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <h2 className="section-header"> 
          <i className="nes-icon star is-medium lively-icon"></i> 
          <span className="react-text">Skill Tree (Skills)</span>
        </h2>
        
        <div className="skills-container">
          <div className="skill-category">
            <div className="skill-title"><span className="react-text">Languages</span></div>
            <div>
              <span className="nes-badge"><span className="is-dark"><span className="react-text">Python</span></span></span>
              <span className="nes-badge"><span className="is-primary"><span className="react-text">HTML/CSS</span></span></span>
              <span className="nes-badge"><span className="is-success"><span className="react-text">SQL</span></span></span>
            </div>
          </div>

          <div className="skill-category">
            <div className="skill-title"><span className="react-text">Frameworks & Libs</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              <span className="nes-badge"><span className="is-warning"><span className="react-text">TensorFlow</span></span></span>
              <span className="nes-badge"><span className="is-warning"><span className="react-text">Keras</span></span></span>
              <span className="nes-badge"><span className="is-error"><span className="react-text">Streamlit</span></span></span>
              <span className="nes-badge"><span className="is-primary"><span className="react-text">Pandas</span></span></span>
              <span className="nes-badge"><span className="is-primary"><span className="react-text">NumPy</span></span></span>
              <span className="nes-badge"><span className="is-primary"><span className="react-text">Scikit-learn</span></span></span>
              <span className="nes-badge"><span className="is-primary"><span className="react-text">Matplotlib</span></span></span>
            </div>
          </div>

          <div className="skill-category">
            <div className="skill-title"><span className="react-text">Tools</span></div>
            <div>
              <span className="nes-badge"><span className="is-dark"><span className="react-text">Git</span></span></span>
              <span className="nes-badge"><span className="is-dark"><span className="react-text">VS Code</span></span></span>
              <span className="nes-badge"><span className="is-success"><span className="react-text">MySQL</span></span></span>
              <span className="nes-badge"><span className="is-warning"><span className="react-text">Colab</span></span></span>
              <span className="nes-badge"><span className="is-warning"><span className="react-text">Jupyter</span></span></span>
            </div>
          </div>

          <div className="skill-category">
            <div className="skill-title"><span className="react-text">Concepts</span></div>
            <div>
              <span className="nes-badge"><span className="is-error"><span className="react-text">Deep Learning</span></span></span>
              <span className="nes-badge"><span className="is-error"><span className="react-text">NLP</span></span></span>
              <span className="nes-badge"><span className="is-error"><span className="react-text">CNN/LSTM</span></span></span>
              <span className="nes-badge"><span className="is-error"><span className="react-text">Comp. Vision</span></span></span>
            </div>
          </div>
        </div>

        {/* EDUCATION SECTION */}
        <h2 className="section-header">
          <i className="nes-icon trophy is-medium lively-icon"></i> 
          <span className="react-text">Quest Map (Education)</span>
        </h2>
        <div className="roadmap">
          <div className="roadmap-item">
            <p style={{ fontSize: '14px', color: 'var(--primary-color)' }}><span className="react-text">B.Tech in AI & ML</span></p>
            <p style={{ fontSize: '12px' }}><span className="react-text">Ramdeobaba College of Engineering</span></p>
            <p style={{ fontSize: '10px' }}><span className="react-text">2022 - 2026 | Nagpur</span></p>
          </div>
          <div className="roadmap-item">
            <p style={{ fontSize: '14px', color: 'var(--primary-color)' }}><span className="react-text">Higher Secondary (HSC)</span></p>
            <p style={{ fontSize: '12px' }}><span className="react-text">Macro Vision Academy</span></p>
            <p style={{ fontSize: '10px' }}><span className="react-text">2022 | Score: 80.89%</span></p>
          </div>
          <div className="roadmap-item">
            <p style={{ fontSize: '14px', color: 'var(--primary-color)' }}><span className="react-text">Secondary School (SSC)</span></p>
            <p style={{ fontSize: '12px' }}><span className="react-text">Bhavan's Civil Lines</span></p>
            <p style={{ fontSize: '10px' }}><span className="react-text">2020 | Score: 88%</span></p>
          </div>
        </div>

        {/* EXPERIENCE SECTION */}
        <h2 className="section-header">
          <i className="nes-icon coin is-medium lively-icon"></i> 
          <span className="react-text">Guild Quests (Experience)</span>
        </h2>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="card-title"><span className="react-text">Frontend Developer Intern</span></div>
            <i className="nes-icon coin is-small lively-icon"></i>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 'bold' }}><span className="react-text">Habitroo Archspace Pvt. Ltd.</span></p>
          <div className="small-text" style={{ marginTop: '10px' }}>
            <span className="react-text">• Designed responsive UI components using HTML, CSS, and JS.</span><br />
            <span className="react-text" style={{ marginTop: '5px' }}>• Developed a modern portfolio website for architecture projects.</span>
          </div>
          <a href="https://www.habitroo.com/" target="_blank" rel="noreferrer" className="nes-btn is-primary small-text" style={{ marginTop: '15px' }}>
            <span className="react-text">Visit Website &gt;</span>
          </a>
        </div>

        {/* PROJECTS SECTION */}
        <h2 className="section-header">
          <i className="nes-icon close is-medium lively-icon"></i> 
          <span className="react-text">Inventory (Projects)</span>
        </h2>
        
        <div className="card">
          <div className="card-title"><span className="react-text">Blind Assistance System</span></div>
          <span className="card-tech"><span className="react-text">OpenCV, YOLOv10, PyTorch, Streamlit</span></span>
          <p className="small-text">
            <span className="react-text">Real-time object detection and distance-estimation. Features Voice-Controlled AI Navigation with TTS & Speech Recognition for hands-free control.</span>
          </p>
          <a href="https://github.com/aryanpawar123/blind-assistance-system" target="_blank" rel="noreferrer" className="nes-btn is-warning small-text" style={{ marginTop: '15px' }}>
            <span className="react-text">Github Repo &gt;</span>
          </a>
        </div>

        <div className="card">
          <div className="card-title"><span className="react-text">Weather Report Generator</span></div>
          <span className="card-tech"><span className="react-text">LLM, Python, OpenAI API</span></span>
          <p className="small-text">
            <span className="react-text">AI-powered weather analysis platform using LLMs to generate personalized, natural-language weather summaries based on users' daily plans.</span>
          </p>
          <a href="https://github.com/arya54/weather-report-generator" target="_blank" rel="noreferrer" className="nes-btn is-warning small-text" style={{ marginTop: '15px' }}>
            <span className="react-text">Github Repo &gt;</span>
          </a>
        </div>

        <div className="card">
          <div className="card-title"><span className="react-text">Image Caption Generator</span></div>
          <span className="card-tech"><span className="react-text">Deep Learning, CNN, LSTM</span></span>
          <p className="small-text">
            <span className="react-text">End-to-end deep learning model for automatic image caption generation using CNNs for visual feature extraction and an attention-based LSTM decoder.</span>
          </p>
          <a href="https://github.com/aryanpawar123/image-caption-generator" target="_blank" rel="noreferrer" className="nes-btn is-warning small-text" style={{ marginTop: '15px' }}>
            <span className="react-text">Github Repo &gt;</span>
          </a>
        </div>

        {/* CERTIFICATES SECTION */}
        <h2 className="section-header"> 
          <i className="nes-icon like is-medium lively-icon"></i> 
          <span className="react-text">Achievements (Certificates)</span>
        </h2>
        <div className="cert-grid">
          <div className="cert-card">
            <i className="nes-icon trophy is-large lively-icon" style={{ margin: '0 auto 10px' }}></i>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}><span className="react-text">Oracle GenAI Professional</span></p>
            <a href="https://catalog-education.oracle.com/ords/certview/sharebadge?id=99006C725A8B28FE1D2E6DF8DC38AA6B25C210F68EAD3F2C394919752EFF47B8" target="_blank" rel="noreferrer" className="nes-btn is-warning is-small">
              <span className="react-text">View</span>
            </a>
          </div>
          <div className="cert-card">
            <i className="nes-icon coin is-large lively-icon" style={{ margin: '0 auto 10px' }}></i>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}><span className="react-text">IBM GenAI Engineering</span></p>
            <a href="https://www.credly.com/badges/1a43872f-1ed4-4a73-8892-65e32a2c0112" target="_blank" rel="noreferrer" className="nes-btn is-primary is-small">
              <span className="react-text">View</span>
            </a>
          </div>
          <div className="cert-card">
            <i className="nes-icon star is-large lively-icon" style={{ margin: '0 auto 10px' }}></i>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}><span className="react-text">IBM GenAI Specialization</span></p>
            <a href="https://www.coursera.org/account/accomplishments/specialization/XILFJS0NHMY5" target="_blank" rel="noreferrer" className="nes-btn is-success is-small">
              <span className="react-text">View</span>
            </a>
          </div>
          <div className="cert-card">
            <i className="nes-icon like is-large lively-icon" style={{ margin: '0 auto 10px' }}></i>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}><span className="react-text">GenAI Coursework</span></p>
            <a href="https://www.coursera.org/account/accomplishments/verify/N92QV54JXWHU" target="_blank" rel="noreferrer" className="nes-btn is-error is-small">
              <span className="react-text">View</span>
            </a>
          </div>
        </div>

        <footer style={{ textAlign: 'center', fontSize: '10px', marginTop: '60px' }}>
          <p><span className="react-text">Press Start to Connect</span></p>
          <p style={{ marginTop: '10px' }}><span className="react-text">© 2026 Aryan Pawar</span></p>
        </footer>

      </div>
    </>
  );
}