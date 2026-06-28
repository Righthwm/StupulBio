"use client";

import { useId, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";

function shade(hex: string, pct: number): string {
  const n = parseInt(hex.slice(1), 16);
  const t = pct < 0 ? 0 : 255;
  const p = Math.abs(pct);
  const r = Math.round((t - ((n >> 16) & 255)) * p + ((n >> 16) & 255));
  const g = Math.round((t - ((n >> 8) & 255)) * p + ((n >> 8) & 255));
  const b = Math.round((t - (n & 255)) * p + (n & 255));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/* Embossed facet tabs pressed into the glass — widths shrink toward the
   edges to read as perspective around the cylinder. */
const FACETS = [
  { cx: 56, w: 12 },
  { cx: 78, w: 16 },
  { cx: 100, w: 20 },
  { cx: 122, w: 22 },
  { cx: 144, w: 20 },
  { cx: 166, w: 16 },
  { cx: 186, w: 12 },
];

function FacetRow({ y, h, scale = 1 }: { y: number; h: number; scale?: number }) {
  return (
    <g>
      {FACETS.map(({ cx, w }) => {
        const fw = w * scale;
        const fx = 120 + (cx - 120) * scale;
        return (
          <g key={cx}>
            <rect x={fx - fw / 2} y={y} width={fw} height={h} rx="3" fill="#FFFFFF" opacity="0.07" />
            <rect x={fx - fw / 2} y={y} width={fw} height={h} rx="3" fill="none" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.22" />
            <line x1={fx - fw / 2 + 1.5} y1={y + h - 1} x2={fx + fw / 2 - 1.5} y2={y + h - 1} stroke="#000000" strokeWidth="1" opacity="0.14" />
          </g>
        );
      })}
    </g>
  );
}

function LidDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <radialGradient id={`lidTop-${uid}`} cx="42%" cy="35%" r="80%">
        <stop offset="0%" stopColor="#F2C24E" />
        <stop offset="45%" stopColor="#E8A93A" />
        <stop offset="80%" stopColor="#D88A20" />
        <stop offset="100%" stopColor="#B56C12" />
      </radialGradient>
      <linearGradient id={`lidSkirt-${uid}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#9A5C0E" />
        <stop offset="15%" stopColor="#E8A93A" />
        <stop offset="40%" stopColor="#C87C18" />
        <stop offset="60%" stopColor="#F0B848" />
        <stop offset="85%" stopColor="#B56C12" />
        <stop offset="100%" stopColor="#8A4E0A" />
      </linearGradient>
      <filter id={`lb1-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1" />
      </filter>
      <clipPath id={`lidClip-${uid}`}>
        <ellipse cx="120" cy="30" rx="74" ry="14" />
      </clipPath>
    </defs>
  );
}

function LidArt({ uid }: { uid: string }) {
  return (
    <g>
      {/* Skirt */}
      <path d="M46 30 L44 49 Q44 54 51 54 L189 54 Q196 54 196 49 L194 30 Z" fill={`url(#lidSkirt-${uid})`} />
      {/* Twist-off flutes */}
      {[52, 61, 70, 79, 88, 97, 106, 115, 124, 133, 142, 151, 160, 169, 178, 187].map((x) => (
        <line key={x} x1={x} y1="34" x2={x} y2="52" stroke="#7A4408" strokeWidth="1" opacity="0.3" />
      ))}
      {/* Dome top */}
      <ellipse cx="120" cy="30" rx="74" ry="14" fill={`url(#lidTop-${uid})`} />
      <ellipse cx="120" cy="30" rx="74" ry="14" fill="none" stroke="#8A4E0A" strokeWidth="1" opacity="0.5" />
      {/* Honeycomb print on the tin */}
      <g clipPath={`url(#lidClip-${uid})`} opacity="0.25">
        {[
          [76, 27], [98, 22], [120, 27], [142, 22], [164, 27],
          [87, 35], [109, 38], [131, 38], [153, 35],
        ].map(([hx, hy], i) => {
          const pts = Array.from({ length: 6 }, (_, k) => {
            const a = (Math.PI / 3) * k - Math.PI / 6;
            return `${hx + 8 * Math.cos(a)},${hy + 5 * Math.sin(a)}`;
          }).join(" ");
          return <polygon key={i} points={pts} fill="none" stroke="#8A4E0A" strokeWidth="1.1" />;
        })}
      </g>
      {/* Specular sweep on the tin */}
      <ellipse cx="98" cy="25" rx="34" ry="6" fill="#FFF3CE" opacity="0.45" filter={`url(#lb1-${uid})`} transform="rotate(-6 98 25)" />
      {/* Bee printed on the lid */}
      <g transform="translate(120 29)">
        <ellipse cx="0" cy="1" rx="6" ry="3.6" fill="#4A2E0C" />
        <path d="M-2 -2 Q-2.6 1 -2 4 M1.5 -2.2 Q0.9 1 1.5 4.2" stroke="#E8A93A" strokeWidth="1.3" fill="none" opacity="0.9" />
        <circle cx="-7.5" cy="0" r="2.6" fill="#4A2E0C" />
        <path d="M-9 -2 Q-10.5 -4.5 -10 -6 M-8 -2.5 Q-8.8 -5 -8 -6.5" stroke="#4A2E0C" strokeWidth="0.7" fill="none" strokeLinecap="round" />
        <ellipse cx="1" cy="-4.5" rx="5" ry="2.6" fill="#FFF3CE" opacity="0.75" transform="rotate(-18 1 -4.5)" />
        <ellipse cx="4.5" cy="-3.8" rx="4" ry="2" fill="#FFF3CE" opacity="0.55" transform="rotate(-8 4.5 -3.8)" />
        <path d="M7 1.5 L9.5 2 L7.2 2.8 Z" fill="#4A2E0C" />
      </g>
    </g>
  );
}

/** Standalone lid layer — same viewBox as HoneyJar so it overlays perfectly. */
export function JarLid({ width = 110, className }: { width?: number; className?: string }) {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg
      width={width}
      height={Math.round((width * 320) / 240)}
      viewBox="0 0 240 320"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <LidDefs uid={uid} />
      <LidArt uid={uid} />
    </svg>
  );
}

