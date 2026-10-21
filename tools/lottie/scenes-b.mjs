/**
 * Scenes B — PrimeLoft service illustrations (500x820 portrait, 60fps, 360 frames, seamless loops).
 *   design      Product & UX/UI design: a cursor drags a UI card onto a dotted artboard while panels and chips assemble.
 *   wordpress   WordPress block editor: blocks drop from a block palette into a page canvas, plugins pop in, publish.
 *   squarespace Squarespace: template gallery fans in, the pick expands into a gridded site preview, domain + commerce chips.
 * Every content layer resolves out at EXIT so frame 360 equals frame 0 (empty canvas) and the loop never jumps.
 * Run: node tools/lottie/build.mjs design wordpress squarespace
 */
import * as L from './lib.mjs';
const { group, rect, ellipse, fill, stroke, bar, dot, ring, card, anim, shapeLayer, path, trim, gradFill, hex, popIn, fadeIn, float, growX, drawOn } = L;

/* ======================= shared helpers ======================= */
const EXIT = { tOut: 318, dOut: 30 };
/** layer opacity: fade in t0..t1, fade out at EXIT */
const lyrFade = (t0, t1) => fadeIn(t0, t1, EXIT);
/** layer visible from frame 0 (its children stage their own entrances) but still resolves out at EXIT */
const lyrOutOnly = () => anim([[0, 100, 'hold'], [EXIT.tOut, 100, 'in'], [EXIT.tOut + EXIT.dOut, 0, 'hold'], [360, 0]]);
/** group entrance: scale pop with overshoot + fade (2-D group transform) */
const enter = (t0, t1, from = 70) => ({ s: popIn(t0, t1, { from, dims: 2 }), o: fadeIn(t0, t0 + Math.max(6, (t1 - t0) * 0.5)) });
/** group drop-in from above with overshoot (blocks landing on a page) */
const dropIn = ([x, y], t0, dur = 26, dy = -30) => ({
  p: anim([[0, [x, y + dy], 'hold'], [t0, [x, y + dy], 'back'], [t0 + dur, [x, y], 'hold'], [360, [x, y]]]),
  o: fadeIn(t0, t0 + 10)
});
/** opacity blink between 100 and lo from t0 to t1 */
const blink = (t0, t1, period = 44, lo = 25) => {
  const keys = [[0, 0, 'hold'], [t0, 0, 'out'], [t0 + 8, 100, 'inOut']];
  let on = false;
  for (let t = t0 + 8 + period / 2; t < t1 - period / 2; t += period / 2) { keys.push([t, on ? 100 : lo, 'inOut']); on = !on; }
  keys.push([t1, 0, 'hold'], [360, 0]);
  return anim(keys);
};
/** cursor scale "click" bounces at the given frames */
const clicks = (frames) => {
  const keys = [[0, [100, 100], 'hold']];
  frames.forEach((f) => keys.push([f, [100, 100], 'in'], [f + 5, [78, 78], 'back'], [f + 16, [100, 100], 'hold']));
  keys.push([360, [100, 100]]);
  return anim(keys);
};
/** mouse-pointer arrow, tip at the group origin */
const cursor = (P, tr) => group('cursor', [
  path([[0, 0], [0, 17], [4.5, 13], [8, 20.5], [11.5, 19], [8, 12.5], [13, 12.5]], { closed: true }),
  fill(P.ink), stroke(P.bg, 1.8, { join: 2 })
], tr);
/** faint dot grid built from round-capped dashed strokes (one path per row, so it stays small) */
const dotGrid = (P, w, h, step, color) => {
  const cols = Math.floor(w / step), rows = Math.floor(h / step);
  const x0 = -((cols - 1) * step) / 2, y0 = -((rows - 1) * step) / 2;
  const lines = [];
  for (let r = 0; r < rows; r++) lines.push(path([[x0, y0 + r * step], [x0 + (cols - 1) * step, y0 + r * step]]));
  return group('dotgrid', [...lines, stroke(color, 3, { cap: 2, dash: [0.1, step] })]);
};
/** plain filled block (image placeholder, column box ...) */
const block = (nm, w, h, r, color, p = [0, 0], tr = {}) => group(nm, [rect(w, h, r), fill(color)], { p, ...tr });
/** check mark stroke that draws on */
const check = (nm, color, t0, t1, p = [0, 0], w = 3.5) => group(nm, [path([[-9, 1], [-3, 7], [10, -7]]), trim(0, drawOn(t0, t1), 0), stroke(color, w)], { p });

