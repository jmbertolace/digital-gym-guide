let vozPt: SpeechSynthesisVoice | null = null;

function escolherVoz() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (vozPt) return vozPt;
  const vozes = window.speechSynthesis.getVoices();
  vozPt =
    vozes.find((v) => v.lang.toLowerCase().startsWith("pt-br")) ??
    vozes.find((v) => v.lang.toLowerCase().startsWith("pt")) ??
    null;
  return vozPt;
}

export function falar(texto: string, ativa: boolean, volume = 1) {
  if (!ativa || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    u.volume = volume;
    u.rate = 1.05;
    const v = escolherVoz();
    if (v) u.voice = v;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* voz indisponível */
  }
}

export function pararVoz() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

let ctx: AudioContext | null = null;

export function bip(ativo: boolean, volume = 1, freq = 880, dur = 0.18) {
  if (!ativo || typeof window === "undefined") return;
  try {
    type ComWebkit = Window & { webkitAudioContext?: typeof AudioContext };
    const AC = window.AudioContext ?? (window as ComWebkit).webkitAudioContext;
    if (!AC) return;
    ctx = ctx ?? new AC();
    void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.value = Math.min(1, volume) * 0.25;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch {
    /* áudio indisponível */
  }
}

export function vibrar(ativo: boolean, padrao: number | number[] = 200) {
  if (!ativo || typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(padrao);
  } catch {
    /* vibração indisponível */
  }
}
