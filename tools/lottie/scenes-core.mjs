/**
 * Core scenes: 404 (lost page) — also serves as the reference implementation for the lib.
 * Run: node tools/lottie/build.mjs
 */
import * as L from './lib.mjs';
const { group, rect, ellipse, fill, stroke, bar, dot, card, anim, shapeLayer, path, trim, gradFill } = L;

/* ---------- 404: a browser card loses its content, a magnifier searches, a "home" chip pops ---------- */
export function notFound(P) {
  const { main, layers } = L.sceneBase(P, { w: 500, h: 500, glowSize: [460, 460] });

  // Browser window
  const win = group('window', [
    card('frame', 330, 230, 18, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    // title bar
    group('tbar', [rect(330, 36, 0, [0, -97]), fill(P.card2)]),
    dot('d1', 8, P.red, [-146, -97]), dot('d2', 8, P.gold, [-132, -97]), dot('d3', 8, P.teal, [-118, -97]),
    group('url', [rect(170, 16, 8, [10, -97]), fill(P.bg)]),
    bar('urltxt', 70, 5, P.faint, [-65, -97]),
  ]);

  // Content that drops away (lines fall and fade)
  const lines = [[-120, -55, 200], [-120, -35, 150], [-120, -15, 180], [-120, 5, 110]].map(([x, y, w], i) =>
    bar('ln' + i, w, 8, P.line, [x, y], { tr: {
      p: anim([[0, [x, y], 'hold'], [60 + i * 8, [x, y], 'in'], [100 + i * 8, [x, y + 70], 'hold'], [300, [x, y + 70], 'hold'], [312, [x, y], 'hold'], [360, [x, y]]]),
      o: anim([[0, 100, 'hold'], [60 + i * 8, 100, 'in'], [100 + i * 8, 0, 'hold'], [300, 0, 'hold'], [312, 100, 'hold'], [360, 100]])
    } }));
  const imgBlock = group('img', [rect(90, 70, 10), fill(P.redTint)], {
    p: anim([[0, [95, -20], 'hold'], [70, [95, -20], 'in'], [110, [95, 60], 'hold'], [300, [95, 60], 'hold'], [312, [95, -20], 'hold'], [360, [95, -20]]]),
    o: anim([[0, 100, 'hold'], [70, 100, 'in'], [110, 0, 'hold'], [300, 0, 'hold'], [312, 100, 'hold'], [360, 100]])
  });

  // "404" built from bars (digits as 7-seg-ish strokes)
  const seg = (nm, pts, dly) => group(nm, [path(pts), trim(0, L.drawOn(130 + dly, 170 + dly, { tOut: 290, dOut: 14 }), 0), stroke(P.red, 9, { cap: 2, join: 2 })]);
  const four = (ox, dly) => [
    seg('f' + ox + 'a', [[ox - 18, -40], [ox - 18, -2], [ox + 18, -2]], dly),
    seg('f' + ox + 'b', [[ox + 18, -40], [ox + 18, 28]], dly + 6)
  ];
  const zero = group('zero', [ellipse(44, 62), trim(0, L.drawOn(140, 190, { tOut: 290, dOut: 14 }), 0), stroke(P.ink, 9)], { p: [0, -6] });
  const digits = group('digits', [...four(-62, 0), zero, ...four(62, 12)], { p: [0, -20] });

  // Magnifier sweeping
  const mag = group('magnifier', [
    group('handle', [path([[16, 16], [40, 40]]), stroke(P.ink, 8)]),
    group('glass', [ellipse(48, 48), fill(P.card, 55), stroke(P.ink, 6)]),
    group('shine', [path([[-12, -6], [-4, -14]]), stroke(P.white, 3)])
  ], {
    p: anim([[0, [120, 90], 'inOut'], [90, [-110, 60], 'inOut'], [180, [60, 95], 'inOut'], [270, [-40, 40], 'inOut'], [360, [120, 90]]]),
    r: anim([[0, -8, 'inOut'], [180, 8, 'inOut'], [360, -8]])
  });

  // Home chip
  const chip = group('home_chip', [
    card('chipbg', 128, 40, 20, { fill: P.ink, shadow: true, shadowOpacity: 16 }),
    group('house', [path([[-10, 2], [0, -7], [10, 2]]), stroke(P.bg, 2.4)], { p: [-42, 0] }),
    group('houseb', [rect(12, 9, 1, [0, 3]), stroke(P.bg, 2.2)], { p: [-42, 0] }),
    bar('chiptxt', 60, 6, P.bg, [-26, 0])
  ], { p: [0, 150], s: L.popIn(200, 230, { tOut: 320, dOut: 20, dims: 2 }) });

  // Question marks floating
  const q = (x, y, ph, c) => group('q', [path([[-7, -8, [0, 0], [0, -10]], [0, -14, [-6, 0], [6, 0]], [7, -8, [0, -6], [0, 6]], [0, -1, [4, -3], [0, 3]], [0, 5]]), stroke(c, 3.2)], {
    p: L.float([x, y], 8, ph, { dims: 2 }), o: anim([[0, 0, 'hold'], [150, 0, 'out'], [180, 70, 'hold'], [300, 70, 'in'], [320, 0, 'hold'], [360, 0]])
  });

  layers.unshift(
    shapeLayer('Question_Marks', [q(-175, -120, 0, P.gold), q(185, -150, 1.5, P.red), q(190, 60, 3, P.teal)], { parent: main.ind }),
    shapeLayer('Home_Chip', [chip], { parent: main.ind }),
    shapeLayer('Magnifier', [mag], { parent: main.ind }),
    shapeLayer('Digits', [digits], { parent: main.ind }),
    shapeLayer('Content', [...lines, imgBlock], { parent: main.ind, p: [0, 0] }),
    shapeLayer('Window', [win], { parent: main.ind, p: L.float([0, -10], 5, 0) })
  );
  // Content sits above window but window must be behind: reorder so Window is last (bottom) — done by push order above.
  layers.push(main);
  return L.compose({ nm: 'PrimeLoft 404 Lost Page', w: 500, h: 500, layers });
}
