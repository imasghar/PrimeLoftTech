/**
 * PrimeLoft Lottie generator library.
 * Produces Bodymovin/Lottie JSON (v5.9) that renders with lottie_light (svg renderer).
 * All scenes are 60fps, 360 frames (6s seamless loops) unless overridden.
 */
import fs from 'node:fs';
import nodePath from 'node:path';

/* ---------- colour palettes (mirror css/style.css tokens, never change hues) ---------- */
export const PALETTES = {
  light: {
    bg: '#FAF7F2', bgAlt: '#F1ECE2', card: '#FFFFFF', card2: '#F6F2EA', panel: '#EEF1F8',
    ink: '#201E1B', soft: '#5B564E', faint: '#8C8578', line: '#E3DDD2', lineStrong: '#CFC8BB',
    red: '#C1584A', redDeep: '#A94437', redTint: '#F3DDD7', redSoft: '#F7B9A8',
    gold: '#C99A4E', goldTint: '#F7DFA0', teal: '#5F8F84', tealTint: '#C9DFD3', blueTint: '#CFDAEE',
    navy: '#1B2036', green: '#4CAF7A', white: '#FFFFFF', shadow: '#201E1B'
  },
  dark: {
    bg: '#161319', bgAlt: '#1E1A21', card: '#242028', card2: '#2B262F', panel: '#2F2A36',
    ink: '#F3EFE7', soft: '#B7AFA2', faint: '#847C71', line: '#3A3440', lineStrong: '#4A4350',
    red: '#E17E68', redDeep: '#EB937F', redTint: '#3B2621', redSoft: '#8C4B3C',
    gold: '#E3BC7B', goldTint: '#4A3F26', teal: '#8FC0B2', tealTint: '#243A31', blueTint: '#232C40',
    navy: '#0F0D14', green: '#6FCB98', white: '#F3EFE7', shadow: '#000000'
  }
};

/* ---------- easing presets ---------- */
const E = {
  out:   { i: [0.22, 1], o: [0.36, 0] },
  in:    { i: [0.64, 1], o: [0.78, 0] },
  inOut: { i: [0.55, 1], o: [0.45, 0] },
  back:  { i: [0.18, 1.35], o: [0.5, 0] },
  linear:{ i: [0.5, 0.5], o: [0.5, 0.5] },
  soft:  { i: [0.33, 1], o: [0.67, 0] }
};

export const hex = (h, a = 1) => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, a];
};
export const v = (k) => ({ a: 0, k });

/**
 * Build an animated property.
 * keys: array of [frame, value, ease?]  ease: out | in | inOut | back | linear | soft | hold
 * The ease on a key describes the transition FROM that key to the next.
 */
export function anim(keys) {
  const norm = (x) => (Array.isArray(x) ? x : [x]);
  const out = keys.map((k, idx) => {
    const [t, val, ease = 'out'] = k;
    const s = norm(val);
    const kf = { t, s };
    if (idx < keys.length - 1) {
      const next = norm(keys[idx + 1][1]);
      if (ease === 'hold') { kf.h = 1; }
      else {
        const e = E[ease] || E.out;
        kf.e = next;
        kf.i = { x: s.map(() => e.i[0]), y: s.map(() => e.i[1]) };
        kf.o = { x: s.map(() => e.o[0]), y: s.map(() => e.o[1]) };
      }
    }
    return kf;
  });
  return { a: 1, k: out };
}

/* ---------- shape primitives (used inside groups) ---------- */
export const rect = (w, h, r = 0, p = [0, 0]) => ({ ty: 'rc', d: 1, s: v([w, h]), p: v(p), r: v(r) });
export const ellipse = (w, h, p = [0, 0]) => ({ ty: 'el', d: 1, s: v([w, h]), p: v(p) });
export const star = (points, outer, inner, p = [0, 0], rot = 0) => ({ ty: 'sr', sy: 1, d: 1, pt: v(points), p: v(p), r: v(rot), ir: v(inner), is: v(0), or: v(outer), os: v(0) });
export const polygon = (points, radius, p = [0, 0], rot = 0) => ({ ty: 'sr', sy: 2, d: 1, pt: v(points), p: v(p), r: v(rot), or: v(radius), os: v(0) });

/**
 * path(points, {closed, smooth}) points: [[x,y], ...] or [[x,y,[inx,iny],[outx,outy]], ...]
 * smooth: 0..1 auto tangents for a smooth curve.
 */
