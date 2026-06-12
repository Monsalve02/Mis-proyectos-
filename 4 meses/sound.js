/* ============================================================
   ANNIVERSARY_SYSTEM — sound.js
   Sonidos generados con Web Audio API (sin archivos externos).
   Estilo: bleeps de consola retro / Undertale dialog tone.
   ============================================================ */

const Sound = (function () {
  'use strict';

  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  /**
   * Tono base tipo Undertale: onda cuadrada corta con envelope rápido.
   * @param {number} freq   - frecuencia en Hz
   * @param {number} dur    - duración en segundos
   * @param {number} vol    - volumen 0..1
   * @param {string} type   - 'square' | 'sine' | 'triangle'
   */
  function beep(freq, dur, vol, type) {
    const ac  = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type      = type || 'square';
    osc.frequency.setValueAtTime(freq, ac.currentTime);

    // Envelope: ataque instantáneo, decay suave
    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(vol || 0.08, ac.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + dur);
  }

  /* ── Sonidos específicos ── */

  // Tick de diálogo — alternancia de dos notas (estilo Undertale)
  let _tickToggle = false;
  function tick() {
    const notes = [523, 587]; // Do5 / Re5
    beep(notes[_tickToggle ? 1 : 0], 0.055, 0.07, 'square');
    _tickToggle = !_tickToggle;
  }

  // Tick del ASCII — nota más grave y suave, sensación de "impresora"
  let _asciiNote = 0;
  const _asciiNotes = [220, 246, 261, 220, 196]; // notas graves que suben/bajan
  function asciiTick() {
    beep(_asciiNotes[_asciiNote % _asciiNotes.length], 0.04, 0.045, 'square');
    _asciiNote++;
  }

  // Confirmación [✓] — acorde corto ascendente
  function confirm() {
    beep(523, 0.07, 0.07, 'square');
    setTimeout(() => beep(659, 0.07, 0.06, 'square'), 60);
    setTimeout(() => beep(784, 0.1,  0.05, 'square'), 120);
  }

  // Error — nota grave descendente
  function error() {
    beep(200, 0.12, 0.09, 'square');
    setTimeout(() => beep(150, 0.18, 0.07, 'square'), 100);
  }

  // Acento (línea cyan) — nota suave y alta
  function accent() {
    beep(880, 0.08, 0.05, 'sine');
    setTimeout(() => beep(1046, 0.12, 0.04, 'sine'), 80);
  }

  // Divisor — sweep descendente suave
  function divider() {
    const ac = getCtx();
    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(220, ac.currentTime + 0.25);
    gain.gain.setValueAtTime(0.05, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.28);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.3);
  }

  // Mensaje final — nota cálida, sine suave
  function finalTone() {
    beep(392, 0.15, 0.05, 'sine');
    setTimeout(() => beep(523, 0.2, 0.04, 'sine'), 120);
  }

  // Arranque del sistema — boot chord
  function boot() {
    beep(130, 0.1, 0.08, 'square');
    setTimeout(() => beep(196, 0.1, 0.07, 'square'), 80);
    setTimeout(() => beep(261, 0.15, 0.06, 'square'), 160);
  }

  return { tick, asciiTick, confirm, error, accent, divider, finalTone, boot };

})();
