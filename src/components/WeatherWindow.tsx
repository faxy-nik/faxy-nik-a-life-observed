import { useEffect, useRef, useState } from "react";

type Weather = "sunrise" | "day" | "sunset" | "night" | "rain" | "cloudy" | "storm" | "aurora";

const EMOTIONAL_WEATHER: Record<string, Weather> = {
  hero: "sunset", who: "day", stats: "cloudy", traits: "sunrise",
  mind: "aurora", people: "night", timeline: "sunset",
  philosophy: "aurora", learned: "sunrise", letter: "rain", final: "night",
};

const BIRDS = ["M0,10 Q5,2 10,10 Q15,18 20,10", "M30,15 Q35,7 40,15 Q45,23 50,15", "M60,8 Q65,0 70,8 Q75,16 80,8"];
const CLOUDS = [{ x: 10, y: 10, w: 40, h: 8 }, { x: 40, y: 20, w: 50, h: 6 }, { x: 65, y: 5, w: 30, h: 7 }];
const STARS = Array.from({ length: 30 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 1.5 + 0.5 }));

function getWeatherByHour(hour: number): Weather {
  if (hour >= 5 && hour < 8) return "sunrise";
  if (hour >= 8 && hour < 17) return Math.random() > 0.6 ? "cloudy" : "day";
  if (hour >= 17 && hour < 20) return "sunset";
  if (hour >= 20 || hour < 5) { const r = Math.random(); if (r < 0.5) return "night"; if (r < 0.75) return "rain"; return "storm"; }
  return "day";
}

