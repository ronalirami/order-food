/** Bunyi singkat untuk kasir; perlu AudioContext “unlocked” lewat interaksi pengguna dulu. */

export function createKasirBeep() {
  let unlocked = false;

  return {
    unlockFromUserGesture() {
      unlocked = true;
    },
    async play() {
      if (typeof window === "undefined" || !unlocked) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        const ctx = new AC();
        if (ctx.state === "suspended") await ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.22);
        setTimeout(() => ctx.close().catch(() => {}), 400);
      } catch {
        /* autoplay / policy */
      }
    },
  };
}