export function path(points, { closed = false, smooth = 0 } = {}) {
  const vtx = points.map((p) => [p[0], p[1]]);
  const i = points.map((p) => (p[2] ? p[2] : [0, 0]));
  const o = points.map((p) => (p[3] ? p[3] : [0, 0]));
  if (smooth > 0) {
    for (let k = 0; k < vtx.length; k++) {
      const prev = vtx[(k - 1 + vtx.length) % vtx.length];
      const next = vtx[(k + 1) % vtx.length];
      if (!closed && (k === 0 || k === vtx.length - 1)) continue;
      const tx = (next[0] - prev[0]) * smooth * 0.5;
      const ty = (next[1] - prev[1]) * smooth * 0.5;
      i[k] = [-tx, -ty]; o[k] = [tx, ty];
    }
  }
  return { ty: 'sh', d: 1, ks: v({ c: closed, v: vtx, i, o }) };
}
export const fill = (color, opacity = 100) => ({ ty: 'fl', c: typeof color === 'string' ? v(hex(color)) : color, o: typeof opacity === 'number' ? v(opacity) : opacity, r: 1 });
export const stroke = (color, width = 2, { opacity = 100, cap = 2, join = 2, dash } = {}) => {
  const s = { ty: 'st', c: typeof color === 'string' ? v(hex(color)) : color, o: typeof opacity === 'number' ? v(opacity) : opacity, w: typeof width === 'number' ? v(width) : width, lc: cap, lj: join, ml: 4 };
  if (dash) s.d = [{ n: 'd', nm: 'dash', v: v(dash[0]) }, { n: 'g', nm: 'gap', v: v(dash[1]) }, { n: 'o', nm: 'offset', v: dash[2] !== undefined ? dash[2] : v(0) }];
  return s;
};
/** gradient fill: stops [[offset0..1, '#hex', alpha?], ...]; start/end points relative to group */
export function gradFill(stops, start, end, { radial = false, opacity = 100 } = {}) {
  const k = [];
  stops.forEach(([off, c]) => { const [r, g, b] = hex(c); k.push(off, r, g, b); });
  const hasAlpha = stops.some((s) => s[2] !== undefined);
  if (hasAlpha) stops.forEach(([off, , a = 1]) => k.push(off, a));
  return { ty: 'gf', o: v(opacity), r: 1, s: v(start), e: v(end), t: radial ? 2 : 1, h: v(0), a: v(0), g: { p: stops.length, k: v(k) } };
}
export const trim = (start = 0, end = 100, offset = 0) => ({ ty: 'tm', s: typeof start === 'number' ? v(start) : start, e: typeof end === 'number' ? v(end) : end, o: typeof offset === 'number' ? v(offset) : offset, m: 1 });
export const roundCorners = (r) => ({ ty: 'rd', r: v(r) });
export const transform = ({ p = [0, 0], a = [0, 0], s = [100, 100], r = 0, o = 100, sk = 0, sa = 0 } = {}) => ({
  ty: 'tr',
  p: p.a !== undefined ? p : v(p), a: a.a !== undefined ? a : v(a), s: s.a !== undefined ? s : v(s),
  r: typeof r === 'number' ? v(r) : r, o: typeof o === 'number' ? v(o) : o, sk: v(sk), sa: v(sa)
});
/**
 * group(name, items, transformOpts)
 * Two kinds of groups:
 *  - LEAF group: only primitives + paints, e.g. [rect, fill, stroke]. Order is kept (paint applies to shapes before it).
 *  - CONTAINER group: only nested groups, listed BOTTOM → TOP (first = behind). Reversed internally for Lottie.
 * Mixing primitives and groups in one list throws, to catch ordering mistakes early.
 */
export function orderItems(items, where = 'group') {
  const isGroup = (it) => it && it.ty === 'gr';
  const groups = items.filter(isGroup).length;
  if (groups === items.length) return [...items].reverse();
  if (groups === 0) return items;
  throw new Error(`${where}: do not mix primitives and nested groups in one list (wrap primitives in their own group)`);
}
export const group = (nm, items, tr = {}) => ({ ty: 'gr', nm, it: [...orderItems(items, 'group ' + nm), transform(tr)] });