export function WeatherWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [weather, setWeather] = useState<Weather>(() => getWeatherByHour(new Date().getHours()));
  const frameRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      for (const [id, w] of Object.entries(EMOTIONAL_WEATHER)) {
        const el = document.getElementById(id); if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.3) { setWeather(w); return; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, w = 0, h = 0;
    const dpr = 1;
    let raindrops: { x: number; y: number; speed: number; len: number }[] = [];
    let birdOffset = 0, cloudOffset = 0;
    let visible = true;

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    const resize = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr); };
    resize();
    window.addEventListener("resize", resize);

    if (weather === "rain" || weather === "storm") {
      raindrops = Array.from({ length: 40 }, () => ({ x: Math.random() * w, y: Math.random() * h, speed: 4 + Math.random() * 6, len: 10 + Math.random() * 15 }));
    }

    const drawScene = () => {
      raf = requestAnimationFrame(drawScene);
      frameRef.current++;
      if (!visible || frameRef.current % 2 !== 0) return;
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createLinearGradient(0, 0, 0, h);
      const c: Record<string, [string, string, string?, string?]> = {
        sunrise: ["#1a1a2e","#e2725b","#f4a261"], day: ["#87CEEB","#B0E0E6"],
        sunset: ["#2d1b3d","#c76b4a","#e8a87c"], night: ["#0a0a1a","#1a1a2e"],
        rain: ["#4a4a5a","#2a2a3a"], cloudy: ["#b0b0b0","#d0d0c0"],
        storm: ["#1a1a2a","#2a2a3a"],
        aurora: ["#0a0a1a","#0a1a2a","#0a2a1a","#0a0a1a"],
      };
      const colors = c[weather] || c.day;
      colors.forEach((col, i) => { if (col) g.addColorStop(i / (colors.length - 1 || 1), col); });
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (["night","storm"].includes(weather)) {
        for (const s of STARS) {
          ctx.beginPath();
          ctx.arc(s.x/100*w, s.y/100*h, s.size, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${0.3+0.2*Math.sin(frameRef.current*0.02+s.x)})`;
          ctx.fill();
        }
      }
      if (weather === "sunrise") { ctx.beginPath(); ctx.arc(w*0.5, h*0.7, 25, 0, Math.PI*2); ctx.fillStyle = "#f4a261"; ctx.fill(); ctx.beginPath(); ctx.arc(w*0.5, h*0.7+5, 30, 0, Math.PI*2); ctx.fillStyle = "rgba(244,162,97,0.15)"; ctx.fill(); }
      if (["day","sunset","cloudy"].includes(weather)) {
        cloudOffset = (cloudOffset+0.2)%(w*2);
        for (const c of CLOUDS) {
          const cx = ((c.x/100)*w+cloudOffset)%(w+100)-50;
          ctx.beginPath(); ctx.ellipse(cx, c.y/100*h, c.w, c.h, 0, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,0.15)`; ctx.fill();
          ctx.beginPath(); ctx.ellipse(cx+15, c.y/100*h-3, c.w*0.7, c.h*0.7, 0, 0, Math.PI*2); ctx.fill();
        }
      }
      if (["day","sunset"].includes(weather)) {
        birdOffset = (birdOffset+0.5)%(w*2);
        for (let i=0;i<BIRDS.length;i++) {
          const bx = (birdOffset+i*80)%(w*2)-50, by = 15+i*12;
          ctx.beginPath();
          const pts = BIRDS[i].match(/[QM][\d,]+/g)?.map(s=>{const[x,y]=s.slice(1).split(",").map(Number);return{x,y};})||[];
          if (pts.length) { ctx.moveTo(bx+pts[0].x,by+pts[0].y); for(let j=1;j<pts.length;j+=2){if(pts[j+1])ctx.quadraticCurveTo(bx+pts[j].x,by+pts[j].y,bx+pts[j+1].x,by+pts[j+1].y);} }
          ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth=1.2; ctx.stroke();
        }
      }
      if (["rain","storm"].includes(weather)) {
        for (const d of raindrops) {
          d.y += d.speed*(weather==="storm"?1.8:1); d.x += weather==="storm"?Math.sin(frameRef.current*0.02+d.y*0.01)*2:0;
          if (d.y>h){d.y=-d.len;d.x=Math.random()*w;}
          ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x-1,d.y+d.len);
          ctx.strokeStyle=`rgba(200,200,255,${weather==="storm"?0.5:0.2})`; ctx.lineWidth=1; ctx.stroke();
        }
      }
      if (weather==="storm") {
        if (Math.random()>0.98){ctx.beginPath();ctx.moveTo(Math.random()*w,0);ctx.lineTo(Math.random()*w+20,h*0.3+Math.random()*h*0.2);ctx.strokeStyle=`rgba(255,255,200,${0.2+Math.random()*0.3})`;ctx.lineWidth=1.5;ctx.stroke();}
      }
      if (weather==="aurora") {
        for (let i=0;i<3;i++){const o=frameRef.current*0.002+i*2;ctx.beginPath();for(let x=0;x<w;x+=3){const y=h*0.2+Math.sin(x*0.008+o)*20+Math.sin(x*0.015+o*1.5)*10;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle=`rgba(${100+i*50},255,${200+i*20},${0.05+0.03*Math.sin(frameRef.current*0.01+i)})`;ctx.lineWidth=15-i*4;ctx.globalAlpha=0.3;ctx.stroke();ctx.globalAlpha=1;}
      }
    };
    drawScene();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [weather]);

  return (
    <div className="weather-window" aria-hidden>
      <canvas ref={canvasRef} />
      <style>{`
        .weather-window { position:fixed; bottom:80px; right:40px; width:120px; height:80px; border-radius:8px; overflow:hidden; z-index:2; opacity:0.12; transition:opacity 2s; pointer-events:none; border:1px solid rgba(255,255,255,0.06); }
        .weather-window::before { content:""; position:absolute; inset:0; border-radius:8px; box-shadow:inset 0 0 20px rgba(0,0,0,0.5); z-index:1; }
        .weather-window canvas { width:100%; height:100%; display:block; }
        .weather-window:hover { opacity:0.25; }
      `}</style>
    </div>
  );
}