interface HoneyJarProps {
  color: string;
  width?: number;
  className?: string;
  variant?: "product" | "hero";
  showLid?: boolean;
  /** 0 = full, 1 = empty. Pass a scroll-linked MotionValue to drain the jar. */
  drain?: MotionValue<number>;
  /** Jar tilt in degrees (the CSS rotation applied outside). The honey
   *  surface counter-rotates so it stays level with the world. */
  tilt?: MotionValue<number>;
}

export function HoneyJar({
  color,
  width = 110,
  className,
  variant = "product",
  showLid = true,
  drain,
  tilt,
}: HoneyJarProps) {
  const uid = useId().replace(/[:]/g, "");
  const light = shade(color, 0.4);
  const lighter = shade(color, 0.62);
  const dark = shade(color, -0.32);
  const darker = shade(color, -0.55);

  // Drain plumbing. The clip's cut line is kept horizontal in WORLD space:
  // the jar is rotated by `tilt` outside this SVG, so the clip counter-rotates
  // by -tilt around the jar's center (120,160) and then slides down by T.
  // Net on screen: a horizontal honey surface at height T that sweeps from
  // above the jar (full) to past the mouth — when tilted beyond 90°, the
  // mouth is the lowest point, so the last honey drains toward the mouth.
  const fallbackLevel = useMotionValue(0);
  const fallbackTilt = useMotionValue(0);
  const level = drain ?? fallbackLevel;
  const tiltMV = tilt ?? fallbackTilt;
  const cutT = useTransform(level, [0, 1], [24, 202]);
  const mouthHoneyO = useTransform(level, [0.9, 1], [1, 0]);
  const fullMeniscusO = useTransform(level, [0, 0.02], [1, 0]);

  const clipRectRef = useRef<SVGRectElement>(null);
  const surfaceRef = useRef<SVGGElement>(null);
  const applyCut = () => {
    const tr = `rotate(${-tiltMV.get()} 120 160) translate(0 ${cutT.get()})`;
    clipRectRef.current?.setAttribute("transform", tr);
    surfaceRef.current?.setAttribute("transform", tr);
  };
  useMotionValueEvent(cutT, "change", applyCut);
  useMotionValueEvent(tiltMV, "change", applyCut);

  const interiorD =
    "M58 64 L182 64 Q182 72 186 76 Q206 88 210 112 L210 248 Q210 276 186 286 Q160 291 120 291 Q80 291 54 286 Q30 276 30 248 L30 112 Q34 88 54 76 Q58 72 58 64 Z";

  return (
    <svg
      width={width}
      height={Math.round((width * 320) / 240)}
      viewBox="0 0 240 320"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Honey — backlit, bright core */}
        <radialGradient id={`honey-${uid}`} cx="38%" cy="30%" r="90%">
          <stop offset="0%" stopColor={lighter} />
          <stop offset="40%" stopColor={light} />
          <stop offset="75%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        {/* Glass sheet in front of the honey */}
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="18%" stopColor="#FFFFFF" stopOpacity="0.03" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.06" />
          <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.13" />
        </linearGradient>
        {/* Paper label */}
        <linearGradient id={`label-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D9CCAE" />
          <stop offset="10%" stopColor="#F2E8CF" />
          <stop offset="90%" stopColor="#EFE4C9" />
          <stop offset="100%" stopColor="#CCBE9E" />
        </linearGradient>
        <filter id={`b1-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id={`b3-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={`b8-${uid}`} x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      {showLid && <LidDefs uid={uid} />}

      {/* Cast shadow */}
      <ellipse cx="121" cy="298" rx="84" ry="9" fill="#000000" opacity="0.5" filter={`url(#b3-${uid})`} />

      {/* Warm backlight glow */}
      <ellipse cx="120" cy="180" rx="100" ry="110" fill={light} opacity="0.16" filter={`url(#b8-${uid})`} />

      {/* ===== HONEY (interior) ===== */}
      <clipPath id={`drainClip-${uid}`}>
        <rect
          ref={clipRectRef}
          x="-400"
          y="0"
          width="1040"
          height="900"
          transform="rotate(0 120 160) translate(0 24)"
        />
      </clipPath>
      <clipPath id={`interior-${uid}`}>
        <path d={interiorD} />
      </clipPath>
      <g clipPath={`url(#drainClip-${uid})`}>
        <path d={interiorD} fill={`url(#honey-${uid})`} />
        {/* Internal caustics */}
        <ellipse cx="92" cy="200" rx="26" ry="52" fill={light} opacity="0.3" filter={`url(#b8-${uid})`} />
        <ellipse cx="170" cy="248" rx="14" ry="24" fill={darker} opacity="0.35" filter={`url(#b3-${uid})`} />
        {/* Bright base ring — light pooling at the bottom like in the photo */}
        <ellipse cx="120" cy="282" rx="74" ry="8" fill={light} opacity="0.4" filter={`url(#b3-${uid})`} />
      </g>
      {/* Honey surface — always level with the world, clipped to the jar interior */}
      <g clipPath={`url(#interior-${uid})`}>
        <g ref={surfaceRef} transform="rotate(0 120 160) translate(0 24)">
          <rect x="-400" y="-7" width="1040" height="7" fill={lighter} opacity="0.9" />
          <rect x="-400" y="-1.5" width="1040" height="1.5" fill={shade(color, 0.75)} opacity="0.7" />
        </g>
      </g>
      {/* Static meniscus for the full jar (hidden once draining starts) */}
      <motion.g style={{ opacity: fullMeniscusO }}>
        <ellipse cx="120" cy="64" rx="62" ry="6" fill={lighter} opacity="0.85" />
        <ellipse cx="120" cy="64" rx="62" ry="6" fill="none" stroke={shade(color, 0.75)} strokeWidth="0.9" opacity="0.6" />
      </motion.g>

      {/* ===== GLASS (in front of honey) ===== */}
      <path
        d={`M54 56 L186 56 L186 66 Q186 72 190 76 Q212 90 214 114 L214 248 Q214 280 188 290 Q162 296 120 296 Q78 296 52 290 Q26 280 26 248 L26 114 Q28 90 50 76 Q54 72 54 66 Z`}
        fill={`url(#glass-${uid})`}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.2"
      />

      {/* Screw threads on the neck */}
      <path d="M56 60 Q120 66 184 60" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.25" fill="none" />
      <path d="M55 68 Q120 74 185 68" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.18" fill="none" />

      {/* Embossed facet rows — upper and lower, like the reference jar */}
      <FacetRow y={120} h={26} />
      <FacetRow y={248} h={22} scale={0.93} />

      {/* Vertical specular streaks */}
      <path d="M46 86 Q34 182 46 278" stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="9" strokeLinecap="round" filter={`url(#b1-${uid})`} />
      <path d="M60 80 Q52 130 55 180" stroke="#FFFFFF" strokeOpacity="0.13" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M195 90 Q206 182 194 276" stroke="#FFFFFF" strokeOpacity="0.13" strokeWidth="5" strokeLinecap="round" filter={`url(#b1-${uid})`} />
      {/* Shoulder rim light */}
      <path d="M52 78 Q32 90 28 114" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.28" fill="none" />
      <path d="M188 78 Q208 90 212 114" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.22" fill="none" />
      {/* Base edge highlight */}
      <path d="M40 286 Q80 294 120 294 Q160 294 200 286" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.2" fill="none" />

      {/* ===== TIN LID (orange, honeycomb print, bee on top) ===== */}
      {showLid ? (
        <>
          {/* Shadow under lid skirt */}
          <ellipse cx="120" cy="56" rx="74" ry="5" fill="#000000" opacity="0.3" filter={`url(#b1-${uid})`} />
          <LidArt uid={uid} />
        </>
      ) : (
        <>
          {/* Open mouth — glass rim */}
          <ellipse cx="120" cy="57" rx="66" ry="8" fill="rgba(0,0,0,0.22)" />
          <ellipse cx="120" cy="57" rx="66" ry="8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" />
          <motion.ellipse cx="120" cy="59" rx="58" ry="6" fill={shade(color, 0.5)} style={{ opacity: mouthHoneyO }} />
        </>
      )}

      {/* ===== PAPER LABEL ===== */}
      {variant === "product" ? (
        <>
          <rect x="66" y="156" width="108" height="76" rx="3.5" fill="#000000" opacity="0.2" transform="translate(2 2.5)" filter={`url(#b1-${uid})`} />
          <rect x="66" y="156" width="108" height="76" rx="3.5" fill={`url(#label-${uid})`} />
          <rect x="70" y="160" width="100" height="68" rx="2" fill="none" stroke="#A8845A" strokeWidth="0.9" opacity="0.65" />
          {/* Hex + bee mark */}
          <polygon points="120,165 125,168 125,174 120,177 115,174 115,168" fill="none" stroke="#8F6606" strokeWidth="0.9" />
          <ellipse cx="120" cy="171.5" rx="2.6" ry="1.8" fill="#8F6606" />
          <circle cx="120" cy="169" r="1.3" fill="#8F6606" />
          <text x="120" y="196" textAnchor="middle" fontSize="13" fontWeight="600" letterSpacing="1" fill="#3E2C10"
            style={{ fontFamily: "var(--font-cormorant-var), 'Cormorant Garamond', Georgia, serif" }}>
            FAGURUL
          </text>
          <text x="120" y="212" textAnchor="middle" fontSize="11" fontWeight="500" letterSpacing="2.5" fill="#3E2C10"
            style={{ fontFamily: "var(--font-cormorant-var), 'Cormorant Garamond', Georgia, serif" }}>
            DE AUR
          </text>
          <line x1="88" y1="218" x2="152" y2="218" stroke="#A8845A" strokeWidth="0.7" />
          <text x="120" y="225.5" textAnchor="middle" fontSize="5.4" letterSpacing="1.6" fill="#8A7048"
            style={{ fontFamily: "var(--font-inter-var), Inter, sans-serif" }}>
            MIERE NATURALĂ
          </text>
        </>
      ) : (
        <>
          <rect x="58" y="148" width="124" height="94" rx="4" fill="#000000" opacity="0.22" transform="translate(2.5 3)" filter={`url(#b1-${uid})`} />
          <rect x="58" y="148" width="124" height="94" rx="4" fill={`url(#label-${uid})`} />
          <rect x="63" y="153" width="114" height="84" rx="2.5" fill="none" stroke="#A8845A" strokeWidth="1" opacity="0.7" />
          <rect x="66" y="156" width="108" height="78" rx="2" fill="none" stroke="#A8845A" strokeWidth="0.5" opacity="0.45" />
          {/* Hex + bee mark */}
          <polygon points="120,160 126,163.5 126,170.5 120,174 114,170.5 114,163.5" fill="none" stroke="#8F6606" strokeWidth="1" />
          <ellipse cx="120" cy="168" rx="3" ry="2" fill="#8F6606" />
          <circle cx="120" cy="165.2" r="1.5" fill="#8F6606" />
          <text x="120" y="200" textAnchor="middle" fontSize="23" fontWeight="500" letterSpacing="0.5" fill="#3E2C10"
            style={{ fontFamily: "var(--font-cormorant-var), 'Cormorant Garamond', Georgia, serif" }}>
            Fagurul
          </text>
          <text x="120" y="222" textAnchor="middle" fontSize="17" fontWeight="500" letterSpacing="2" fill="#3E2C10"
            style={{ fontFamily: "var(--font-cormorant-var), 'Cormorant Garamond', Georgia, serif" }}>
            de Aur
          </text>
          <line x1="82" y1="227" x2="158" y2="227" stroke="#A8845A" strokeWidth="0.8" />
          <text x="120" y="234.5" textAnchor="middle" fontSize="5.4" letterSpacing="2" fill="#8A7048"
            style={{ fontFamily: "var(--font-inter-var), Inter, sans-serif" }}>
            MIERE NATURALĂ PURĂ
          </text>
        </>
      )}
    </svg>
  );
}
