/**
 * QA & Testing scene: a test runner passes checks, catches a bug under a magnifier,
 * the bug is fixed, devices get scanned, a coverage ring fills and a shield badge pops.
 */
import * as L from './lib.mjs';
const { group, rect, ellipse, fill, stroke, bar, dot, card, anim, shapeLayer, path, trim, v } = L;

export function quality(P) {
  const { main, layers } = L.sceneBase(P);
  const cardW = 300;

  /* ----- Test runner card (top) ----- */
  const rows = [0, 1, 2, 3, 4];
  const rowY = (i) => -150 + i * 34;
  const statusAt = (i) => 40 + i * 26;
  const bugRow = 2;
  const runnerRows = rows.map((i) => {
    const t = statusAt(i);
    const isBug = i === bugRow;
    const spinner = group('spin' + i, [ellipse(14, 14), trim(0, 70, 0), stroke(P.faint, 2.4)], {
      p: [-118, rowY(i)], r: L.spin(4), o: anim([[0, 100, 'hold'], [t, 100, 'out'], [t + 8, 0, 'hold'], [330, 0, 'hold'], [342, 100, 'hold'], [360, 100]])
    });
    const check = group('check' + i, [
      group('bg', [ellipse(16, 16), fill(P.green)]),
      group('tick', [path([[-4, 0], [-1, 3], [4, -3]]), stroke(P.white, 2.2)])
    ], { p: [-118, rowY(i)], s: isBug ? L.popIn(200, 220, { from: 0, tOut: 330, dOut: 12, dims: 2 }) : L.popIn(t, t + 18, { from: 0, tOut: 330, dOut: 12, dims: 2 }) });
    const label = bar('lbl' + i, 90 + (i % 3) * 25, 7, P.ink, [-100, rowY(i)]);
    const dur = bar('dur' + i, 26, 6, P.faint, [96, rowY(i)], { tr: { o: L.fadeIn(t, t + 14, { tOut: 330, dOut: 12 }) } });
    const rowBg = group('rowbg' + i, [rect(cardW - 24, 26, 8), fill(isBug ? P.redTint : P.card2)], {
      p: [0, rowY(i)], o: isBug ? anim([[0, 0, 'hold'], [t, 0, 'out'], [t + 10, 100, 'hold'], [196, 100, 'out'], [210, 0, 'hold'], [360, 0]]) : v(100)
    });
    const items = [rowBg, label, dur, spinner, check];
    if (isBug) {
      items.push(group('cross', [
        group('bg', [ellipse(16, 16), fill(P.red)]),
        group('x', [path([[-3.5, -3.5], [3.5, 3.5]]), stroke(P.white, 2.2)]),
        group('x2', [path([[3.5, -3.5], [-3.5, 3.5]]), stroke(P.white, 2.2)])
      ], { p: [-118, rowY(i)], s: L.popIn(t, t + 18, { from: 0, tOut: 196, dOut: 10, dims: 2 }) }));
    }
    return group('row' + i, items);
  });
  const trackW = cardW - 24;
  const progress = group('progress', [
    group('track', [rect(trackW, 6, 3, [0, 0]), fill(P.line)]),
    group('fill', [rect(trackW, 6, 3, [trackW / 2, 0]), fill(P.green)], { p: [-trackW / 2, 0], s: anim([[0, [0, 100], 'hold'], [40, [0, 100], 'out'], [220, [100, 100], 'hold'], [330, [100, 100], 'in'], [342, [0, 100], 'hold'], [360, [0, 100]]]) })
  ], { p: [0, 30] });
  const runner = group('runner', [
    card('runnerCard', cardW, 250, 18, { fill: P.card, stroke: P.line, shadowOpacity: 12, p: [0, -75] }),
    group('titlebar', [rect(cardW, 34, 0, [0, -183]), fill(P.card2)]),
    dot('d1', 7, P.red, [-130, -183]), dot('d2', 7, P.gold, [-118, -183]), dot('d3', 7, P.teal, [-106, -183]),
    bar('title', 70, 6, P.faint, [-90, -183]),
    ...runnerRows,
    progress
  ], { p: [0, -150] });

  /* ----- Bug under magnifier (middle-left), then fixed ----- */
  const bug = group('bug', [
    group('legs', [path([[-10, -4], [-16, -8]]), path([[-10, 2], [-17, 2]]), path([[-10, 8], [-16, 12]]), path([[10, -4], [16, -8]]), path([[10, 2], [17, 2]]), path([[10, 8], [16, 12]]), stroke(P.ink, 2)]),
    group('body', [ellipse(20, 26), fill(P.red)]),
    group('head', [ellipse(12, 10, [0, -14]), fill(P.ink)]),
    group('spots', [ellipse(5, 5, [-4, -2]), ellipse(5, 5, [4, 4]), ellipse(4, 4, [-3, 7]), fill(P.ink)]),
    group('line', [path([[0, -8], [0, 12]]), stroke(P.ink, 1.5)])
  ], { s: anim([[0, [0, 0], 'hold'], [92, [0, 0], 'back'], [112, [100, 100], 'hold'], [196, [100, 100], 'in'], [212, [0, 0], 'hold'], [360, [0, 0]]]), r: anim([[0, -8, 'inOut'], [150, 8, 'inOut'], [300, -8, 'inOut'], [360, -8]]) });
  const fixedTick = group('fixed', [
    group('bg', [ellipse(44, 44), fill(P.green)]),
    group('tick', [path([[-11, 1], [-3, 9], [12, -8]]), trim(0, L.drawOn(214, 236, { tOut: 330, dOut: 10 }), 0), stroke(P.white, 4)])
  ], { s: L.popIn(206, 226, { from: 0, tOut: 330, dOut: 12, dims: 2 }) });
  const magnifier = group('magnifier', [
    group('handle', [path([[26, 26], [52, 52]]), stroke(P.ink, 10)]),
    group('glass', [ellipse(76, 76), fill(P.card, 70), stroke(P.ink, 6)]),
    bug, fixedTick,
    group('shine', [path([[-22, -10], [-10, -22]]), stroke(P.white, 3)])
  ], { p: [-110, 120], s: L.popIn(70, 96, { from: 0, tOut: 332, dOut: 14, dims: 2 }) });

  /* ----- Devices (middle-right) with a scanning line ----- */
  const browser = group('browser', [
    card('bw', 150, 110, 12, { fill: P.card, stroke: P.line, shadowOpacity: 10 }),
    group('bwbar', [rect(150, 20, 0, [0, -45]), fill(P.card2)]),
    dot('b1', 5, P.red, [-62, -45]), dot('b2', 5, P.gold, [-54, -45]),
    bar('bl1', 70, 6, P.ink, [-62, -22]), bar('bl2', 100, 5, P.line, [-62, -8]), bar('bl3', 84, 5, P.line, [-62, 4]),
    group('bbtn', [rect(40, 12, 6, [-42, 26]), fill(P.red)])
  ], { p: [70, 100], s: L.popIn(110, 134, { from: 0, tOut: 332, dOut: 14, dims: 2 }) });
  const phone = group('phone', [
    card('pw', 56, 104, 12, { fill: P.ink, shadowOpacity: 14 }),
    group('screen', [rect(46, 90, 7), fill(P.card)]),
    bar('pl1', 30, 5, P.ink, [-15, -28]), bar('pl2', 34, 4, P.line, [-17, -16]), bar('pl3', 28, 4, P.line, [-14, -6]),
    group('pbtn', [rect(26, 9, 4.5, [0, 30]), fill(P.red)])
  ], { p: [160, 118], s: L.popIn(126, 150, { from: 0, tOut: 332, dOut: 14, dims: 2 }) });
  const scan = group('scan', [rect(150, 3, 1.5), fill(P.teal, 80)], {
    p: anim([[0, [70, 45], 'hold'], [140, [70, 45], 'inOut'], [200, [70, 155], 'inOut'], [260, [70, 45], 'inOut'], [320, [70, 155], 'hold'], [360, [70, 155]]]),
    o: anim([[0, 0, 'hold'], [140, 0, 'out'], [150, 100, 'hold'], [316, 100, 'in'], [326, 0, 'hold'], [360, 0]])
  });

  /* ----- Coverage ring chip + shield badge (bottom) ----- */
  const coverage = group('coverage', [
    card('covCard', 150, 64, 32, { fill: P.card, stroke: P.line, shadowOpacity: 12 }),
    group('ringbg', [ellipse(40, 40), stroke(P.line, 6)], { p: [-45, 0] }),
    group('ring', [ellipse(40, 40), trim(0, L.drawOn(160, 240, { tOut: 332, dOut: 10 }), 0), stroke(P.red, 6)], { p: [-45, 0], r: -90 }),
    bar('cv1', 60, 7, P.ink, [-15, -8]), bar('cv2', 40, 5, P.faint, [-15, 8])
  ], { p: [-95, 268], s: L.popIn(150, 176, { from: 0, tOut: 334, dOut: 12, dims: 2 }) });
  const shield = group('shield', [
    group('sh', [path([[0, -34], [30, -22], [30, 2, [0, -10], [0, 14]], [0, 34, [18, 0], [-18, 0]], [-30, 2, [0, 14], [0, -10]], [-30, -22]], { closed: true }), fill(P.teal)]),
    group('shin', [path([[0, -24], [20, -16], [20, 0, [0, -8], [0, 10]], [0, 24, [12, 0], [-12, 0]], [-20, 0, [0, 10], [0, -8]], [-20, -16]], { closed: true }), fill(P.card, 25)]),
    group('tick', [path([[-11, 0], [-3, 8], [12, -8]]), trim(0, L.drawOn(262, 284, { tOut: 334, dOut: 10 }), 0), stroke(P.white, 5)])
  ], { p: [120, 265], s: L.popIn(246, 272, { from: 0, tOut: 334, dOut: 12, dims: 2 }), r: anim([[0, -6, 'inOut'], [180, 6, 'inOut'], [360, -6]]) });

  layers.unshift(
    shapeLayer('Shield_Badge', [shield], { parent: main.ind }),
    shapeLayer('Coverage_Chip', [coverage], { parent: main.ind }),
    shapeLayer('Scan_Line', [scan], { parent: main.ind }),
    shapeLayer('Devices', [browser, phone], { parent: main.ind }),
    shapeLayer('Magnifier_Bug', [magnifier], { parent: main.ind, p: L.float([0, 0], 5, 1) }),
    shapeLayer('Test_Runner', [runner], { parent: main.ind, p: L.float([0, 0], 6, 0), s: L.popIn(10, 40, { from: 0, tOut: 334, dOut: 14 }) })
  );
  layers.push(main);
  return L.compose({ nm: 'PrimeLoft QA and Testing', layers });
}
