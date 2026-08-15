import { useSyncExternalStore } from "react";
import { CONFIG_PADRAO, type EstadoApp, type Ficha, type TreinoRealizado } from "./types";

const KEY = "jb-training-pro-v1";

const ESTADO_INICIAL: EstadoApp = {
  fichas: [],
  historico: [],
  config: CONFIG_PADRAO,
  sessao: null,
  exerciciosCustom: [],
};

let estado: EstadoApp = ESTADO_INICIAL;
let carregado = false;
const listeners = new Set<() => void>();

function ler(): EstadoApp {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return ESTADO_INICIAL;
    const parsed = JSON.parse(raw) as Partial<EstadoApp>;
    return {
      ...ESTADO_INICIAL,
      ...parsed,
      config: { ...CONFIG_PADRAO, ...(parsed.config ?? {}) },
    };
  } catch {
    return ESTADO_INICIAL;
  }
}

function persistir() {
  try {
    localStorage.setItem(KEY, JSON.stringify(estado));
  } catch {
    /* armazenamento indisponível */
  }
}

function emitir() {
  listeners.forEach((l) => l());
}

export function carregarEstado() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  estado = ler();
  emitir();
}

export function setEstado(fn: (e: EstadoApp) => EstadoApp) {
  estado = fn(estado);
  persistir();
  emitir();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const getSnapshot = () => estado;
const getServerSnapshot = () => ESTADO_INICIAL;

export function useEstado(): EstadoApp {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ---------- ações ---------- */

export function salvarFicha(ficha: Ficha) {
  setEstado((e) => {
    const existe = e.fichas.some((f) => f.id === ficha.id);
    return {
      ...e,
      fichas: existe ? e.fichas.map((f) => (f.id === ficha.id ? ficha : f)) : [...e.fichas, ficha],
    };
  });
}

export function excluirFicha(id: string) {
  setEstado((e) => ({ ...e, fichas: e.fichas.filter((f) => f.id !== id) }));
}

export function duplicarFicha(id: string) {
  setEstado((e) => {
    const f = e.fichas.find((x) => x.id === id);
    if (!f) return e;
    const { usadaEm: _ignorado, ...resto } = f;
    const copia: Ficha = {
      ...resto,
      id: uid(),
      nome: `${f.nome} (cópia)`,
      criadaEm: Date.now(),
      exercicios: f.exercicios.map((ex) => ({ ...ex, id: uid() })),
    };
    return { ...e, fichas: [...e.fichas, copia] };
  });
}

export function salvarTreino(t: TreinoRealizado) {
  setEstado((e) => ({
    ...e,
    historico: [t, ...e.historico],
    fichas: e.fichas.map((f) => (f.id === t.fichaId ? { ...f, usadaEm: t.fim } : f)),
    sessao: null,
  }));
}

export function excluirTreino(id: string) {
  setEstado((e) => ({ ...e, historico: e.historico.filter((t) => t.id !== id) }));
}

/** Última carga/reps registrada para um exercício (por nome). */
export function ultimaCarga(historico: TreinoRealizado[], nome: string) {
  for (const t of historico) {
    const s = [...t.series]
      .reverse()
      .find((x) => x.exercicioNome.toLowerCase() === nome.toLowerCase() && x.concluida);
    if (s) return { carga: s.carga, repeticoes: s.repeticoes, data: t.fim, unidade: s.unidade };
  }
  return null;
}

export function formatarTempo(seg: number) {
  const s = Math.max(0, Math.floor(seg));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function formatarData(ts: number) {
  return new Date(ts).toLocaleDateString("pt-BR");
}

export function formatarDataHora(ts: number) {
  return new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
