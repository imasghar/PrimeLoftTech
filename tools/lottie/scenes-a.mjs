/**
 * Scenes A: hero (homepage), web-development, seo, about.
 * Run: node tools/lottie/build.mjs hero web-development seo about
 *
 * Conventions: every element enters during the first ~2.5s, idles (float / pulse / draw-on), and
 * resolves out from frame OUT so that frame 360 == frame 0 (seamless loop). Group transforms use
 * dims:2, layer transforms dims:3. Only palette colours (P.*) are used.
 */
import * as L from './lib.mjs';
const { group, rect, ellipse, fill, stroke, bar, dot, ring, card, anim, shapeLayer, nullLayer, path, trim, gradFill, popIn, fadeIn, slideIn, float, spin, pulse, growX, drawOn, v } = L;

const OUT = 330; // frame where every scene starts resolving; everything is gone by ~352
/** layer opacity for containers whose children enter on their own: fully visible, then fades out at OUT */
const holdThenFade = anim([[0, 100, 'hold'], [OUT, 100, 'in'], [OUT + 18, 0, 'hold'], [360, 0]]);

/* ---------- shared helpers ---------- */
/** group-level enter (pop with overshoot + fade) and exit before the loop point */
const life = (t0, t1, { tOut = OUT, dOut = 18, from = 60, ease = 'back' } = {}) => ({
  s: popIn(t0, t1, { from, tOut, dOut, dims: 2, ease }),
  o: fadeIn(t0, Math.min(t1, t0 + 14), { tOut, dOut })
});
/** layer-level variant of life() */
const lifeL = (t0, t1, { tOut = OUT, dOut = 18, from = 70, ease = 'back' } = {}) => ({
  s: popIn(t0, t1, { from, tOut, dOut, dims: 3, ease }),
  o: fadeIn(t0, Math.min(t1, t0 + 14), { tOut, dOut })
});
/** group-level slide + fade enter, fade exit */
const slideLife = (p, t0, t1, [dx, dy], { tOut = OUT, dOut = 18 } = {}) => ({
  p: slideIn(p, t0, t1, [dx, dy], { dims: 2 }),
  o: fadeIn(t0, t0 + Math.min(16, t1 - t0), { tOut, dOut })
});
/** opacity that is solid between tSolid0..tSolid1, then blinks until tEnd (for carets) */
const blink = (tSolid0, tSolid1, tEnd, on = 24, off = 18) => {
  const keys = [[0, 0, 'hold'], [tSolid0, 100, 'hold']];
  let t = tSolid1, vis = false;
  while (t < tEnd) { keys.push([t, vis ? 100 : 0, 'hold']); t += vis ? on : off; vis = !vis; }
  keys.push([tEnd, 0, 'hold'], [360, 0]);
  return anim(keys);
};
/** "click" scale dip for buttons (100 -> dip -> 100) layered on a normal pop-in life */
const clickScale = (t0, t1, tClick, { dip = 92, tOut = OUT, dOut = 18, from = 60 } = {}) => anim([
  [0, [from, from], 'hold'], [t0, [from, from], 'back'], [t1, [100, 100], 'hold'],
  [tClick, [100, 100], 'in'], [tClick + 7, [dip, dip], 'out'], [tClick + 20, [100, 100], 'hold'],
  [tOut, [100, 100], 'in'], [tOut + dOut, [from, from], 'hold'], [360, [from, from]]
]);
/** expanding ripple ring (scale up + fade) fired at tClick */
const ripple = (nm, color, p, tClick, { from = 30, to = 320, dur = 40, w = 3 } = {}) => ring(nm, 40, color, w, p, { tr: {
  s: anim([[0, [from, from], 'hold'], [tClick, [from, from], 'out'], [tClick + dur, [to, to], 'hold'], [360, [to, to]]]),
  o: anim([[0, 0, 'hold'], [tClick, 80, 'out'], [tClick + dur, 0, 'hold'], [360, 0]])
} });
/** bottom-anchored bar that rises (scale-y 0 -> 100) */
const riseBar = (nm, w, h, color, [x, bottomY], t0, t1, r = 3) => group(nm, [rect(w, h, r, [0, -h / 2]), fill(color)], {
  p: [x, bottomY], s: anim([[0, [100, 0], 'hold'], [t0, [100, 0], 'back'], [t1, [100, 100], 'hold'], [360, [100, 100]]])
});
/** three browser traffic-light dots */
const trafficDots = (P, x, y, d = 8, gap = 14) => [dot('tl1', d, P.red, [x, y]), dot('tl2', d, P.gold, [x + gap, y]), dot('tl3', d, P.teal, [x + 2 * gap, y])];
/** window title bar: rounded top (matches card radius), flat bottom, hairline underneath */
const titleBar = (P, w, h, r, cardH) => {
  const top = -cardH / 2;
  return group('tbar', [rect(w - 2, h + r, r, [0, top + (h + r) / 2 + 1]), rect(w - 2, r + 2, 0, [0, top + h - r / 2]), fill(P.card2)]);
};
const titleLine = (P, w, y) => group('tbar_line', [rect(w - 2, 1, 0, [0, y]), fill(P.line)]);
/** smooth open polyline + a closed area path under it (same tangents) for gradient fills */
const lineAndArea = (points, baseY, smooth = 0.5) => {
  const line = path(points, { smooth });
  const ks = line.ks.k;
  const vtx = [...ks.v, [points[points.length - 1][0], baseY], [points[0][0], baseY]];
  const i = [...ks.i, [0, 0], [0, 0]], o = [...ks.o, [0, 0], [0, 0]];
  const area = { ty: 'sh', d: 1, ks: v({ c: true, v: vtx, i, o }) };
  return { line, area };
};