/* ---------- convenience builders ---------- */
/** Filled rounded card with optional soft shadow + stroke, centred at p */
export function card(nm, w, h, r, { fill: f = '#FFFFFF', stroke: st, strokeW = 1, shadow = true, shadowColor = '#201E1B', shadowOpacity = 10, p = [0, 0], ...tr } = {}) {
  const items = [];
  if (shadow) items.push(group(nm + '_shadow', [rect(w, h, r, [0, 10]), fill(shadowColor, shadowOpacity)], { s: [102, 104] }));
  const body = [rect(w, h, r), fill(f)];
  if (st) body.push(stroke(st, strokeW));
  items.push(group(nm + '_body', body));
  return group(nm, items, { p, ...tr });
}
/** text-line placeholder bar anchored at its LEFT edge (p = left-centre point) */
export const bar = (nm, w, h, color, p = [0, 0], opts = {}) => group(nm, [rect(w, h, h / 2, [w / 2, 0]), fill(color, opts.opacity ?? 100)], { p, a: [0, 0], ...(opts.tr || {}) });
export const dot = (nm, d, color, p = [0, 0], opts = {}) => group(nm, [ellipse(d, d), fill(color, opts.opacity ?? 100)], { p, ...(opts.tr || {}) });
export const ring = (nm, d, color, w, p = [0, 0], opts = {}) => group(nm, [ellipse(d, d), ...(opts.trim ? [opts.trim] : []), stroke(color, w, { opacity: opts.opacity ?? 100 })], { p, r: opts.r ?? 0, ...(opts.tr || {}) });

/* ---------- animation helpers (keyframed property objects) ---------- */
const tail = (keys) => { keys.push([360, keys[keys.length - 1][1]]); return anim(keys); };
/** layer/group scale pop with overshoot */
export const popIn = (t0, t1, { from = 60, tOut, dOut = 20, ease = 'back', dims = 3 } = {}) => {
  const sc = (x) => (dims === 3 ? [x, x, 100] : [x, x]);
  const keys = [[0, sc(from), 'hold'], [t0, sc(from), ease], [t1, sc(100), 'hold']];
  if (tOut !== undefined) keys.push([tOut, sc(100), 'in'], [tOut + dOut, sc(from), 'hold']);
  return tail(keys);
};
export const fadeIn = (t0, t1, { tOut, dOut = 20, to = 100 } = {}) => {
  const keys = [[0, 0, 'hold'], [t0, 0, 'out'], [t1, to, 'hold']];
  if (tOut !== undefined) keys.push([tOut, to, 'in'], [tOut + dOut, 0, 'hold']);
  return tail(keys);
};
/** slide + settle from offset [dx,dy]; dims 3 for layers, 2 for groups */
export const slideIn = (p, t0, t1, [dx, dy], { tOut, dOut = 20, dims = 3 } = {}) => {
  const mk = (x, y) => (dims === 3 ? [x, y, 0] : [x, y]);
  const from = mk(p[0] + dx, p[1] + dy), to = mk(p[0], p[1]);
  const keys = [[0, from, 'hold'], [t0, from, 'out'], [t1, to, 'hold']];
  if (tOut !== undefined) keys.push([tOut, to, 'in'], [tOut + dOut, from, 'hold']);
  return tail(keys);
};
/** seamless vertical float around p */
export const float = (p, amp = 6, phase = 0, { dims = 3, period = 360 } = {}) => {
  const q = period / 4;
  const keys = [];
  for (let t = 0; t <= 360; t += q) {
    const ph = ((t / period) * Math.PI * 2) + phase;
    const y = p[1] + Math.sin(ph) * amp;
    keys.push([t, dims === 3 ? [p[0], y, 0] : [p[0], y], 'inOut']);
  }
  return anim(keys);
};
export const spin = (turns = 1, from = 0) => anim([[0, from, 'linear'], [360, from + 360 * turns]]);
/** seamless pulse (scale) */
export const pulse = (base = 100, amp = 6, period = 90, { dims = 3 } = {}) => {
  const sc = (x) => (dims === 3 ? [x, x, 100] : [x, x]);
  const keys = [];
  let up = false;
  for (let t = 0; t <= 360; t += period / 2) { keys.push([t, sc(up ? base + amp : base), 'inOut']); up = !up; }
  if (keys[keys.length - 1][0] !== 360) keys.push([360, sc(base)]);
  return anim(keys);
};
/** width grow for left-anchored bars: group scale [x,100] */
export const growX = (t0, t1, { from = 0, tOut, dOut = 16 } = {}) => {
  const keys = [[0, [from, 100], 'hold'], [t0, [from, 100], 'out'], [t1, [100, 100], 'hold']];
  if (tOut !== undefined) keys.push([tOut, [100, 100], 'in'], [tOut + dOut, [from, 100], 'hold']);
  return tail(keys);
};
/** trim-path draw on: end 0→100 */
export const drawOn = (t0, t1, { tOut, dOut = 20 } = {}) => {
  const keys = [[0, 0, 'hold'], [t0, 0, 'inOut'], [t1, 100, 'hold']];
  if (tOut !== undefined) keys.push([tOut, 100, 'in'], [tOut + dOut, 0, 'hold']);
  return tail(keys);
};

