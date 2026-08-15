import { setEstado, uid } from "./store";
import type { Configuracoes, Exercicio, SessaoAtiva, TreinoRealizado } from "./types";

export function criarSessao(
  fichaId: string,
  fichaNome: string,
  exercicios: Exercicio[],
): SessaoAtiva {
  const agora = Date.now();
  return {
    fichaId,
    fichaNome,
    exercicios,
    inicio: agora,
    decorridoSeg: 0,
    rodando: true,
    ultimoTick: agora,
    idxExercicio: 0,
    idxSerie: 0,
    cargaAtual: exercicios[0]?.carga ?? 0,
    series: [],
    descansoAte: null,
    descansoTotal: 0,
    descansoPausadoRestante: null,
    entreExercicios: false,
    concluido: false,
  };
}

export function iniciarSessao(sessao: SessaoAtiva) {
  setEstado((e) => ({ ...e, sessao }));
}

function atualizar(fn: (s: SessaoAtiva) => SessaoAtiva) {
  setEstado((e) => (e.sessao ? { ...e, sessao: fn(e.sessao) } : e));
}

export function decorrido(s: SessaoAtiva) {
  return s.decorridoSeg + (s.rodando ? (Date.now() - s.ultimoTick) / 1000 : 0);
}

export function pausarTreino() {
  atualizar((s) => {
    if (!s.rodando) return s;
    return {
      ...s,
      decorridoSeg: decorrido(s),
      rodando: false,
      ultimoTick: Date.now(),
      descansoPausadoRestante:
        s.descansoAte !== null ? Math.max(0, (s.descansoAte - Date.now()) / 1000) : null,
      descansoAte: null,
    };
  });
}

export function retomarTreino() {
  atualizar((s) => {
    if (s.rodando) return s;
    return {
      ...s,
      rodando: true,
      ultimoTick: Date.now(),
      descansoAte:
        s.descansoPausadoRestante !== null
          ? Date.now() + s.descansoPausadoRestante * 1000
          : null,
      descansoPausadoRestante: null,
    };
  });
}

export function ajustarCarga(delta: number) {
  atualizar((s) => ({ ...s, cargaAtual: Math.max(0, +(s.cargaAtual + delta).toFixed(2)) }));
}

export function definirCarga(valor: number) {
  atualizar((s) => ({ ...s, cargaAtual: Math.max(0, valor) }));
}

function avancar(s: SessaoAtiva, config: Configuracoes): SessaoAtiva {
  const ex = s.exercicios[s.idxExercicio];
  if (!ex) return { ...s, concluido: true };
  const temMaisSeries = s.idxSerie + 1 < ex.series;
  if (temMaisSeries) {
    const descanso = ex.descanso || config.descansoPadrao;
    return {
      ...s,
      idxSerie: s.idxSerie + 1,
      entreExercicios: false,
      descansoTotal: descanso,
      descansoAte: s.rodando ? Date.now() + descanso * 1000 : null,
      descansoPausadoRestante: s.rodando ? null : descanso,
    };
  }
  const proximo = s.exercicios[s.idxExercicio + 1];
  if (!proximo) {
    return { ...s, concluido: true, descansoAte: null, descansoPausadoRestante: null };
  }
  const descanso = config.descansoEntreExercicios;
  return {
    ...s,
    idxExercicio: s.idxExercicio + 1,
    idxSerie: 0,
    cargaAtual: proximo.carga,
    entreExercicios: true,
    descansoTotal: descanso,
    descansoAte: s.rodando ? Date.now() + descanso * 1000 : null,
    descansoPausadoRestante: s.rodando ? null : descanso,
  };
}

export function concluirSerie(config: Configuracoes, repeticoes: number) {
  atualizar((s) => {
    const ex = s.exercicios[s.idxExercicio];
    if (!ex || s.concluido) return s;
    const registro = {
      exercicioId: ex.id,
      exercicioNome: ex.nome,
      grupo: ex.grupo,
      serie: s.idxSerie + 1,
      repeticoes,
      carga: s.cargaAtual,
      unidade: ex.unidade,
      cargaTipo: ex.cargaTipo,
      concluida: true,
      em: Date.now(),
    };
    return avancar({ ...s, series: [...s.series, registro] }, config);
  });
}

export function pularSerie(config: Configuracoes) {
  atualizar((s) => (s.concluido ? s : avancar(s, config)));
}

export function pularExercicio(config: Configuracoes) {
  atualizar((s) => {
    if (s.concluido) return s;
    const proximo = s.exercicios[s.idxExercicio + 1];
    if (!proximo) return { ...s, concluido: true, descansoAte: null };
    const descanso = config.descansoEntreExercicios;
    return {
      ...s,
      idxExercicio: s.idxExercicio + 1,
      idxSerie: 0,
      cargaAtual: proximo.carga,
      entreExercicios: true,
      descansoTotal: descanso,
      descansoAte: s.rodando ? Date.now() + descanso * 1000 : null,
      descansoPausadoRestante: s.rodando ? null : descanso,
    };
  });
}

export function ajustarDescanso(segundos: number) {
  atualizar((s) => {
    if (s.descansoAte !== null) {
      return { ...s, descansoAte: Math.max(Date.now(), s.descansoAte + segundos * 1000) };
    }
    if (s.descansoPausadoRestante !== null) {
      return { ...s, descansoPausadoRestante: Math.max(0, s.descansoPausadoRestante + segundos) };
    }
    return s;
  });
}

export function encerrarDescanso() {
  atualizar((s) => ({ ...s, descansoAte: null, descansoPausadoRestante: null }));
}

export function cancelarSessao() {
  setEstado((e) => ({ ...e, sessao: null }));
}

export function montarTreino(s: SessaoAtiva): TreinoRealizado {
  const fim = Date.now();
  const exerciciosFeitos = new Set(s.series.map((x) => x.exercicioNome));
  return {
    id: uid(),
    fichaId: s.fichaId,
    fichaNome: s.fichaNome,
    inicio: s.inicio,
    fim,
    duracaoSeg: Math.round(decorrido(s)),
    series: s.series,
    totalExercicios: exerciciosFeitos.size,
  };
}

export function volumeTotal(series: { carga: number; repeticoes: number; cargaTipo: string }[]) {
  return series.reduce(
    (acc, s) => acc + s.carga * s.repeticoes * (s.cargaTipo === "lado" ? 2 : 1),
    0,
  );
}
