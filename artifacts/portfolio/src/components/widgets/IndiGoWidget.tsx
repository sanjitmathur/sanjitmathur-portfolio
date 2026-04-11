import { useEffect, useRef, useCallback } from "react";
import { useInView } from "../useInView";

type EchoMap = Record<string, number>;

const STATIC_CONTACTS = [
  { angle: 28, radius: 34, size: 2.6, id: "AI317" },
  { angle: 64, radius: 19, size: 2.4, id: "UK971" },
  { angle: 104, radius: 30, size: 2.2, id: "6E214" },
  { angle: 155, radius: 22, size: 2.8, id: "IX442" },
  { angle: 208, radius: 33, size: 2.4, id: "SG801" },
  { angle: 264, radius: 26, size: 2.1, id: "QP128" },
  { angle: 314, radius: 36, size: 2.6, id: "AK604" },
] as const;

function angleDiff(a: number, b: number) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface AnimState {
  progress: number;
  heading: number;
  scanPhase: number;
  bank: number;
  pitch: number;
  deviation: number;
  groundspeed: number;
  linkStrength: number;
  echoes: EchoMap;
}

export default function IndiGoWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const inViewRef = useRef(false);
  useEffect(() => { inViewRef.current = inView; }, [inView]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<AnimState>({
    progress: 0.18,
    heading: 124,
    scanPhase: 0,
    bank: 0,
    pitch: 0,
    deviation: 0,
    groundspeed: 468,
    linkStrength: 78,
    echoes: {},
  });

  const toPoint = useCallback((cx: number, cy: number, angleDeg: number, radius: number) => {
    const angle = (angleDeg * Math.PI) / 180;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let t = 0;
    let rafId: number;
    let lastTime = 0;

    const DPR = Math.min(window.devicePixelRatio || 1, 3);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * DPR);
      canvas.height = Math.round(rect.height * DPR);
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    function draw(timestamp: number) {
      rafId = requestAnimationFrame(draw);
      if (!canvas || !ctx) return;
      if (!inViewRef.current) { lastTime = timestamp; return; }

      const dt = Math.min((timestamp - (lastTime || timestamp)) / 1000, 0.05);
      lastTime = timestamp;
      t += dt;

      const W = canvas.width;
      const H = canvas.height;
      const scale = W / 600; // reference width

      // --- Update state ---
      const s = stateRef.current;
      const phase = (Math.sin(t * 0.42) + 1) * 0.5;
      const targetProgress = 0.14 + phase * 0.72;
      s.progress = lerp(s.progress, targetProgress, dt * 3);
      s.heading = Math.round(124 + Math.sin(t * 0.6) * 11);
      s.scanPhase = (t * 0.24) % 1;
      s.bank = Math.sin(t * 1.15) * 13;
      s.pitch = Math.cos(t * 0.95) * 5;
      s.deviation = Math.sin(t * 1.45) * 9;
      s.groundspeed = Math.round(458 + Math.sin(t * 1.1) * 18 + Math.cos(t * 0.5) * 10);
      s.linkStrength = Math.round(78 + Math.sin(t * 1.8) * 7);

      const sweepDeg = s.scanPhase * 360;
      const trackedAngle = 220 - s.progress * 150;
      const trackedRadius = 14 + s.progress * 15;

      const allContacts = [
        ...STATIC_CONTACTS,
        { angle: trackedAngle, radius: trackedRadius, size: 3.2, id: "6E211", tracked: true as const },
      ];

      // Update echoes
      const nextEchoes: EchoMap = {};
      allContacts.forEach((c) => {
        const proximity = angleDiff(sweepDeg, c.angle);
        let intensity = (s.echoes[c.id] ?? 0) * (1 - dt * 3.5);
        const isTracked = "tracked" in c && c.tracked;
        if (proximity < 16 && Math.random() > (isTracked ? 0.06 : 0.34)) {
          intensity = Math.max(intensity, isTracked ? 0.96 : 0.46 + Math.random() * 0.34);
        } else if (!isTracked && Math.random() < 0.012) {
          intensity = Math.max(intensity, 0.12 + Math.random() * 0.16);
        }
        if (intensity < 0.04) intensity = 0;
        nextEchoes[c.id] = intensity;
      });
      s.echoes = nextEchoes;

      // --- Derived values ---
      const altitude = Math.round(s.progress < 0.3 ? 18000 + (s.progress / 0.3) * 18000 : s.progress > 0.74 ? 36000 - ((s.progress - 0.74) / 0.26) * 25000 : 36000);
      const altDisplay = altitude >= 18000 ? `FL${Math.round(altitude / 100)}` : `${altitude}ft`;
      const vs = Math.round(s.progress < 0.3 ? 1800 - s.progress * 1800 : s.progress > 0.74 ? -900 - (s.progress - 0.74) * 3500 : 120 + Math.sin(s.progress * 8) * 140);
      const etaMins = 44 - Math.round(s.progress * 26);
      const distNm = 693 - Math.round(s.progress * 532);
      const nextWP = s.progress < 0.33 ? "BUBNA" : s.progress < 0.68 ? "OSPAK" : "VEMBO";
      const phaseLabel = s.progress < 0.28 ? "Climb Corridor" : s.progress < 0.74 ? "Cruise Monitor" : "Arrival Window";
      const squawk = s.progress < 0.5 ? "3412" : "5074";
      const sector = s.progress < 0.38 ? "Delhi FIR" : s.progress < 0.72 ? "Central Corridor" : "Mumbai Approach";
      const returnsCount = Object.values(s.echoes).filter(v => v > 0.12).length;
      const confidence = 88;

      // --- Layout ---
      const leftPanelW = Math.round(58 * scale);
      const rightPanelW = Math.round(62 * scale);
      const headerH = Math.round(28 * scale);
      const footerH = Math.round(26 * scale);
      const radarAreaX = leftPanelW;
      const radarAreaW = W - leftPanelW - rightPanelW;
      const radarAreaY = headerH;
      const radarAreaH = H - headerH - footerH;
      const radarCx = radarAreaX + radarAreaW * 0.44;
      const radarCy = radarAreaY + radarAreaH * 0.5;
      const radarR = Math.min(radarAreaW * 0.38, radarAreaH * 0.44);

      // --- Clear ---
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#090d0f");
      bgGrad.addColorStop(1, "#07090b");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // --- Header ---
      ctx.fillStyle = "rgba(4,8,10,0.72)";
      ctx.fillRect(0, 0, W, headerH);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, headerH); ctx.lineTo(W, headerH); ctx.stroke();

      const fs = (px: number) => Math.round(px * scale);

      ctx.font = `500 ${fs(9)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      ctx.fillStyle = "#7f8a8f";
      ctx.textBaseline = "middle";
      ctx.fillText("ATC RADAR", 10 * scale, headerH * 0.5);

      const atcW = ctx.measureText("ATC RADAR").width;
      ctx.font = `500 ${fs(8.5)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      ctx.fillStyle = "#c4cdd1";
      ctx.fillText(sector.toUpperCase(), 10 * scale + atcW + 10 * scale, headerH * 0.5);

      // Scan Live pill
      const sectorW = ctx.measureText(sector.toUpperCase()).width;
      const pillX = 10 * scale + atcW + 10 * scale + sectorW + 10 * scale;
      const pillText = "Scan Live";
      ctx.font = `500 ${fs(8)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      const pillTW = ctx.measureText(pillText).width;
      const pillH = 14 * scale;
      const pillY = headerH * 0.5 - pillH / 2;
      ctx.fillStyle = "rgba(31,208,111,0.12)";
      roundRect(ctx, pillX, pillY, pillTW + 10 * scale, pillH, pillH / 2);
      ctx.fill();
      ctx.fillStyle = "#1fd06f";
      ctx.fillText(pillText, pillX + 5 * scale, headerH * 0.5);

      // Right side of header
      ctx.textAlign = "right";
      ctx.font = `500 ${fs(8.5)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      ctx.fillStyle = "#95a3a9";
      ctx.fillText(`ETA ${etaMins}m`, W - 10 * scale, headerH * 0.5);
      const etaW = ctx.measureText(`ETA ${etaMins}m`).width;

      // Logistic Regression pill
      const lrText = "Logistic Regression";
      ctx.font = `500 ${fs(8)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      const lrTW = ctx.measureText(lrText).width;
      const lrPillX = W - 10 * scale - etaW - 10 * scale - lrTW - 12 * scale;
      const lrPillH = 14 * scale;
      const lrPillY = headerH * 0.5 - lrPillH / 2;
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(211,169,91,0.12)";
      ctx.strokeStyle = "rgba(211,169,91,0.18)";
      ctx.lineWidth = 1;
      roundRect(ctx, lrPillX, lrPillY, lrTW + 12 * scale, lrPillH, lrPillH / 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#d3a95b";
      ctx.fillText(lrText, lrPillX + 6 * scale, headerH * 0.5);
      ctx.textAlign = "left";

      // --- Left Panel ---
      const lpGrad = ctx.createLinearGradient(0, headerH, 0, H - footerH);
      lpGrad.addColorStop(0, "rgba(8,12,15,0.85)");
      lpGrad.addColorStop(1, "rgba(6,9,11,0.72)");
      ctx.fillStyle = lpGrad;
      ctx.fillRect(0, headerH, leftPanelW, H - headerH - footerH);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(leftPanelW, headerH); ctx.lineTo(leftPanelW, H - footerH); ctx.stroke();

      const leftData = [
        { label: "FREQ", value: "124.35", color: "#1fd06f" },
        { label: "ALT", value: altDisplay, color: "#1fd06f" },
        { label: "GS", value: `${s.groundspeed}kt`, color: "#edf2f7" },
        { label: "VS", value: `${vs > 0 ? "+" : ""}${vs}`, color: vs >= 0 ? "#d3a95b" : "#f97362" },
      ];

      const leftPad = 8 * scale;
      const leftItemH = (H - headerH - footerH) / leftData.length;
      leftData.forEach((item, i) => {
        const y = headerH + i * leftItemH + leftPad;
        ctx.font = `500 ${fs(6.5)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        ctx.fillStyle = "#4f5a5f";
        ctx.fillText(item.label, leftPad, y + 2 * scale);
        ctx.font = `700 ${fs(11)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        ctx.fillStyle = item.color;
        ctx.fillText(item.value, leftPad, y + 14 * scale);
      });

      // --- Right Panel ---
      const rpX = W - rightPanelW;
      const rpGrad = ctx.createLinearGradient(rpX, headerH, rpX, H - footerH);
      rpGrad.addColorStop(0, "rgba(8,12,15,0.78)");
      rpGrad.addColorStop(1, "rgba(6,9,11,0.7)");
      ctx.fillStyle = rpGrad;
      ctx.fillRect(rpX, headerH, rightPanelW, H - headerH - footerH);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rpX, headerH); ctx.lineTo(rpX, H - footerH); ctx.stroke();

      const rightData = [
        { label: "HDG", value: `${s.heading}`, color: "#d3a95b" },
        { label: "TRACK", value: nextWP, color: "#edf2f7" },
        { label: "SQK", value: squawk, color: "#edf2f7" },
        { label: "NM LEFT", value: `${distNm}`, color: "#1fd06f" },
      ];

      const rightPad = 8 * scale;
      const rightItemH = (H - headerH - footerH) / rightData.length;
      rightData.forEach((item, i) => {
        const y = headerH + i * rightItemH + rightPad;
        ctx.font = `500 ${fs(6.5)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        ctx.fillStyle = "#4f5a5f";
        ctx.fillText(item.label, rpX + rightPad, y + 2 * scale);
        ctx.font = `700 ${fs(11)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        ctx.fillStyle = item.color;
        ctx.fillText(item.value, rpX + rightPad, y + 14 * scale);
      });

      // --- Radar Area Background ---
      const radialBg = ctx.createRadialGradient(radarCx, radarCy, 0, radarCx, radarCy, radarR * 1.6);
      radialBg.addColorStop(0, "rgba(23,46,58,0.18)");
      radialBg.addColorStop(1, "transparent");
      ctx.fillStyle = radialBg;
      ctx.fillRect(radarAreaX, radarAreaY, radarAreaW, radarAreaH);

      // Phase label
      ctx.font = `500 ${fs(7)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      ctx.fillStyle = "#738087";
      ctx.fillText(phaseLabel.toUpperCase(), radarAreaX + 10 * scale, radarAreaY + 12 * scale);

      // Lock label
      ctx.textAlign = "right";
      ctx.font = `500 ${fs(8)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      ctx.fillStyle = "#95a3a9";
      const lockText = "LOCK ";
      ctx.fillText(lockText, radarAreaX + radarAreaW - 46 * scale, radarAreaY + 12 * scale);
      const lockW = ctx.measureText(lockText).width;
      ctx.fillStyle = s.echoes["6E211"] ? "#d8ff73" : "#6f7a6f";
      ctx.fillText("6E 211", radarAreaX + radarAreaW - 10 * scale, radarAreaY + 12 * scale);
      ctx.textAlign = "left";

      // --- Grid lines (subtle) ---
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 0.8 * scale;
      for (let i = 0; i < 9; i++) {
        const x = radarAreaX + (i + 1) * (radarAreaW / 10);
        ctx.beginPath(); ctx.moveTo(x, radarAreaY); ctx.lineTo(x, radarAreaY + radarAreaH); ctx.stroke();
      }
      for (let i = 0; i < 5; i++) {
        const y = radarAreaY + (i + 1) * (radarAreaH / 6);
        ctx.beginPath(); ctx.moveTo(radarAreaX, y); ctx.lineTo(radarAreaX + radarAreaW, y); ctx.stroke();
      }

      // --- Radar scope outer glow ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(radarCx, radarCy, radarR + 4 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(7,17,13,0.52)";
      ctx.fill();
      ctx.strokeStyle = "rgba(34,197,94,0.05)";
      ctx.lineWidth = 1 * scale;
      ctx.stroke();
      ctx.restore();

      // --- Radar scope fill ---
      const scopeGrad = ctx.createRadialGradient(radarCx, radarCy, 0, radarCx, radarCy, radarR);
      scopeGrad.addColorStop(0, "rgba(34,185,110,0.14)");
      scopeGrad.addColorStop(0.75, "rgba(16,46,31,0.18)");
      scopeGrad.addColorStop(1, "rgba(4,11,8,0)");
      ctx.beginPath();
      ctx.arc(radarCx, radarCy, radarR, 0, Math.PI * 2);
      ctx.fillStyle = scopeGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(34,197,94,0.18)";
      ctx.lineWidth = 1.2 * scale;
      ctx.stroke();

      // --- Concentric rings ---
      for (let i = 1; i <= 4; i++) {
        const r = (i / 4) * radarR;
        ctx.beginPath();
        ctx.arc(radarCx, radarCy, r, 0, Math.PI * 2);
        ctx.strokeStyle = i === 4 ? "rgba(34,197,94,0.18)" : "rgba(34,197,94,0.1)";
        ctx.lineWidth = (i === 4 ? 1.2 : 0.9) * scale;
        ctx.stroke();
      }

      // --- Radial spokes ---
      ctx.strokeStyle = "rgba(34,197,94,0.08)";
      ctx.lineWidth = 0.85 * scale;
      for (let i = 0; i < 8; i++) {
        const a = i * 45;
        const p = toPoint(radarCx, radarCy, a, radarR);
        ctx.beginPath(); ctx.moveTo(radarCx, radarCy); ctx.lineTo(p.x, p.y); ctx.stroke();
      }

      // --- Sweep beam (clipped to radar) ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(radarCx, radarCy, radarR, 0, Math.PI * 2);
      ctx.clip();

      const sweepRad = (sweepDeg * Math.PI) / 180;
      const sweepEndX = radarCx + Math.cos(sweepRad) * radarR;
      const sweepEndY = radarCy + Math.sin(sweepRad) * radarR;

      // Sweep arc fill
      const sweepArcAngle = 0.5; // radians
      ctx.beginPath();
      ctx.moveTo(radarCx, radarCy);
      ctx.arc(radarCx, radarCy, radarR, sweepRad - sweepArcAngle, sweepRad);
      ctx.closePath();
      const sweepGrad = ctx.createRadialGradient(radarCx, radarCy, 0, radarCx, radarCy, radarR);
      sweepGrad.addColorStop(0, "rgba(34,197,94,0)");
      sweepGrad.addColorStop(0.55, "rgba(34,197,94,0.08)");
      sweepGrad.addColorStop(1, "rgba(34,197,94,0.28)");
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Sweep line
      ctx.beginPath();
      ctx.moveTo(radarCx, radarCy);
      ctx.lineTo(sweepEndX, sweepEndY);
      ctx.strokeStyle = "rgba(88,255,150,0.38)";
      ctx.lineWidth = 1.4 * scale;
      ctx.stroke();

      // Noise dots
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 48; i++) {
        const a = i * 7.5;
        const r = (i % 6) * 6 + 8;
        const rScaled = (r / 43) * radarR;
        const p = toPoint(radarCx, radarCy, a, rScaled);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,255,154,${0.03 + (i % 5) * 0.01})`;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.restore(); // end radar clip

      // --- Static contacts ---
      STATIC_CONTACTS.forEach((blip) => {
        const intensity = s.echoes[blip.id] ?? 0;
        if (intensity <= 0.05) return;
        const rScaled = (blip.radius / 43) * radarR;
        const p = toPoint(radarCx, radarCy, blip.angle, rScaled);
        const sz = blip.size * scale;

        // Glow
        ctx.save();
        ctx.shadowColor = "#73f0a5";
        ctx.shadowBlur = 6 * scale * intensity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz + intensity * 1.8 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(115,240,165,${0.3 + intensity * 0.7})`;
        ctx.fill();
        ctx.restore();

        // Ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz + (2.5 + intensity * 2.5) * scale, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(115,240,165,${0.08 + intensity * 0.24})`;
        ctx.lineWidth = 0.8 * scale;
        ctx.stroke();
      });

      // --- Tracked contact ---
      const trackedRScaled = (trackedRadius / 43) * radarR;
      const tp = toPoint(radarCx, radarCy, trackedAngle, trackedRScaled);
      const tIntensity = s.echoes["6E211"] ?? 0;
      const tAlpha = 0.18 + tIntensity * 0.82;

      ctx.save();
      ctx.globalAlpha = tAlpha;
      ctx.shadowColor = "#d8ff73";
      ctx.shadowBlur = 8 * scale * tIntensity;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, (3.2 + tIntensity * 1.4) * scale, 0, Math.PI * 2);
      ctx.fillStyle = "#d8ff73";
      ctx.fill();
      ctx.restore();

      if (tIntensity > 0.18) {
        ctx.globalAlpha = tAlpha;
        // Inner ring
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, (8 + tIntensity * 3) * scale, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(216,255,115,0.34)";
        ctx.lineWidth = 1 * scale;
        ctx.stroke();
        // Outer ring
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, (12 + tIntensity * 3.5) * scale, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(216,255,115,0.14)";
        ctx.lineWidth = 0.9 * scale;
        ctx.stroke();

        // Leader line to label
        const labelX = radarAreaX + radarAreaW - 50 * scale;
        const labelY = radarAreaY + 24 * scale;
        ctx.beginPath();
        ctx.moveTo(tp.x + 8 * scale, tp.y - 8 * scale);
        ctx.lineTo(labelX, labelY);
        ctx.strokeStyle = `rgba(216,255,115,${0.08 + tIntensity * 0.18})`;
        ctx.lineWidth = 0.9 * scale;
        ctx.stroke();

        // Label pill
        const lbl = "6E211";
        ctx.font = `700 ${fs(9.5)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        const lblW = ctx.measureText(lbl).width;
        ctx.fillStyle = "rgba(9,16,12,0.84)";
        ctx.strokeStyle = `rgba(216,255,115,${0.1 + tIntensity * 0.18})`;
        ctx.lineWidth = 1 * scale;
        roundRect(ctx, labelX, labelY - 8 * scale, lblW + 12 * scale, 16 * scale, 8 * scale);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#d8ff73";
        ctx.fillText(lbl, labelX + 6 * scale, labelY + 3 * scale);

        ctx.globalAlpha = 1;
      }

      // --- Center dot + crosshair ---
      ctx.beginPath();
      ctx.arc(radarCx, radarCy, 2.2 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "#58e08f";
      ctx.fill();

      ctx.strokeStyle = "rgba(88,224,143,0.3)";
      ctx.lineWidth = 0.9 * scale;
      ctx.beginPath(); ctx.moveTo(radarCx - 7 * scale, radarCy); ctx.lineTo(radarCx + 7 * scale, radarCy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(radarCx, radarCy - 7 * scale); ctx.lineTo(radarCx, radarCy + 7 * scale); ctx.stroke();

      // --- Range labels ---
      ctx.font = `500 ${fs(8)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      ctx.fillStyle = "rgba(88,224,143,0.34)";
      ctx.fillText("60NM", radarCx - radarR - 2 * scale, radarCy - radarR - 5 * scale);
      ctx.fillStyle = "rgba(88,224,143,0.26)";
      ctx.fillText("30NM", radarCx - radarR * 0.3, radarCy - radarR - 5 * scale);
      ctx.fillText("15NM", radarCx + radarR * 0.35, radarCy - radarR - 5 * scale);

      // --- ML Accuracy gauge (between radar and right panel, vertically centered) ---
      const gaugeR = 30 * scale;
      const gapMidX = radarCx + radarR + (rpX - (radarCx + radarR)) / 2;
      const gaugeX = gapMidX;
      const gaugeY = radarCy;

      // Label above
      ctx.textAlign = "center";
      ctx.font = `600 ${fs(6.5)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      ctx.fillStyle = "#6a7980";
      ctx.fillText("ML ACCURACY", gaugeX, gaugeY - gaugeR - 9 * scale);

      // Background circle
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeR + 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(5,10,12,0.82)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1 * scale;
      ctx.stroke();

      // Background ring
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 3.5 * scale;
      ctx.stroke();

      // Value ring
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeR, -Math.PI / 2, -Math.PI / 2 + (confidence / 100) * Math.PI * 2);
      ctx.strokeStyle = "#1fd06f";
      ctx.lineWidth = 3.8 * scale;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.lineCap = "butt";

      // Percentage text
      ctx.textAlign = "center";
      ctx.font = `700 ${fs(17)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
      ctx.fillStyle = "#edf2f7";
      ctx.fillText("88%", gaugeX, gaugeY + 3 * scale);
      ctx.textAlign = "left";

      // --- Footer ---
      ctx.fillStyle = "rgba(4,8,10,0.74)";
      ctx.fillRect(0, H - footerH, W, footerH);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H - footerH); ctx.lineTo(W, H - footerH); ctx.stroke();

      const footerY = H - footerH;
      const footerMidY = footerY + footerH * 0.5;

      const leftFooter = [
        { label: "BANK", value: `${s.bank >= 0 ? "+" : ""}${s.bank.toFixed(1)}°`, color: "#d3a95b" },
        { label: "PITCH", value: `${s.pitch >= 0 ? "+" : ""}${s.pitch.toFixed(1)}°`, color: "#95a3a9" },
        { label: "XTK", value: `${s.deviation >= 0 ? "R" : "L"} ${Math.abs(s.deviation).toFixed(1)}`, color: Math.abs(s.deviation) > 5 ? "#f97362" : "#1fd06f" },
      ];

      let footerX = 10 * scale;
      leftFooter.forEach((item) => {
        ctx.font = `500 ${fs(6)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        ctx.fillStyle = "#4f5a5f";
        ctx.fillText(item.label, footerX, footerMidY - 5 * scale);
        ctx.font = `700 ${fs(9)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        ctx.fillStyle = item.color;
        ctx.fillText(item.value, footerX, footerMidY + 6 * scale);
        footerX += 48 * scale;
      });

      const rightFooter = [
        { label: "LINK", value: `${s.linkStrength}%`, color: "#1fd06f" },
        { label: "RETURNS", value: `${returnsCount}`, color: "#73f0a5" },
        { label: "SSR", value: squawk, color: "#95a3a9" },
      ];

      ctx.textAlign = "right";
      let rFooterX = W - 10 * scale;
      for (let i = rightFooter.length - 1; i >= 0; i--) {
        const item = rightFooter[i];
        ctx.font = `700 ${fs(9)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        const vw = ctx.measureText(item.value).width;
        ctx.font = `500 ${fs(6)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        const lw = ctx.measureText(item.label).width;
        const itemW = Math.max(vw, lw);

        ctx.font = `500 ${fs(6)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        ctx.fillStyle = "#4f5a5f";
        ctx.fillText(item.label, rFooterX, footerMidY - 5 * scale);
        ctx.font = `700 ${fs(9)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
        ctx.fillStyle = item.color;
        ctx.fillText(item.value, rFooterX, footerMidY + 6 * scale);
        rFooterX -= itemW + 24 * scale;
      }
      ctx.textAlign = "left";
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [toPoint]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(120,138,146,0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