/* =====================================================================
 * 1. DESIGN — Product & UX/UI design
 * ===================================================================== */
export function design(P) {
  const { main, layers } = L.sceneBase(P);

  // Artboard: design-tool canvas with a faint dot grid
  const AB = { p: [25, -30], w: 280, h: 400 };
  const artboard = group('artboard', [
    card('ab', AB.w, AB.h, 20, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    dotGrid(P, AB.w - 44, AB.h - 44, 24, P.lineStrong)
  ], { p: AB.p });

  // UI card drawn by the cursor: corner-anchored marquee grows, then the card snaps in with overshoot
  const UI = { x0: -70, y0: -180, w: 190, h: 170 };
  const UIC = [UI.x0 + UI.w / 2, UI.y0 + UI.h / 2];
  const marquee = group('marquee', [rect(UI.w, UI.h, 12, [UI.w / 2, UI.h / 2]), stroke(P.red, 2, { dash: [7, 6] })], {
    p: [UI.x0, UI.y0],
    s: anim([[0, [0, 0], 'hold'], [74, [0, 0], 'inOut'], [112, [100, 100], 'hold'], [360, [100, 100]]]),
    o: anim([[0, 0, 'hold'], [72, 0, 'out'], [78, 100, 'hold'], [114, 100, 'in'], [124, 0, 'hold'], [360, 0]])
  });
  const padL = -UI.w / 2 + 16;
  const uiCard = group('ui_card', [
    card('uic', UI.w, UI.h, 12, { fill: P.card2, stroke: P.line, shadowOpacity: 8 }),
    block('ui_img', UI.w - 32, 58, 8, P.blueTint, [0, -UI.h / 2 + 16 + 29]),            // hero image placeholder
    bar('ui_t1', 110, 10, P.ink, [padL, 12], { tr: { s: growX(134, 158) } }),               // title line
    bar('ui_t2', 140, 6, P.faint, [padL, 32], { tr: { s: growX(148, 172) } }),              // body line
    group('ui_btn', [rect(84, 28, 14), fill(P.red)], { p: [padL + 42, 62], s: popIn(170, 194, { from: 40, dims: 2 }) }),  // red CTA button
    bar('ui_btntxt', 42, 5, P.white, [padL + 21, 62], { tr: { o: fadeIn(188, 202) } })
  ], { p: UIC, s: popIn(112, 136, { from: 94, dims: 2 }), o: fadeIn(110, 120) });

  // Selection handles blinking around the UI card
  const handles = group('handles', [
    group('sel_outline', [rect(UI.w, UI.h, 12), stroke(P.red, 1.5, { opacity: 70 })]),
    ...[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy], i) =>
      group('h' + i, [rect(9, 9, 1.5), fill(P.card), stroke(P.red, 1.8)], { p: [sx * UI.w / 2, sy * UI.h / 2] }))
  ], { p: UIC, o: blink(128, 312) });

  // Layers / components panel on the left, rows popping in one by one
  const PN = { p: [-140, -120], w: 124, h: 210 };
  const rowColors = [P.red, P.gold, P.teal, P.soft];
  const panelRows = rowColors.map((c, i) => {
    const y = -62 + i * 38;
    return group('row' + i, [
      ...(i === 1 ? [block('rowbg', 108, 30, 8, P.panel, [0, y])] : []),
      block('ico' + i, 14, 14, 4, c, [-42, y]),
      bar('rtxt' + i, 52, 6, P.soft, [-28, y]),
      ring('eye' + i, 9, P.lineStrong, 2, [42, y])
    ], { ...enter(48 + i * 12, 66 + i * 12, 60) });
  });
  const panel = group('panel', [
    card('pn', PN.w, PN.h, 16, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    bar('pn_title', 46, 7, P.ink, [-46, -88]),
    dot('pn_dot', 8, P.red, [42, -88]),
    ...panelRows
  ], { p: PN.p });

  // Floating chips: colour palette, typography, toggle switch
  const PAL = [118, 214];
  const swatches = [P.red, P.gold, P.teal, P.ink].map((c, i) =>
    dot('sw' + i, 22, c, [-51 + i * 34, 0], { tr: { s: popIn(172 + i * 12, 192 + i * 12, { from: 0, dims: 2 }) } }));
  const palette = group('palette', [card('pal', 150, 46, 23, { fill: P.card, stroke: P.line, shadowOpacity: 12 }), ...swatches],
    { p: float(PAL, 4, 1.2, { dims: 2 }), ...enter(150, 174, 60) });

  const typo = group('typo', [
    card('ty', 76, 82, 16, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    block('ty_tall', 14, 42, 4, P.ink, [-13, -2]),
    block('ty_short', 12, 26, 4, P.red, [13, 6]),
    bar('ty_base', 46, 3, P.line, [-23, 28])
  ], { p: float([150, -290], 5, 0, { dims: 2 }), ...enter(60, 86, 60) });

  const TG = [-128, 112];
  const toggle = group('toggle', [
    card('tg', 96, 46, 23, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    bar('tg_txt', 28, 6, P.soft, [-38, 0]),
    group('tg_track', [rect(40, 22, 11), fill(anim([[0, hex(P.lineStrong), 'hold'], [254, hex(P.lineStrong), 'out'], [270, hex(P.red), 'hold'], [360, hex(P.red)]]))], { p: [18, 0] }),
    dot('tg_knob', 16, P.white, [8, 0], { tr: { p: anim([[0, [8, 0], 'hold'], [254, [8, 0], 'back'], [272, [28, 0], 'hold'], [360, [28, 0]]]) } })
  ], { p: float(TG, 4, 2.4, { dims: 2 }), ...enter(96, 120, 60) });

  // Review comment chip (avatar + two lines) filling the bottom-left corner late in the story
  const comment = group('comment', [
    card('cm', 96, 44, 22, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    dot('cm_avatar', 18, P.gold, [-30, 0]),
    bar('cm_l1', 36, 5, P.soft, [-16, -5]),
    bar('cm_l2', 26, 4, P.faint, [-16, 5])
  ], { p: float([-148, 238], 4, 4.1, { dims: 2 }), ...enter(226, 250, 60) });

  // Cursor: appears, draws the marquee, visits the palette, flips the toggle, leaves
  const dragEnd = [UI.x0 + UI.w, UI.y0 + UI.h];
  const cur = cursor(P, {
    p: anim([
      [0, [170, 230], 'hold'], [36, [170, 230], 'inOut'], [70, [UI.x0, UI.y0], 'hold'],
      [74, [UI.x0, UI.y0], 'inOut'], [112, dragEnd, 'hold'],
      [128, dragEnd, 'inOut'], [166, [60, 204], 'hold'],
      [214, [60, 204], 'inOut'], [250, [-124, 106], 'hold'],
      [284, [-124, 106], 'inOut'], [312, [-60, 250], 'hold'], [360, [-60, 250]]
    ]),
    o: anim([[0, 0, 'hold'], [28, 0, 'out'], [40, 100, 'hold'], [296, 100, 'in'], [312, 0, 'hold'], [360, 0]]),
    s: clicks([70, 112, 252])
  });

  layers.unshift(
    shapeLayer('Cursor', [cur], { parent: main.ind }),
    shapeLayer('Selection_Handles', [handles], { parent: main.ind }),
    shapeLayer('Toggle_Chip', [toggle], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Comment_Chip', [comment], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Palette_Chip', [palette], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Type_Chip', [typo], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Layers_Panel', [panel], { parent: main.ind, p: L.slideIn([0, 0], 24, 54, [-46, 0]), o: lyrFade(24, 42) }),
    shapeLayer('UI_Card', [uiCard], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Marquee', [marquee], { parent: main.ind }),
    shapeLayer('Artboard', [artboard], { parent: main.ind, s: popIn(6, 34, { from: 90 }), o: lyrFade(6, 24) })
  );
  layers.push(main);
  return L.compose({ nm: 'PrimeLoft Product & UX/UI Design', layers });
}

/* =====================================================================
 * 2. WORDPRESS — block-editor page build
 * ===================================================================== */
export function wordpress(P) {
  const { main, layers } = L.sceneBase(P);

  // Page canvas card with a slim editor toolbar
  const CV = { p: [22, -12], w: 232, h: 424 };
  const left = CV.p[0] - CV.w / 2 + 20;          // content left edge (abs)
  const cw = CV.w - 40;                           // content width
  const topY = CV.p[1] - CV.h / 2;                // canvas top (abs)
  const canvas = group('canvas', [
    card('cv', CV.w, CV.h, 18, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    // toolbar strip: rounded so it follows the card corners, lower half masked by a card-coloured rect
    block('toolbar', CV.w - 2, 48, 17, P.card2, [0, -CV.h / 2 + 25]),
    block('toolbar_mask', CV.w - 2, 18, 0, P.card, [0, -CV.h / 2 + 40]),
    bar('tb_sep', CV.w - 2, 1, P.line, [-CV.w / 2 + 1, -CV.h / 2 + 31]),
    dot('tb_plus', 14, P.red, [-CV.w / 2 + 20, -CV.h / 2 + 16]),
    group('tb_plus_x', [path([[-4, 0], [4, 0]]), path([[0, -4], [0, 4]]), stroke(P.white, 2)], { p: [-CV.w / 2 + 20, -CV.h / 2 + 16] }),
    bar('tb_a', 26, 5, P.faint, [-CV.w / 2 + 36, -CV.h / 2 + 16]),
    bar('tb_b', 18, 5, P.faint, [-CV.w / 2 + 70, -CV.h / 2 + 16]),
    dot('tb_c', 10, P.lineStrong, [CV.w / 2 - 20, -CV.h / 2 + 16])
  ], { p: CV.p });

  // Blocks landing on the page (absolute positions, rel. MAIN)
  const Y = { h: topY + 62, p: [topY + 92, topY + 108, topY + 124], img: topY + 200, btn: topY + 278, tail: [topY + 318, topY + 334], cols: topY + 380 };
  const heading = bar('b_heading', 140, 14, P.ink, [left, Y.h], { tr: dropIn([left, Y.h], 52) });
  const paras = [cw, cw - 16, cw - 70].map((w, i) => bar('b_para' + i, w, 7, P.faint, [left, Y.p[i]], { tr: dropIn([left, Y.p[i]], 78 + i * 9) }));
  const IMG = [CV.p[0], Y.img];
  const imageBlock = group('b_image', [
    block('img_bg', cw, 112, 10, P.redTint),
    group('img_mtn', [path([[-62, 34], [-28, -6], [-8, 16], [10, -2], [62, 34]]), trim(0, drawOn(164, 196), 0), stroke(P.red, 3.5)]),
    dot('img_sun', 16, P.gold, [40, -28], { tr: { s: popIn(188, 206, { from: 0, dims: 2 }) } })
  ], { p: IMG, s: popIn(148, 172, { from: 40, dims: 2 }), o: fadeIn(148, 158) });
  const button = group('b_button', [
    group('btn_pill', [rect(96, 30, 15), fill(P.red)]),
    bar('btn_txt', 44, 5, P.white, [-22, 0])
  ], dropIn([left + 48, Y.btn], 198));
  const tails = [cw, cw - 50].map((w, i) => bar('b_tail' + i, w, 7, P.faint, [left, Y.tail[i]], { tr: dropIn([left, Y.tail[i]], 214 + i * 9) }));
  const cols = [0, 1].map((i) => {
    const x = left + 46 + i * 100;
    return group('b_col' + i, [block('col_bg', 92, 46, 8, P.panel), bar('col_t', 50, 5, P.soft, [-36, -8]), bar('col_s', 36, 4, P.faint, [-36, 6])],
      dropIn([x, Y.cols], 232 + i * 10));
  });

  // Block palette chips on the left (heading / paragraph / image / button)
  const PX = -162;
  const chipY = [-168, -98, -28, 42];
  const icons = [
    group('ic_h', [path([[-8, -9], [-8, 9]]), path([[8, -9], [8, 9]]), path([[-8, 0], [8, 0]]), stroke(P.ink, 3)]),
    group('ic_p', [rect(22, 3.5, 1.75, [0, -7]), rect(18, 3.5, 1.75, [-2, 0]), rect(12, 3.5, 1.75, [-5, 7]), fill(P.soft)]),
    group('ic_i', [
      group('ic_i_f', [rect(24, 18, 3), stroke(P.ink, 2.2)]),
      group('ic_i_m', [path([[-9, 6], [-3, -1], [1, 3], [4, 0], [9, 6]]), stroke(P.ink, 2)]),
      dot('ic_i_s', 5, P.gold, [5, -4])
    ]),
    group('ic_b', [rect(26, 11, 5.5), fill(P.red)])
  ];
  const paletteChips = icons.map((ic, i) =>
    group('chip' + i, [card('chipc' + i, 58, 58, 14, { fill: P.card, stroke: P.line, shadowOpacity: 12 }), ic], {
      p: L.slideIn([PX, chipY[i]], 22 + i * 8, 52 + i * 8, [-44, 0], { dims: 2 }), o: fadeIn(22 + i * 8, 40 + i * 8)
    }));

  // Drag ghost: translucent image block travelling from the palette chip to its slot on the page
  const ghost = group('ghost', [
    group('ghost_bg', [rect(cw, 112, 10), fill(P.redTint, 70), stroke(P.red, 2, { dash: [8, 6] })]),
    group('ghost_mtn', [path([[-62, 34], [-28, -6], [-8, 16], [10, -2], [62, 34]]), stroke(P.red, 3, { opacity: 60 })])
  ], {
    p: anim([[0, [PX, chipY[2]], 'hold'], [108, [PX, chipY[2]], 'inOut'], [150, IMG, 'hold'], [360, IMG]]),
    s: anim([[0, [22, 22], 'hold'], [108, [22, 22], 'inOut'], [150, [100, 100], 'hold'], [360, [100, 100]]]),
    o: anim([[0, 0, 'hold'], [100, 0, 'out'], [108, 75, 'hold'], [150, 75, 'in'], [160, 0, 'hold'], [360, 0]])
  });

  // Plugin chips on the right: puzzle-piece shapes with small icons
  const puzzleChip = (nm, icon, p, phase, t0) => group(nm, [
    card(nm + '_c', 54, 54, 12, { fill: P.card, shadowOpacity: 14 }),
    dot(nm + '_b1', 16, P.card, [0, -27]), dot(nm + '_b2', 16, P.card, [27, 0]), dot(nm + '_n', 16, P.bg, [-27, 0]),
    icon
  ], { p: float(p, 5, phase, { dims: 2 }), ...enter(t0, t0 + 24, 40) });
  const plugins = [
    puzzleChip('plug0', group('pi0', [path([[-7, 0], [7, 0]]), path([[0, -7], [0, 7]]), stroke(P.red, 3.2)]), [172, -140], 0, 118),
    puzzleChip('plug1', group('pi1', [path([[2, -10], [-6, 1], [-1, 1], [-2, 10], [6, -1], [1, -1]], { closed: true }), fill(P.gold)]), [172, -68], 2.1, 142),
    puzzleChip('plug2', group('pi2', [path([[0, -9], [8, -5], [7, 4], [0, 9], [-7, 4], [-8, -5]], { closed: true }), stroke(P.teal, 2.6)]), [172, 4], 4.2, 166)
  ];

  // Settings gear near the top-right, rotating slowly (1/8 turn per loop: seamless with 8 teeth)
  const gear = (size, teeth) => {
    const r1 = size / 2 - 2, r2 = size / 2 + 7, pts = [];
    for (let i = 0; i < teeth; i++) {
      const a = (i * Math.PI * 2) / teeth, c = Math.cos(a), s = Math.sin(a), tx = -s, ty = c;
      pts.push(path([[c * r1 - tx * 4.5, s * r1 - ty * 4.5], [c * r2 - tx * 3, s * r2 - ty * 3], [c * r2 + tx * 3, s * r2 + ty * 3], [c * r1 + tx * 4.5, s * r1 + ty * 4.5]], { closed: true }));
    }
    return group('gear', [group('teeth', [...pts, fill(P.gold)]), group('rim', [ellipse(size, size), stroke(P.gold, 8)])],
      { p: [172, -300], r: anim([[0, 0, 'linear'], [360, 360 / teeth]]) });
  };

  // Publish pill: pops in, cursor clicks it, it pulses once, turns green and draws a check mark
  const PUB = [92, 266];
  const publish = group('publish', [
    card('pub', 124, 44, 22, { fill: anim([[0, hex(P.red), 'hold'], [246, hex(P.red), 'out'], [262, hex(P.green), 'hold'], [360, hex(P.green)]]), shadowOpacity: 18 }),
    bar('pub_txt', 54, 6, P.white, [-27, 0], { tr: { s: growX(214, 230, { tOut: 244, dOut: 10 }) } }),
    check('pub_check', P.white, 248, 272)
  ], {
    p: PUB,
    s: anim([[0, [60, 60], 'hold'], [200, [60, 60], 'back'], [224, [100, 100], 'hold'], [238, [100, 100], 'in'], [246, [90, 90], 'back'], [268, [100, 100], 'hold'], [360, [100, 100]]]),
    o: fadeIn(200, 212)
  });

  // Cursor: picks the image chip, drags the ghost to the page, then clicks Publish
  const cur = cursor(P, {
    p: anim([
      [0, [PX - 4, chipY[2] - 4], 'hold'], [108, [PX - 4, chipY[2] - 4], 'inOut'], [150, [IMG[0] - 4, IMG[1] - 4], 'hold'],
      [168, [IMG[0] - 4, IMG[1] - 4], 'inOut'], [206, [PUB[0] - 12, PUB[1] - 4], 'hold'],
      [262, [PUB[0] - 12, PUB[1] - 4], 'inOut'], [300, [160, 330], 'hold'], [360, [160, 330]]
    ]),
    o: anim([[0, 0, 'hold'], [88, 0, 'out'], [100, 100, 'hold'], [284, 100, 'in'], [300, 0, 'hold'], [360, 0]]),
    s: clicks([102, 150, 238])
  });

  layers.unshift(
    shapeLayer('Cursor', [cur], { parent: main.ind }),
    shapeLayer('Drag_Ghost', [ghost], { parent: main.ind }),
    shapeLayer('Publish_Pill', [publish], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Plugin_Chips', plugins, { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Settings_Gear', [gear(34, 8)], { parent: main.ind, o: lyrFade(30, 56) }),
    shapeLayer('Block_Palette', paletteChips, { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Page_Blocks', [heading, ...paras, imageBlock, button, ...tails, ...cols], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Page_Canvas', [canvas], { parent: main.ind, s: popIn(6, 34, { from: 90 }), o: lyrFade(6, 24) })
  );
  layers.push(main);
  return L.compose({ nm: 'PrimeLoft WordPress Development', layers });
}

/* =====================================================================
 * 3. SQUARESPACE — template gallery to live site
 * ===================================================================== */
export function squarespace(P) {
  const { main, layers } = L.sceneBase(P);

  // Template thumbnails (112x144) with three different mini layouts
  const TW = 112, TH = 144;
  const thumb = (nm, items, tr) => group(nm, [card(nm + '_c', TW, TH, 12, { fill: P.card, stroke: P.line, shadowOpacity: 12 }), ...items], tr);
  const layoutA = [  // hero + text + two boxes
    block('a_hero', 92, 44, 6, P.tealTint, [0, -40]),
    bar('a_t', 60, 6, P.ink, [-46, -8]), bar('a_l1', 84, 4, P.faint, [-46, 5]), bar('a_l2', 70, 4, P.faint, [-46, 14]),
    block('a_b1', 42, 30, 5, P.panel, [-25, 42]), block('a_b2', 42, 30, 5, P.panel, [25, 42])
  ];
  const layoutB = [  // image + heading + three columns (the one we pick)
    block('b_img', 92, 52, 6, P.redTint, [0, -36]),
    bar('b_t', 56, 6, P.ink, [-46, 0]), bar('b_l1', 84, 4, P.faint, [-46, 12]),
    block('b_c1', 26, 30, 4, P.goldTint, [-30, 44]), block('b_c2', 26, 30, 4, P.tealTint, [0, 44]), block('b_c3', 26, 30, 4, P.blueTint, [30, 44])
  ];
  const layoutC = [  // sidebar layout
    block('c_side', 28, 120, 5, P.goldTint, [-32, 0]),
    bar('c_t', 52, 6, P.ink, [-12, -50]), bar('c_l1', 50, 4, P.faint, [-12, -36]), bar('c_l2', 44, 4, P.faint, [-12, -26]), bar('c_l3', 38, 4, P.faint, [-12, -16]),
    block('c_box', 56, 44, 5, P.panel, [16, 26])
  ];
  // fan-in from the centre, then selection: middle grows + red outline, sides shrink and dim
  const fan = (to, rot, t0, t1, selected) => ({
    p: anim([[0, [0, -248], 'hold'], [t0, [0, -248], 'back'], [t1, to, 'hold'], [360, to]]),
    r: anim([[0, 0, 'hold'], [t0, 0, 'out'], [t1, rot, 'hold'], [360, rot]]),
    s: anim([[0, [70, 70], 'hold'], [t0, [70, 70], 'back'], [t1, [100, 100], 'hold'], [92, [100, 100], selected ? 'back' : 'inOut'], [112, selected ? [108, 108] : [92, 92], 'hold'], [360, selected ? [108, 108] : [92, 92]]]),
    o: anim([[0, 0, 'hold'], [t0, 0, 'out'], [t0 + 12, 100, 'hold'], [92, 100, 'inOut'], [112, selected ? 100 : 45, 'hold'], [360, selected ? 100 : 45]])
  });
  const tLeft = thumb('tpl_left', layoutA, fan([-128, -258], -9, 26, 60, false));
  const tRight = thumb('tpl_right', layoutC, fan([128, -258], 9, 32, 66, false));
  const tMid = thumb('tpl_mid', [...layoutB,
    group('sel', [rect(TW + 8, TH + 8, 14), stroke(P.red, 2.5, { opacity: fadeIn(92, 108) })]),
    group('sel_tick', [dot('sel_tick_bg', 22, P.red), check('sel_tick_mark', P.white, 100, 116, [0, 0], 2.6)], { p: [TW / 2 + 2, -TH / 2 - 2], s: popIn(96, 116, { from: 0, dims: 2 }) })
  ], fan([0, -248], 0, 18, 52, true));

  // Site preview card: expands out of the selected thumbnail, content assembles on a column grid
  const PW = 300, PH = 370, PP = [0, 100];
  const inner = PW - 40, pl = -inner / 2;
  const colX = [-inner / 2, -inner / 6, inner / 6, inner / 2];
  const grid = group('grid', [...colX.map((x) => path([[x, -140], [x, 170]])), trim(0, drawOn(156, 182), 0), stroke(P.lineStrong, 1.5, { dash: [5, 5] })],
    { o: anim([[0, 55, 'hold'], [252, 55, 'out'], [262, 100, 'inOut'], [286, 55, 'hold'], [360, 55]]) });
  const addr = group('addr', [
    block('addr_bg', inner, 22, 11, P.bg),
    dot('addr_d1', 6, P.red, [pl + 12, 0]), dot('addr_d2', 6, P.gold, [pl + 24, 0]), dot('addr_d3', 6, P.teal, [pl + 36, 0]),
    bar('addr_txt', 80, 4, P.faint, [pl + 50, 0])
  ], { p: [0, -160] });
  const hero = group('hero', [
    group('hero_bg', [rect(inner, 118, 10), gradFill([[0, P.redTint], [1, P.goldTint]], [-inner / 2, -59], [inner / 2, 59])]),
    bar('hero_t', 92, 8, P.white, [pl + 16, 26]), bar('hero_s', 60, 5, P.white, [pl + 16, 40], { opacity: 85 })
  ], { p: [0, -78], ...enter(170, 194, 92) });
  const heading = bar('pv_h', 150, 12, P.ink, [pl, 2], { tr: { s: growX(190, 214) } });
  const line1 = bar('pv_l1', inner - 20, 6, P.faint, [pl, 22], { tr: { s: growX(202, 226) } });
  const line2 = bar('pv_l2', inner - 70, 6, P.faint, [pl, 36], { tr: { s: growX(212, 236) } });
  const boxColors = [P.tealTint, P.blueTint, P.goldTint];
  const boxes = boxColors.map((c, i) => {
    const x = (i - 1) * (inner / 3), y = 108;
    return group('sec' + i, [block('sec_bg', inner / 3 - 10, 72, 8, c), bar('sec_t', 40, 5, P.soft, [-inner / 6 + 14, 20]), dot('sec_d', 14, P.card, [-inner / 6 + 20, -14])], {
      p: anim([[0, [x + 24, y], 'hold'], [246 + i * 4, [x + 24, y], 'back'], [268 + i * 4, [x, y], 'hold'], [360, [x, y]]]),
      o: fadeIn(224 + i * 6, 238 + i * 6)
    });
  });
  const footer = bar('pv_f', 120, 5, P.line, [pl, 168], { tr: { s: growX(270, 290) } });
  const preview = group('preview', [
    card('pv', PW, PH, 18, { fill: P.card, stroke: P.line, shadowOpacity: 14 }),
    grid, addr, hero, heading, line1, line2, ...boxes, footer
  ], {
    p: anim([[0, [0, -248], 'hold'], [120, [0, -248], 'out'], [156, PP, 'hold'], [360, PP]]),
    s: anim([[0, [34, 34], 'hold'], [120, [34, 34], 'back'], [156, [100, 100], 'hold'], [360, [100, 100]]]),
    o: fadeIn(120, 134)
  });

  // "Domain connected" chip: globe + pulsing green status dot + text bars
  const globe = group('globe', [
    group('g_ring', [ellipse(20, 20), stroke(P.teal, 2)]),
    group('g_mer', [ellipse(9, 20), stroke(P.teal, 1.6)]),
    group('g_eq', [path([[-10, 0], [10, 0]]), stroke(P.teal, 1.6)])
  ], { p: [-62, 0] });
  const domain = group('domain', [
    card('dm', 176, 44, 22, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    globe,
    dot('dm_ok', 10, P.green, [-42, 0], { tr: { s: L.pulse(100, 25, 90, { dims: 2 }) } }),
    bar('dm_txt', 74, 6, P.ink, [-30, -5], { tr: { s: growX(262, 284) } }),
    bar('dm_sub', 44, 4, P.faint, [-30, 6], { tr: { s: growX(270, 290) } })
  ], { p: [-62, 322], ...enter(240, 264, 70) });

  // Shopping-bag chip hinting at commerce
  const bag = group('bag', [
    card('bg', 60, 60, 16, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    group('bag_body', [path([[-11, -3], [11, -3], [9, 13], [-9, 13]], { closed: true }), stroke(P.red, 2.6)]),
    group('bag_handle', [path([[-6, -3, [0, 0], [0, -8]], [6, -3, [0, -8], [0, 0]]]), stroke(P.red, 2.6)]),
    dot('bag_badge', 10, P.gold, [16, -16])
  ], { p: float([152, 262], 5, 3.5, { dims: 2 }), ...enter(262, 286, 40) });

  layers.unshift(
    shapeLayer('Bag_Chip', [bag], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Domain_Chip', [domain], { parent: main.ind, p: L.slideIn([0, 0], 240, 268, [-50, 0]), o: lyrOutOnly() }),
    shapeLayer('Template_Selected', [tMid], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Templates_Side', [tLeft, tRight], { parent: main.ind, o: lyrOutOnly() }),
    shapeLayer('Site_Preview', [preview], { parent: main.ind, p: float([0, 0], 4, 0), o: lyrOutOnly() })
  );
  layers.push(main);
  return L.compose({ nm: 'PrimeLoft Squarespace Design', layers });
}