/* ---------- layers ---------- */
let _ind = 0;
export const resetIndex = () => { _ind = 0; };
export function nullLayer(nm, { p = [0, 0], parent, s = [100, 100, 100], r = 0, ip = 0, op = 360 } = {}) {
  const ind = ++_ind;
  const L = { ddd: 0, ind, ty: 3, nm, sr: 1, ks: { o: v(100), r: typeof r === 'number' ? v(r) : r, p: p.a !== undefined ? p : v([p[0], p[1], 0]), a: v([0, 0, 0]), s: s.a !== undefined ? s : v(s) }, ao: 0, ip, op, st: 0, bm: 0 };
  if (parent) L.parent = parent;
  return L;
}
export function shapeLayer(nm, shapes, { p = [0, 0], a = [0, 0], s = [100, 100, 100], r = 0, o = 100, parent, ip = 0, op = 360, matte, matteSource } = {}) {
  const ind = ++_ind;
  const ks = {
    o: typeof o === 'number' ? v(o) : o,
    r: typeof r === 'number' ? v(r) : r,
    p: p.a !== undefined ? p : v([p[0], p[1], 0]),
    a: v([a[0], a[1], 0]),
    s: s.a !== undefined ? s : v(s)
  };
  const L = { ddd: 0, ind, ty: 4, nm, sr: 1, ks, ao: 0, ip, op, st: 0, bm: 0, shapes: orderItems(shapes, 'layer ' + nm) };
  if (parent) L.parent = parent;
  if (matteSource) L.td = 1;   // matte source; must sit directly ABOVE the matted layer in the array
  if (matte) L.tt = 1;         // alpha matte
  return L;
}

/** Compose a document. layers: TOP-most first (After Effects order). Put MAIN_NULL last. */
export function compose({ nm, w = 500, h = 820, fr = 60, ip = 0, op = 360, layers }) {
  return { v: '5.9.6', fr, ip, op, w, h, nm, ddd: 0, assets: [], layers, markers: [] };
}

/** Standard scene wrapper: ambient radial glow + sparkles + MAIN null at centre. Returns {layers, main} */
export function sceneBase(P, { w = 500, h = 820, glow = true, sparkles = true, glowColor, glowSize = [520, 620] } = {}) {
  const main = nullLayer('MAIN_NULL', { p: [w / 2, h / 2] });
  const layers = [];
  if (sparkles) {
    const sy = h / 820, sx = w / 500;
    const pts = [[-200, -330], [190, -300], [-215, 60], [210, 120], [-150, 320], [175, 330], [-40, -395], [60, 380], [-225, -120], [225, -150]].map(([x, y]) => [x * sx, y * sy]);
    const colors = [P.red, P.gold, P.red, P.gold, P.red, P.gold, P.red, P.gold, P.gold, P.red];
    const items = pts.map((pt, i) => {
      const size = 4 + (i % 3) * 2;
      return group('sp' + i, [ellipse(size, size), fill(colors[i])], { p: pt, s: anim([[0, [0, 0], 'hold'], [i * 14, [0, 0], 'back'], [i * 14 + 30, [100, 100], 'hold'], [i * 14 + 200, [100, 100], 'in'], [i * 14 + 240, [0, 0], 'hold'], [360, [0, 0]]]) });
    });
    layers.push(shapeLayer('Sparkles', items, { parent: main.ind }));
  }
  if (glow) {
    const gc = glowColor || P.redTint;
    layers.push(shapeLayer('Ambient_Glow', [group('glow', [ellipse(glowSize[0], glowSize[1]), gradFill([[0, gc, 0.95], [0.55, gc, 0.35], [1, gc, 0]], [0, 0], [glowSize[0] * 0.54, 0], { radial: true })])], { parent: main.ind, s: anim([[0, [100, 100, 100], 'inOut'], [180, [106, 106, 100], 'inOut'], [360, [100, 100, 100]]]) }));
  }
  return { main, layers };
}

export function writeScene(outDir, baseName, buildFn) {
  for (const theme of ['light', 'dark']) {
    resetIndex();
    const json = buildFn(PALETTES[theme], theme);
    json.nm = `${json.nm} (${theme})`;
    const file = nodePath.join(outDir, `${baseName}-${theme}.json`);
    fs.writeFileSync(file, JSON.stringify(json));
    console.log('wrote', file, (fs.statSync(file).size / 1024).toFixed(1) + 'KB', 'layers:', json.layers.length);
  }
}
