export type CargaTipo = "total" | "lado";

export interface Exercicio {
  id: string;
  nome: string;
  grupo: string;
  series: number;
  repeticoes: number;
  carga: number;
  unidade: string;
  cargaTipo: CargaTipo;
  descanso: number; // segundos entre séries
  observacoes?: string;
  imagem?: string;
}

export interface Ficha {
  id: string;
  nome: string;
  exercicios: Exercicio[];
  criadaEm: number;
  usadaEm?: number;
}

export interface SerieRegistro {
  exercicioId: string;
  exercicioNome: string;
  grupo: string;
  serie: number;
  repeticoes: number;
  carga: number;
  unidade: string;
  cargaTipo: CargaTipo;
  concluida: boolean;
  em: number;
}

export interface TreinoRealizado {
  id: string;
  fichaId: string;
  fichaNome: string;
  inicio: number;
  fim: number;
  duracaoSeg: number;
  series: SerieRegistro[];
  totalExercicios: number;
}

export interface Configuracoes {
  vozAtiva: boolean;
  volume: number;
  avisosDescanso: boolean;
  avisoInicioSerie: boolean;
  vibracao: boolean;
  somFinalDescanso: boolean;
  descansoPadrao: number;
  descansoEntreExercicios: number;
  contagemRegressiva: boolean;
  tema: "escuro" | "claro";
  mostrarCargaAnterior: boolean;
  mostrarHistorico: boolean;
  confirmarPular: boolean;
}

export interface SessaoAtiva {
  fichaId: string;
  fichaNome: string;
  exercicios: Exercicio[];
  inicio: number;
  decorridoSeg: number; // acumulado quando pausado
  rodando: boolean;
  ultimoTick: number;
  idxExercicio: number;
  idxSerie: number; // 0-based
  cargaAtual: number;
  series: SerieRegistro[];
  descansoAte: number | null; // timestamp fim do descanso
  descansoTotal: number;
  descansoPausadoRestante: number | null;
  entreExercicios: boolean;
  concluido: boolean;
}

export interface EstadoApp {
  fichas: Ficha[];
  historico: TreinoRealizado[];
  config: Configuracoes;
  sessao: SessaoAtiva | null;
  exerciciosCustom: { nome: string; grupo: string }[];
}

export const CONFIG_PADRAO: Configuracoes = {
  vozAtiva: true,
  volume: 1,
  avisosDescanso: true,
  avisoInicioSerie: true,
  vibracao: true,
  somFinalDescanso: true,
  descansoPadrao: 60,
  descansoEntreExercicios: 90,
  contagemRegressiva: true,
  tema: "escuro",
  mostrarCargaAnterior: true,
  mostrarHistorico: true,
  confirmarPular: true,
};
