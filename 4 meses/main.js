/* ============================================================
   ANNIVERSARY_SYSTEM — main.js
   ============================================================ */

(function () {
  'use strict';

  const output    = document.getElementById('output');
  const cursorEnd = document.getElementById('cursor-end');

  /* ── Timing (ms) ── */
  const CFG = {
    boot:      200,   // entre líneas de arranque
    stat:      90,   // entre líneas de estadísticas
    asciiLine: 20,    // ms por tick del ASCII (más lento = efecto impresora)
    asciiBatch: 2,    // filas por tick (2 = ritmo elegante sin ser eterno)
    finalLine: 200,   // entre líneas del mensaje final
  };

  /* ── Contenido editable ── */
  const STATUS_ROWS = [
    ['Name',            'Ashley'],
    ['Status',          'Importante'],
    ['Distance',        'Lejos'],
    ['Emotion level',   'Alto'],
    ['Reason to smile', 'Detectada'],
  ];

  const STATS_LINES = [
    'Meses juntos...............4',
    'Recuerdos compartidos......varios',
    'Videollamadas..............au nop',
    'Detalles dedicados.........muchos',
    'Ganas de verla.............∞',
  ];

  const ANALYZE_LINES = [
    '[✓] chemistry detected',
    '[✓] affection detected',
    '[✓] patience improving',
    '[✓] emotional stability: in progress',
  ];

  const FINAL_LINES = [
    'Gracias por estos 4 meses.',
    'No han sido perfectos,',
    'pero han sido nuestros.',
    'Y me alegra seguir aquí contigo.',
    'te amo',
  ];

  /* ════════════════════════════════
     HELPERS DOM
  ════════════════════════════════ */

  function insert(node) {
    if (cursorEnd.parentNode === output) output.insertBefore(node, cursorEnd);
    else output.appendChild(node);
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)  n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function addLine(text, cls, delay, soundFn) {
    return new Promise(resolve => {
      setTimeout(() => {
        const n = el('div', 'line ' + (cls || ''), text);
        insert(n);
        requestAnimationFrame(() => n.classList.add('visible'));
        if (soundFn) soundFn();
        resolve();
      }, delay);
    });
  }

  function addGap(delay) {
    return new Promise(resolve => {
      setTimeout(() => { insert(el('div', 'section-gap')); resolve(); }, delay);
    });
  }

  function addDivider(delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        const hr = el('hr', 'divider');
        insert(hr);
        requestAnimationFrame(() => hr.classList.add('visible'));
        Sound.divider();
        resolve();
      }, delay);
    });
  }

  function addStatusBlock(delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        const block = el('div', 'status-block');
        STATUS_ROWS.forEach(([k, v]) => {
          const row = el('div', 'status-row');
          row.appendChild(el('span', 'status-key', k));
          row.appendChild(el('span', '', v));
          block.appendChild(row);
        });
        insert(block);
        requestAnimationFrame(() => block.classList.add('visible'));
        resolve();
      }, delay);
    });
  }

  /* ── ASCII render con sonido de impresora ── */
  function renderASCII(startDelay) {
    return new Promise(resolve => {
      setTimeout(() => {
        const container = el('div', '');
        container.id = 'ascii-container';
        container.classList.add('visible');
        insert(container);

        const lines = ASCII_ART.split('\n');
        let i = 0;
        let soundCounter = 0;

        function step() {
          if (i < lines.length) {
            let chunk = '';
            for (let b = 0; b < CFG.asciiBatch && i < lines.length; b++, i++) {
              chunk += lines[i] + '\n';
            }
            container.textContent += chunk;

            // Sonido cada 2 ticks para no saturar
            soundCounter++;
            if (soundCounter % 2 === 0) Sound.asciiTick();

            setTimeout(step, CFG.asciiLine);
          } else {
            resolve();
          }
        }
        step();
      }, startDelay);
    });
  }

  /* ════════════════════════════════
     SECUENCIA PRINCIPAL
  ════════════════════════════════ */
  async function run() {
    let t = 200;

    // Sonido de arranque al inicio
    setTimeout(() => Sound.boot(), 300);

    /* 1 — Boot */
    const bootLines = [
      ['> booting anniversary_system.exe', 'dim'],
      ['> initializing memory...',          'dim'],
      ['> loading relationship modules...', 'dim'],
      ['> loading emotional archive...',    'dim'],
      ['> verifying connection...',         'dim'],
      ['> Ashley detected',                 'accent'],
      ['> rendering visual memory...',      'dim'],
    ];

    for (const [txt, cls] of bootLines) {
      const snd = cls === 'accent' ? Sound.accent : Sound.tick;
      await addLine(txt, cls, t, snd);
      t += CFG.boot;
    }

    /* 2 — ASCII (más lento, con sonido de impresora) */
    await addGap(t); t += 100;
    document.getElementById('bgMusic')?.play().catch(()=>{});
    await renderASCII(t);

    const rows = ASCII_ART.split('\n').length;
    t += Math.ceil(rows / CFG.asciiBatch) * CFG.asciiLine + 500;

    /* 3 — Confirmaciones */
    await addGap(t);                                                             t += 200;
    await addLine('[✓] visual memory loaded',        'success', t, Sound.confirm); t += 120;
    await addLine('[✓] image decoded successfully',  'success', t, Sound.confirm); t += 120;
    await addLine('[✓] relationship file accessible','success', t, Sound.confirm); t += 120;

    /* 4 — Status */
    await addGap(t);         t += 200;
    await addStatusBlock(t); t += 180;

    /* 5 — Divider */
    await addDivider(t); t += 120;
    await addGap(t);     t += 80;

    /* 6 — status_relationship.exe */
    await addLine('> status_relationship.exe', 'big-prompt', t, Sound.tick); t += 180;
    for (const l of STATS_LINES) {
      await addLine(l, '', t, Sound.tick);
      t += CFG.stat;
    }

    /* 7 — analyze_connection.exe */
    await addGap(t);  t += 280;
    await addLine('> analyze_connection.exe', 'big-prompt', t, Sound.tick); t += 180;
    for (const l of ANALYZE_LINES) {
      await addLine(l, 'success', t, Sound.confirm);
      t += CFG.stat;
    }

    /* 8 — future.exe */
    await addGap(t);  t += 280;
    await addLine('> future.exe',  'big-prompt', t, Sound.tick); t += 180;
    await addLine('Processing...', 'dim',        t, Sound.tick); t += 250;
    await addGap(t);                                                              t += 150;
    await addLine('Error:',                          'error-line', t, Sound.error); t += 450;
    await addLine('The future cannot be predicted.', 'error-line', t, Sound.error); t += 950;
    await addGap(t);                                                                t += 180;
    await addLine('But I like discovering it with you.', 'accent', t, Sound.accent); t += 700;

    /* 9 — Mensaje final */
    await addDivider(t); t += 500;
    await addGap(t);     t += 180;

    for (const l of FINAL_LINES) {
      await addLine(l, 'final', t, l ? Sound.finalTone : null);
      t += l === '' ? 180 : CFG.finalLine;
    }
    await addGap(t);
  }

  /* ── Esperar interacción del usuario para iniciar AudioContext ──
     Los navegadores bloquean audio hasta que haya un gesto del usuario. */
  function startOnInteraction() {
    const overlay = document.getElementById('start-overlay');

    function begin() {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 400);
      run();
    }

    overlay.addEventListener('click', begin);
    overlay.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') begin();
    });
    overlay.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startOnInteraction);
  } else {
    startOnInteraction();
  }

})();