/* =====================================================================================
 * 1. HERO (600x600): browser window with a website assembling, phone in front, chips,
 *    growth chart and a cursor that clicks the CTA.
 * ===================================================================================== */
export function hero(P) {
  const { main, layers } = L.sceneBase(P, { w: 600, h: 600, glowSize: [560, 560] });
  const sh = { shadowColor: P.shadow };
  const CLICK = 162; // frame when the cursor presses the CTA

  // --- Window null: frame, website content and cursor share its slight tilt + float
  const WIN = nullLayer('WIN_NULL', { p: float([-40, -42], 4, 0), parent: main.ind, r: -2 });
  const W = 400, H = 300;

  // Browser window frame (title bar with traffic lights + URL pill)
  const frame = group('window', [
    card('frame', W, H, 18, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    titleBar(P, W, 36, 18, H),
    titleLine(P, W, -H / 2 + 36),
    ...trafficDots(P, -176, -132, 9, 16),
    group('url', [rect(220, 18, 9, [20, -132]), fill(P.bg)]),
    bar('urltxt', 90, 5, P.faint, [-60, -132])
  ]);

  // Website nav bar (logo dot, brand bar, 3 nav bars, dark button)
  const navT = 34;
  const nav = group('nav', [
    dot('logo', 12, P.red, [-176, -80]),
    bar('brand', 40, 6, P.ink, [-166, -80]),
    bar('n1', 26, 5, P.faint, [36, -80]), bar('n2', 26, 5, P.faint, [72, -80]), bar('n3', 26, 5, P.faint, [108, -80]),
    group('navbtn', [rect(44, 18, 9), fill(P.ink)], { p: [168, -80] })
  ], slideLife([0, 0], navT, navT + 26, [0, -12]));

  // Hero section: headline bars grow in, red CTA pill (gets clicked), hero image block
  const heroT = 56;
  const cta = group('cta', [
    ripple('ripple', P.red, [0, 0], CLICK + 4),
    group('pill', [
      group('pill_bg', [rect(88, 28, 14), fill(P.red)]),
      group('pill_txt', [rect(42, 5, 2.5, [-4, 0]), fill(P.white)]),
      group('pill_arrow', [path([[18, -4], [22, 0], [18, 4]]), stroke(P.white, 2)])
    ], { s: clickScale(heroT + 36, heroT + 62, CLICK), o: fadeIn(heroT + 36, heroT + 48, { tOut: OUT }) })
  ], { p: [-132, 28] });
  const heroBlock = group('hero_block', [
    bar('h1', 190, 13, P.ink, [-176, -46], { tr: { s: growX(heroT, heroT + 30) } }),
    bar('h2', 150, 7, P.soft, [-176, -24], { tr: { s: growX(heroT + 10, heroT + 36) } }),
    bar('h3', 110, 7, P.soft, [-176, -10], { tr: { s: growX(heroT + 18, heroT + 42) } }),
    cta,
    group('hero_img', [rect(140, 100, 12), fill(P.redTint)], { p: [118, -6], ...life(heroT + 14, heroT + 44) }),
    group('hero_img_sun', [ellipse(26, 26), fill(P.redSoft)], { p: [146, -32], ...life(heroT + 34, heroT + 54) }),
    group('hero_img_hill', [path([[-70, 44], [-34, 10, [-12, 8], [12, -8]], [-4, 30, [-10, -6], [10, 6]], [30, 0, [-10, 10], [10, -10]], [70, 32], [70, 44]], { closed: true }), fill(P.redSoft, 60)], { p: [118, -6], ...life(heroT + 44, heroT + 64, { from: 80 }) })
  ]);

  // 3-card feature grid popping in one by one
  const gridT = 128;
  const gridCard = (i, x, accent) => group('gcard' + i, [
    card('gc', 114, 70, 10, { fill: P.card2, stroke: P.line, shadow: false }),
    dot('ic', 16, accent, [-40, -16]),
    bar('t', 60, 6, P.ink, [-28, -16]),
    bar('l1', 88, 5, P.lineStrong, [-44, 6]),
    bar('l2', 62, 5, P.lineStrong, [-44, 18])
  ], { p: [x, 98], ...life(gridT + i * 16, gridT + i * 16 + 28) });
  const grid = [gridCard(0, -130, P.red), gridCard(1, 0, P.gold), gridCard(2, 130, P.teal)];

  // Cursor (arrow polygon) flies to the CTA, presses it, then drifts away
  const cursor = group('cursor', [
    group('arrow', [path([[0, 0], [0, 16], [4.5, 12.5], [7.5, 19.5], [11, 18], [8, 11], [13.5, 11]], { closed: true }), fill(P.ink), stroke(P.bg, 1.6)])
  ], {
    p: anim([[0, [250, 112], 'hold'], [CLICK - 56, [250, 112], 'inOut'], [CLICK - 8, [-126, 32], 'hold'], [CLICK + 70, [-126, 32], 'inOut'], [CLICK + 120, [240, 124], 'hold'], [360, [240, 124]]]),
    s: anim([[0, [100, 100], 'hold'], [CLICK, [100, 100], 'in'], [CLICK + 7, [84, 84], 'out'], [CLICK + 18, [100, 100], 'hold'], [360, [100, 100]]]),
    o: fadeIn(CLICK - 56, CLICK - 40, { tOut: CLICK + 96, dOut: 20 })
  });

  // Phone in front (bottom-right): dark chassis, screen with a list that builds
  const phoneT = 24;
  const rowY = [-4, 22, 48, 74];
  const rowAccent = [P.red, P.gold, P.teal, P.green];
  const phoneRows = rowY.map((y, i) => group('prow' + i, [
    group('rbg', [rect(98, 22, 7), fill(P.panel)]),
    dot('rdot', 10, rowAccent[i], [-38, 0]),
    bar('rt', 44, 5, P.ink, [-28, -4]),
    bar('rs', 30, 4, P.faint, [-28, 5])
  ], slideLife([0, y], 100 + i * 12, 124 + i * 12, [0, 16])));
  const phone = group('phone', [
    group('chassis_shadow', [rect(128, 236, 30, [0, 12]), fill(P.shadow, 16)], { s: [104, 104] }),
    group('chassis', [rect(128, 236, 30), fill(P.navy), stroke(P.line, 1.5, { opacity: 70 })]),
    group('screen', [rect(114, 222, 24), fill(P.card)]),
    group('notch', [rect(36, 6, 3, [0, -100]), fill(P.navy)]),
    group('pheader', [dot('pav', 14, P.teal, [-42, -82]), bar('pb1', 34, 5, P.ink, [-31, -85]), bar('pb2', 22, 4, P.faint, [-31, -78]), dot('pbell', 10, P.gold, [42, -82])], slideLife([0, 0], 70, 92, [0, -8])),
    group('phero', [group('pimg', [rect(98, 54, 10), fill(P.redTint)]), group('ppill', [rect(30, 10, 5, [-28, 14]), fill(P.red)]), bar('pht', 46, 5, P.white, [-40, -12])], { p: [0, -46], ...life(84, 110, { from: 80 }) }),
    ...phoneRows,
    group('pnav', [dot('pn1', 7, P.red, [-30, 96]), dot('pn2', 7, P.lineStrong, [-10, 96]), dot('pn3', 7, P.lineStrong, [10, 96]), dot('pn4', 7, P.lineStrong, [30, 96])], { o: fadeIn(150, 170, { tOut: OUT }) })
  ]);

  // "Deployed" chip (green status dot with a pulsing halo + two bars) slides in top-right
  const deployed = group('deployed', [
    card('bg', 124, 42, 21, { fill: P.card, stroke: P.line, shadowOpacity: 12, ...sh }),
    ring('halo', 12, P.green, 2, [-42, 0], { opacity: 55, tr: { s: pulse(100, 70, 120, { dims: 2 }) } }),
    dot('ok', 12, P.green, [-42, 0]),
    bar('t1', 56, 6, P.ink, [-28, -6]),
    bar('t2', 36, 5, P.faint, [-28, 6])
  ], { p: float([0, 0], 5, 2.2, { dims: 2 }) });

  // Growth chart card (left): three bars rise, a line draws on, end dot pops
  const chartT = 150;
  const chart = group('chart', [
    card('bg', 124, 92, 14, { fill: P.card, stroke: P.line, shadowOpacity: 12, ...sh }),
    bar('ct', 50, 6, P.ink, [-50, -32]),
    group('cpill', [rect(26, 10, 5), fill(P.green)], { p: [40, -32] }),
    riseBar('b1', 12, 22, P.redTint, [-42, 34], chartT + 24, chartT + 48),
    riseBar('b2', 12, 36, P.redSoft, [-26, 34], chartT + 34, chartT + 58),
    riseBar('b3', 12, 50, P.red, [-10, 34], chartT + 44, chartT + 68),
    group('cline', [path([[6, 22], [20, 6], [32, 12], [44, -10], [52, -18]], { smooth: 0.5 }), trim(0, drawOn(chartT + 50, chartT + 100), 0), stroke(P.red, 3)]),
    dot('cdot', 8, P.red, [52, -18], { tr: life(chartT + 98, chartT + 116, { from: 0 }) })
  ]);

  // Website content layer fades out at the end (children stay in their final state while hidden)
  const contentO = holdThenFade;

  layers.unshift(
    shapeLayer('Cursor', [cursor], { parent: WIN.ind }),
    shapeLayer('Deployed_Chip', [deployed], { parent: main.ind, p: slideIn([176, -178], 172, 204, [44, 0], { tOut: OUT, dOut: 18 }), o: fadeIn(172, 190, { tOut: OUT }) }),
    shapeLayer('Growth_Chart', [chart], { parent: main.ind, p: float([-196, 152], 4, 3.6), ...lifeL(chartT, chartT + 30) }),
    shapeLayer('Phone', [phone], { parent: main.ind, p: float([152, 118], 5, 1.3), ...lifeL(phoneT, phoneT + 36) }),
    shapeLayer('Website', [nav, heroBlock, ...grid], { parent: WIN.ind, o: contentO }),
    shapeLayer('Window_Frame', [frame], { parent: WIN.ind, ...lifeL(0, 34) })
  );
  layers.push(WIN, main);
  return L.compose({ nm: 'PrimeLoft Hero', w: 600, h: 600, layers });
}

/* =====================================================================================
 * 2. WEB DEVELOPMENT (500x820): code editor types, live preview assembles, responsive
 *    phone mirrors it, a performance gauge chip pops in.
 * ===================================================================================== */
export function webDevelopment(P) {
  const { main, layers } = L.sceneBase(P, { w: 500, h: 820, glowSize: [520, 640] });
  const sh = { shadowColor: P.shadow };

  // --- Code editor card (380x250) at the top
  const EW = 380, EH = 250;
  const colour = { r: P.red, g: P.gold, t: P.teal, i: P.ink, s: P.soft, f: P.faint };
  // code lines: [indent level, [[width, colourKey], ...]]
  const codeLines = [
    [0, [[28, 'r'], [62, 'i']]],
    [1, [[40, 'g'], [14, 'f'], [70, 's']]],
    [1, [[52, 't'], [30, 'i'], [44, 'g']]],
    [2, [[36, 'r'], [82, 's']]],
    [2, [[60, 'i'], [24, 'g']]],
    [1, [[48, 't'], [50, 'f']]],
    [1, [[30, 'g'], [70, 'i'], [22, 'r']]],
    [0, [[20, 'r']]]
  ];
  const lineT = (i) => 36 + i * 18;   // frame a line starts typing
  const LINE_DUR = 24;
  const lineY = (i) => -66 + i * 21;
  const caretKeys = [[0, [-152, lineY(0)], 'hold']];
  const codeShapes = [];
  codeLines.forEach(([indent, segs], i) => {
    const y = lineY(i), T = lineT(i);
    let x = -152 + indent * 16;
    codeShapes.push(dot('gutter' + i, 5, P.lineStrong, [-170, y], { tr: { o: fadeIn(T - 6, T + 4, { tOut: OUT }) } }));
    segs.forEach(([w, c], j) => {
      codeShapes.push(bar(`code${i}_${j}`, w, 7, colour[c], [x, y], { tr: { s: growX(T + j * 6, T + j * 6 + 14) } }));
      x += w + 8;
    });
    caretKeys.push([T, [-152 + indent * 16, y], 'linear'], [T + LINE_DUR, [x - 6, y], 'hold']);
  });
  const typingEnd = lineT(codeLines.length - 1) + LINE_DUR;
  caretKeys.push([360, caretKeys[caretKeys.length - 1][1]]);
  const caret = group('caret', [rect(2.5, 13, 1), fill(P.red)], { p: anim(caretKeys), o: blink(36, typingEnd, OUT) });
  const editor = group('editor', [
    card('ebg', EW, EH, 18, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    titleBar(P, EW, 34, 18, EH),
    titleLine(P, EW, -EH / 2 + 34),
    ...trafficDots(P, -168, -108, 8, 14),
    group('tab', [rect(90, 16, 8, [0, 0]), fill(P.bg)], { p: [-60, -108] }),
    bar('tabtxt', 40, 4, P.faint, [-92, -108]),
    group('gutter_line', [rect(1, EH - 50, 0, [0, 8]), fill(P.line)], { p: [-160, 14] })
  ]);

  // --- Live browser preview (236x300) below-left; elements appear as their code line finishes
  const PW = 236, PH = 300;
  const doneT = (i) => lineT(i) + LINE_DUR;
  const previewEls = [
    group('p_header', [dot('plogo', 10, P.red, [-96, -104]), bar('pbrand', 34, 5, P.ink, [-88, -104]), bar('pn1', 18, 4, P.faint, [38, -104]), bar('pn2', 18, 4, P.faint, [62, -104]), bar('pn3', 18, 4, P.faint, [86, -104])], slideLife([0, 0], doneT(0), doneT(0) + 22, [0, -10])),
    group('p_img', [group('pimg', [rect(196, 64, 10), fill(P.redTint)]), group('psun', [ellipse(20, 20, [70, -14]), fill(P.redSoft)])], { p: [0, -60], ...life(doneT(1), doneT(1) + 26, { from: 80 }) }),
    bar('p_h1', 120, 9, P.ink, [-98, -8], { tr: { s: growX(doneT(2), doneT(2) + 22) } }),
    bar('p_s1', 160, 6, P.soft, [-98, 8], { tr: { s: growX(doneT(3), doneT(3) + 22) } }),
    bar('p_s2', 120, 6, P.soft, [-98, 22], { tr: { s: growX(doneT(4), doneT(4) + 22) } }),
    group('p_btn', [group('bbg', [rect(66, 22, 11), fill(P.red)]), group('btxt', [rect(30, 4, 2), fill(P.white)])], { p: [-65, 50], ...life(doneT(5), doneT(5) + 24) }),
    ...[-50, 50].map((x, k) => group('p_card' + k, [
      card('pcbg', 94, 50, 10, { fill: P.card2, stroke: P.line, shadow: false }),
      dot('pci', 12, k ? P.teal : P.gold, [-33, -10]), bar('pct', 40, 5, P.ink, [-24, -10]), bar('pcl', 70, 4, P.lineStrong, [-35, 8])
    ], { p: [x, 104], ...life(doneT(6) + k * 10, doneT(6) + k * 10 + 24) }))
  ];
  const preview = group('preview', [
    card('pbg', PW, PH, 16, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    titleBar(P, PW, 28, 16, PH),
    titleLine(P, PW, -PH / 2 + 28),
    ...trafficDots(P, -100, -136, 7, 12),
    group('purl', [rect(120, 12, 6), fill(P.bg)], { p: [14, -136] }),
    ...previewEls
  ]);

  // --- Responsive phone beside the preview showing the same layout stacked
  const D = 6; // phone lags the preview by a few frames
  const phoneEls = [
    group('m_header', [dot('mlogo', 8, P.red, [-38, -80]), bar('mbrand', 26, 4, P.ink, [-32, -80]), bar('mm1', 12, 2, P.faint, [32, -84]), bar('mm2', 12, 2, P.faint, [32, -80]), bar('mm3', 12, 2, P.faint, [32, -76])], slideLife([0, 0], doneT(0) + D, doneT(0) + D + 22, [0, -8])),
    group('m_img', [rect(90, 40, 8), fill(P.redTint)], { p: [0, -50], ...life(doneT(1) + D, doneT(1) + D + 26, { from: 80 }) }),
    bar('m_h1', 70, 7, P.ink, [-45, -16], { tr: { s: growX(doneT(2) + D, doneT(2) + D + 22) } }),
    bar('m_s1', 86, 5, P.soft, [-45, -3], { tr: { s: growX(doneT(3) + D, doneT(3) + D + 22) } }),
    bar('m_s2', 64, 5, P.soft, [-45, 8], { tr: { s: growX(doneT(4) + D, doneT(4) + D + 22) } }),
    group('m_btn', [group('mbbg', [rect(54, 18, 9), fill(P.red)]), group('mbtxt', [rect(24, 3, 1.5), fill(P.white)])], { p: [-18, 30], ...life(doneT(5) + D, doneT(5) + D + 24) }),
    ...[58, 86].map((y, k) => group('m_card' + k, [
      card('mcbg', 90, 24, 7, { fill: P.card2, stroke: P.line, shadow: false }),
      dot('mci', 8, k ? P.teal : P.gold, [-34, 0]), bar('mct', 30, 4, P.ink, [-26, -3]), bar('mcl', 44, 3, P.lineStrong, [-26, 4])
    ], { p: [0, y], ...life(doneT(6) + D + k * 10, doneT(6) + D + k * 10 + 24) }))
  ];
  const phone = group('phone', [
    group('chassis_shadow', [rect(120, 216, 22, [0, 10]), fill(P.shadow, 16)], { s: [104, 104] }),
    group('chassis', [rect(120, 216, 22), fill(P.navy), stroke(P.line, 1.5, { opacity: 70 })]),
    group('screen', [rect(106, 202, 16), fill(P.card)]),
    group('notch', [rect(30, 5, 2.5, [0, -92]), fill(P.navy)]),
    ...phoneEls
  ]);

  // --- Performance gauge chip (270 degree arc fills to ~95%)
  const gaugeT = 232;
  const gaugeArc = anim([[0, 0, 'hold'], [gaugeT + 14, 0, 'inOut'], [gaugeT + 64, 71, 'hold'], [360, 71]]);
  const gauge = group('gauge', [
    card('gbg', 150, 58, 18, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    ring('gtrack', 36, P.line, 5, [-50, 2], { r: -135, trim: trim(0, 75, 0) }),
    ring('gval', 36, P.green, 5, [-50, 2], { r: -135, trim: trim(0, gaugeArc, 0) }),
    dot('gcenter', 6, P.green, [-50, 2]),
    bar('gt', 56, 8, P.ink, [-22, -8]),
    bar('gs', 40, 5, P.faint, [-22, 7]),
    group('gpill', [rect(28, 12, 6), fill(P.green)], { p: [52, -8] })
  ], { p: float([0, 0], 3, 1, { dims: 2 }) });

  // --- Small "<>" code chip floating between editor and preview
  const codeChip = group('codechip', [
    card('ccbg', 72, 30, 15, { fill: P.ink, shadowOpacity: 16, ...sh }),
    group('lt', [path([[-4, -6], [-9, 0], [-4, 6]]), stroke(P.bg, 2.2)], { p: [-20, 0] }),
    group('gt', [path([[4, -6], [9, 0], [4, 6]]), stroke(P.bg, 2.2)], { p: [-20, 0] }),
    bar('cct', 30, 5, P.bg, [-4, 0])
  ], { p: float([0, 0], 4, 2.6, { dims: 2 }) });

  // --- Component chip (teal dot + bars) top-right of the editor
  const compChip = group('compchip', [
    card('cpbg', 96, 36, 18, { fill: P.card, stroke: P.line, shadowOpacity: 12, ...sh }),
    group('cpicon', [rect(14, 14, 4), fill(P.teal)], { p: [-32, 0], r: 45, s: [80, 80] }),
    bar('cpt', 44, 6, P.ink, [-18, -5]),
    bar('cps', 30, 4, P.faint, [-18, 6])
  ], { p: float([0, 0], 4, 0.8, { dims: 2 }) });

  layers.unshift(
    shapeLayer('Gauge_Chip', [gauge], { parent: main.ind, p: [24, 236], ...lifeL(gaugeT, gaugeT + 30) }),
    shapeLayer('Code_Chip', [codeChip], { parent: main.ind, p: slideIn([-150, -86], 110, 140, [-30, 0], { tOut: OUT }), o: fadeIn(110, 126, { tOut: OUT }) }),
    shapeLayer('Component_Chip', [compChip], { parent: main.ind, p: slideIn([164, -346], 92, 122, [34, 0], { tOut: OUT }), o: fadeIn(92, 108, { tOut: OUT }) }),
    shapeLayer('Phone', [phone], { parent: main.ind, p: float([134, 96], 5, 1.6), ...lifeL(46, 82) }),
    shapeLayer('Preview', [preview], { parent: main.ind, p: float([-70, 84], 3, 3.2), ...lifeL(22, 56) }),
    shapeLayer('Caret', [caret], { parent: main.ind, p: [0, -226], o: holdThenFade }),
    shapeLayer('Code', codeShapes, { parent: main.ind, p: [0, -226], o: holdThenFade }),
    shapeLayer('Editor', [editor], { parent: main.ind, p: [0, -226], ...lifeL(0, 34) })
  );
  layers.push(main);
  return L.compose({ nm: 'PrimeLoft Web Development', w: 500, h: 820, layers });
}

/* =====================================================================================
 * 3. SEO (500x820): search bar with a typed query, three result rows (the third climbs
 *    to #1), organic-traffic chart drawing on, keyword pills and a score ring.
 * ===================================================================================== */
export function seo(P) {
  const { main, layers } = L.sceneBase(P, { w: 500, h: 820, glowSize: [520, 640] });
  const sh = { shadowColor: P.shadow };

  // --- Search bar card: magnifier icon, typed query bar, red search button that gets pressed
  const SEARCH_CLICK = 84;
  const search = group('search', [
    card('sbg', 380, 58, 29, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    group('mag_glass', [ellipse(18, 18), stroke(P.ink, 2.6)], { p: [-156, -2] }),
    group('mag_handle', [path([[7, 7], [15, 15]]), stroke(P.ink, 2.8)], { p: [-156, -2] }),
    bar('query', 150, 7, P.ink, [-130, 0], { tr: { s: growX(30, 76) } }),
    group('qcaret', [rect(2, 14, 1), fill(P.red)], { p: anim([[0, [-130, 0], 'hold'], [30, [-130, 0], 'out'], [76, [26, 0], 'hold'], [360, [26, 0]]]), o: blink(26, 78, 150) }),
    group('sbtn', [group('sbbg', [rect(58, 32, 16), fill(P.red)]), group('sbtxt', [rect(26, 5, 2.5), fill(P.white)])], { p: [146, 0], s: clickScale(6, 30, SEARCH_CLICK, { from: 100 }) })
  ]);

  // --- Result rows; row index 2 (red accent) climbs to the top while the others shift down
  const rowY = [-214, -130, -46];
  const RISE = 186, RISE_D = 44;
  const rowP = (fromY, toY) => anim([[0, [0, fromY], 'hold'], [RISE, [0, fromY], 'inOut'], [RISE + RISE_D, [0, toY], 'hold'], [360, [0, toY]]]);
  const resultRow = (i, accent, isWinner) => {
    const t0 = 96 + i * 14;
    const toY = isWinner ? rowY[0] : rowY[i + 1];
    const items = [
      card('rbg', 380, 74, 14, { fill: P.card, stroke: P.line, shadowOpacity: isWinner ? 18 : 10, ...sh }),
      dot('fav', 14, accent, [-162, -18]),
      bar('title', 140, 8, isWinner ? P.red : P.ink, [-148, -18]),
      bar('l1', 300, 6, P.line, [-162, 2]),
      bar('l2', 230, 6, P.line, [-162, 18])
    ];
    if (isWinner) {
      items.push(
        group('accent', [rect(4, 46, 2), fill(P.red)], { p: [-184, 0], o: fadeIn(RISE - 10, RISE + 10, { tOut: OUT }) }),
        group('upchip', [
          group('ucbg', [rect(36, 36, 11), fill(P.green)]),
          group('ucarrow', [path([[0, 8], [0, -8]]), path([[-6, -2], [0, -8], [6, -2]]), stroke(P.white, 2.6)])
        ], { p: [152, 0], ...life(RISE - 26, RISE - 2) })
      );
    }
    return group('row' + i, items, { p: rowP(rowY[i], toY), s: popIn(t0, t0 + 26, { dims: 2, from: 80 }), o: fadeIn(t0, t0 + 14) });
  };
  const rows = [resultRow(0, P.teal, false), resultRow(1, P.gold, false), resultRow(2, P.red, true)];

  // --- Organic traffic chart: grid lines, line draws on, gradient area fades in, end dot pops
  const chartT = 120;
  const pts = [[-166, 56], [-120, 40], [-74, 46], [-28, 22], [18, 10], [64, -14], [110, -26], [156, -56]];
  const { line, area } = lineAndArea(pts, 68, 0.5);
  const gridLines = [-40, -4, 32].map((y, i) => group('grid' + i, [rect(332, 1, 0, [0, y]), fill(P.line)]));
  const chart = group('chart', [
    card('cbg', 380, 200, 18, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    bar('ctitle', 70, 7, P.ink, [-166, -78]),
    bar('csub', 44, 5, P.faint, [-166, -66]),
    group('cpill', [group('cpbg', [rect(46, 16, 8), fill(P.green)]), group('cparrow', [path([[-5, 2], [0, -3], [5, 2]]), stroke(P.white, 2)], { p: [-10, 0] }), group('cptxt', [rect(16, 4, 2, [6, 0]), fill(P.white)])], { p: [150, -78], ...life(chartT + 120, chartT + 142) }),
    ...gridLines,
    group('area', [area, gradFill([[0, P.red, 0.38], [1, P.red, 0]], [0, -56], [0, 68])], { o: fadeIn(chartT + 80, chartT + 120, { tOut: OUT }) }),
    group('line', [line, trim(0, drawOn(chartT + 36, chartT + 110), 0), stroke(P.red, 3)]),
    dot('enddot', 10, P.red, pts[pts.length - 1], { tr: life(chartT + 106, chartT + 124, { from: 0 }) }),
    ring('endring', 10, P.red, 2, pts[pts.length - 1], { opacity: 50, tr: { s: pulse(100, 90, 120, { dims: 2 }), o: fadeIn(chartT + 120, chartT + 130, { tOut: OUT }) } })
  ]);

  // --- Keyword pills (dot + bar) floating at the bottom right
  const keyword = (nm, w, bg, accent, phase) => group(nm, [
    card(nm + '_bg', w, 30, 15, { fill: bg, shadowOpacity: 10, ...sh }),
    dot(nm + '_d', 8, accent, [-w / 2 + 16, 0]),
    bar(nm + '_t', w - 44, 5, P.ink, [-w / 2 + 28, 0])
  ], { p: float([0, 0], 4, phase, { dims: 2 }) });

  // --- Score ring chip: ring fills 0 -> 98%
  const scoreT = 262;
  const scoreArc = anim([[0, 0, 'hold'], [scoreT + 12, 0, 'inOut'], [scoreT + 60, 98, 'hold'], [360, 98]]);
  const score = group('score', [
    card('scbg', 150, 62, 20, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    ring('sctrack', 40, P.line, 5, [-50, 0]),
    ring('scval', 40, P.green, 5, [-50, 0], { trim: trim(0, scoreArc, 0) }),
    dot('scdot', 8, P.green, [-50, 0]),
    bar('sct', 58, 8, P.ink, [-24, -8]),
    bar('scs', 40, 5, P.faint, [-24, 7])
  ], { p: float([0, 0], 3, 2.4, { dims: 2 }) });

  layers.unshift(
    shapeLayer('Score_Chip', [score], { parent: main.ind, p: [-98, 308], ...lifeL(scoreT, scoreT + 30) }),
    shapeLayer('Keyword_1', [keyword('kw1', 86, P.goldTint, P.gold, 0.6)], { parent: main.ind, p: slideIn([74, 280], 236, 266, [24, 0], { tOut: OUT }), o: fadeIn(236, 252, { tOut: OUT }) }),
    shapeLayer('Keyword_2', [keyword('kw2', 100, P.tealTint, P.teal, 2.8)], { parent: main.ind, p: slideIn([146, 322], 254, 284, [24, 0], { tOut: OUT }), o: fadeIn(254, 270, { tOut: OUT }) }),
    shapeLayer('Traffic_Chart', [chart], { parent: main.ind, p: float([0, 150], 3, 1.8), ...lifeL(chartT, chartT + 32) }),
    shapeLayer('Results', rows, { parent: main.ind, o: holdThenFade }),
    shapeLayer('Search_Bar', [search], { parent: main.ind, p: [0, -318], ...lifeL(0, 30) })
  );
  layers.push(main);
  return L.compose({ nm: 'PrimeLoft SEO', w: 500, h: 820, layers });
}

/* =====================================================================================
 * 4. ABOUT (500x600): three remote teammates in a triangle linked by dashed lines, chat
 *    bubbles, a spinning globe with a time-zone clock, and a final check chip.
 * ===================================================================================== */
export function about(P) {
  const { main, layers } = L.sceneBase(P, { w: 500, h: 600, glowSize: [480, 480] });
  const sh = { shadowColor: P.shadow };

  const seats = [[0, -165], [-160, 115], [160, 115]];
  const tones = [[P.teal, P.tealTint], [P.gold, P.goldTint], [P.red, P.redTint]];

  // --- Avatar card: tinted disc, head + shoulders, name bar, online dot
  const avatar = (i, [x, y], [tone, tint], t0) => group('avatar' + i, [
    card('abg', 100, 110, 22, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    dot('disc', 64, tint, [0, -8]),
    group('shoulders', [ellipse(44, 26), fill(tone)], { p: [0, 12] }),
    dot('head', 26, tone, [0, -22]),
    bar('name', 40, 6, P.ink, [-20, 42]),
    group('online', [ellipse(10, 10), fill(P.green), stroke(P.card, 2)], { p: [36, -40], ...life(t0 + 60, t0 + 80, { from: 0 }) })
  ], { p: [x, y], ...life(t0, t0 + 30) });

  // --- Dashed connection lines between seats, drawn on in sequence
  const link = (i, a, b, t0) => group('link' + i, [path([a, b]), trim(0, drawOn(t0, t0 + 40, { tOut: OUT - 6, dOut: 24 }), 0), stroke(P.lineStrong, 2.5, { dash: [8, 8] })]);
  const links = [link(0, seats[0], seats[1], 64), link(1, seats[0], seats[2], 80), link(2, seats[1], seats[2], 96)];

  // --- Chat bubble (rounded rect + tail + two bars); tail 'left' or 'down'
  const bubble = (nm, p, t0, { w = 110, h = 48, bg = P.card, strokeC = P.line, c1 = P.ink, c2 = P.faint, tail = 'down', phase = 0 } = {}) => {
    const tailPath = tail === 'down'
      ? group('tail', [path([[-7, 0], [7, 0], [0, 9]], { closed: true }), fill(bg)], { p: [-w / 2 + 26, h / 2 - 1] })
      : group('tail', [path([[0, -7], [0, 7], [-9, 0]], { closed: true }), fill(bg)], { p: [-w / 2 + 1, 2] });
    return group(nm, [
      tailPath,
      card(nm + '_bg', w, h, 14, { fill: bg, stroke: strokeC, shadowOpacity: 12, ...sh }),
      bar(nm + '_l1', w - 40, 6, c1, [-w / 2 + 20, -8], { tr: { s: growX(t0 + 10, t0 + 32) } }),
      bar(nm + '_l2', w - 62, 5, c2, [-w / 2 + 20, 7], { tr: { s: growX(t0 + 18, t0 + 40) } })
    ], { p: float(p, 4, phase, { dims: 2 }), ...life(t0, t0 + 26) });
  };
  const bubbles = [
    bubble('bubble0', [110, -184], 128, { tail: 'left', phase: 0 }),
    bubble('bubble1', [-148, 12], 160, { tail: 'down', phase: 2 }),
    bubble('bubble2', [148, 12], 192, { tail: 'down', bg: P.red, strokeC: P.red, c1: P.white, c2: P.redTint, phase: 4 })
  ];

  // --- Globe: tinted sphere, three meridians whose widths follow |cos| (orthographic spin), parallels
  const meridianWidth = (phase) => {
    const keys = [];
    for (let t = 0; t <= 360; t += 15) keys.push([t, [Math.abs(Math.cos((t / 360) * Math.PI + phase)) * 96, 96], 'linear']);
    return anim(keys);
  };
  const meridian = (i, phase) => group('meridian' + i, [{ ty: 'el', d: 1, s: meridianWidth(phase), p: v([0, 0]) }, stroke(P.teal, 1.6, { opacity: 85 })]);
  const globe = group('globe', [
    group('gshadow', [ellipse(100, 100, [0, 12]), fill(P.shadow, 12)]),
    group('sphere', [ellipse(96, 96), fill(P.tealTint)]),
    group('parallel_n', [ellipse(76, 20, [0, -28]), stroke(P.teal, 1.4, { opacity: 60 })]),
    group('parallel_s', [ellipse(76, 20, [0, 28]), stroke(P.teal, 1.4, { opacity: 60 })]),
    group('equator', [ellipse(96, 32), stroke(P.teal, 1.6, { opacity: 85 })]),
    meridian(0, 0), meridian(1, Math.PI / 3), meridian(2, (2 * Math.PI) / 3),
    group('outline', [ellipse(96, 96), stroke(P.teal, 2.6)])
  ], { r: -14 });

  // --- Clock chip: ring face, four ticks, two hands spinning at different speeds
  const clock = group('clock', [
    card('clbg', 60, 60, 18, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    ring('face', 38, P.ink, 2.4, [0, 0]),
    ...[[0, -14], [14, 0], [0, 14], [-14, 0]].map(([x, y], i) => dot('tick' + i, 3, P.faint, [x, y])),
    group('hour', [path([[0, 0], [0, -9]]), stroke(P.ink, 3)], { r: spin(1, 30) }),
    group('minute', [path([[0, 0], [0, -14]]), stroke(P.red, 2.4)], { r: spin(3, 120) }),
    dot('pin', 5, P.ink, [0, 0])
  ], { p: float([0, 0], 4, 1.2, { dims: 2 }) });

  // --- Check chip at the bottom: green disc + drawn-on tick + bar
  const checkT = 236;
  const check = group('check', [
    card('ckbg', 120, 42, 21, { fill: P.card, stroke: P.line, shadowOpacity: 14, ...sh }),
    dot('ckdisc', 24, P.green, [-36, 0]),
    group('tick', [path([[-6, 0], [-2, 4.5], [6, -5]]), trim(0, drawOn(checkT + 20, checkT + 40), 0), stroke(P.white, 2.8)], { p: [-36, 0] }),
    bar('ckt', 56, 6, P.ink, [-18, 0])
  ], { p: float([0, 0], 3, 3, { dims: 2 }) });

  layers.unshift(
    shapeLayer('Check_Chip', [check], { parent: main.ind, p: [0, 228], ...lifeL(checkT, checkT + 28) }),
    shapeLayer('Bubbles', bubbles, { parent: main.ind }),
    shapeLayer('Clock_Chip', [clock], { parent: main.ind, p: [92, -36], ...lifeL(112, 142) }),
    shapeLayer('Globe', [globe], { parent: main.ind, p: float([0, 40], 5, 0.5), ...lifeL(48, 86) }),
    shapeLayer('Avatars', seats.map((s, i) => avatar(i, s, tones[i], 8 + i * 16)), { parent: main.ind }),
    shapeLayer('Links', links, { parent: main.ind })
  );
  layers.push(main);
  return L.compose({ nm: 'PrimeLoft About', w: 500, h: 600, layers });
}
