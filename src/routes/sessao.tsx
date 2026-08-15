import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Minus, Pause, Play, Plus, SkipForward, X } from "lucide-react";
import { Tela, Vazio } from "../components/Tela";
import { formatarTempo, salvarTreino, ultimaCarga, useEstado } from "../lib/store";
import {
  ajustarCarga,
  ajustarDescanso,
  cancelarSessao,
  concluirSerie,
  decorrido,
  definirCarga,
  encerrarDescanso,
  montarTreino,
  pausarTreino,
  pularExercicio,
  pularSerie,
  retomarTreino,
  volumeTotal,
} from "../lib/sessao";
import { bip, falar, pararVoz, vibrar } from "../lib/voz";

export const Route = createFileRoute("/sessao")({
  head: () => ({
    meta: [
      { title: "Treino em andamento — JB Training Pro" },
      {
        name: "description",
        content:
          "Execute o treino série a série com cronômetro de descanso, avisos por voz e registro de carga.",
      },
      { property: "og:title", content: "Treino em andamento — JB Training Pro" },
      { property: "og:description", content: "Sequência automática de séries e descansos." },
    ],
  }),
  component: Sessao,
});

function Sessao() {
  const { sessao, config, historico } = useEstado();
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const [pronto, setPronto] = useState(false);
  const anunciados = useRef<Set<string>>(new Set());
  const serieAnunciada = useRef<string>("");

  useEffect(() => {
    setPronto(true);
    const i = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(i);
  }, []);

  const exercicio = sessao?.exercicios[sessao.idxExercicio];

  const restanteBruto =
    sessao?.descansoAte != null
      ? (sessao.descansoAte - Date.now()) / 1000
      : (sessao?.descansoPausadoRestante ?? null);
  const emDescanso = restanteBruto !== null;
  const segRest = restanteBruto === null ? null : Math.max(0, Math.ceil(restanteBruto));

  // avisos durante o descanso
  useEffect(() => {
    if (!sessao || segRest === null || sessao.descansoAte === null) return;
    const chave = `${sessao.descansoAte}-${segRest}`;
    if (anunciados.current.has(chave)) return;
    anunciados.current.add(chave);
    if (segRest === 0) {
      encerrarDescanso();
      bip(config.somFinalDescanso, config.volume, 1046, 0.35);
      vibrar(config.vibracao, [200, 100, 200]);
      falar("Descanso concluído. Próxima série.", config.vozAtiva, config.volume);
      return;
    }
    if (config.avisosDescanso && (segRest === 30 || segRest === 10)) {
      falar(`Faltam ${segRest} segundos.`, config.vozAtiva, config.volume);
    }
    if (config.contagemRegressiva && segRest <= 5) {
      bip(config.somFinalDescanso, config.volume, 660, 0.12);
      falar(String(segRest), config.vozAtiva, config.volume);
    }
  }, [segRest, sessao, config]);

  // aviso de início de série
  useEffect(() => {
    if (!sessao || !exercicio || emDescanso || sessao.concluido) return;
    const chave = `${sessao.idxExercicio}-${sessao.idxSerie}`;
    if (serieAnunciada.current === chave) return;
    serieAnunciada.current = chave;
    if (!config.avisoInicioSerie) return;
    falar(
      `${exercicio.nome}. Série ${sessao.idxSerie + 1} de ${exercicio.series}. ${exercicio.repeticoes} repetições.`,
      config.vozAtiva,
      config.volume,
    );
  }, [sessao, exercicio, emDescanso, config]);

  if (!pronto) return null;

  if (!sessao) {
    return (
      <Tela titulo="Treino">
        <Vazio texto="Nenhum treino em andamento. Escolha uma ficha para começar." />
      </Tela>
    );
  }

  const tempoTotal = decorrido(sessao);

  if (sessao.concluido) {
    const volume = volumeTotal(sessao.series);
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-md text-center">
          <p className="text-5xl">💪</p>
          <h1 className="mt-3 text-4xl font-extrabold uppercase">Treino concluído!</h1>
          <div className="card-treino mt-6 grid gap-3 px-4 py-6 text-left">
            <Linha rotulo="Tempo total" valor={formatarTempo(tempoTotal)} />
            <Linha
              rotulo="Exercícios realizados"
              valor={String(new Set(sessao.series.map((s) => s.exercicioNome)).size)}
            />
            <Linha rotulo="Séries realizadas" valor={String(sessao.series.length)} />
            <Linha rotulo="Carga total movimentada" valor={`${Math.round(volume)} kg`} />
            <Linha rotulo="Data e horário" valor={new Date().toLocaleString("pt-BR")} />
          </div>
          <div className="mt-6 grid gap-3">
            <button
              onClick={() => {
                salvarTreino(montarTreino(sessao));
                void navigate({ to: "/historico" });
              }}
              className="rounded-2xl bg-secondary px-4 py-5 text-lg font-bold uppercase"
            >
              Ver resumo
            </button>
            <button
              onClick={() => {
                salvarTreino(montarTreino(sessao));
                void navigate({ to: "/" });
              }}
              className="rounded-2xl bg-primary px-4 py-5 text-lg font-bold text-primary-foreground uppercase"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!exercicio) return <Vazio texto="Exercício não encontrado." />;

  const anterior = config.mostrarCargaAnterior ? ultimaCarga(historico, exercicio.nome) : null;
  const seriesFeitas = sessao.series.length;
  const seriesTotais = sessao.exercicios.reduce((a, e) => a + e.series, 0);
  const proximo = sessao.exercicios[sessao.idxExercicio + (sessao.idxSerie === 0 ? 0 : 0)];

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="numero-gigante text-2xl">{formatarTempo(tempoTotal)}</p>
          <p className="text-xs text-muted-foreground uppercase">
            {seriesFeitas}/{seriesTotais} séries
          </p>
        </div>
        <button
          onClick={() => {
            pararVoz();
            sessao.rodando ? pausarTreino() : retomarTreino();
          }}
          className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 font-bold uppercase"
        >
          {sessao.rodando ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {sessao.rodando ? "Pausar" : "Retomar"}
        </button>
      </header>

      {!sessao.rodando ? (
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h2 className="text-4xl font-extrabold uppercase">Treino pausado</h2>
          <p className="mt-2 text-muted-foreground">
            {exercicio.nome} · série {sessao.idxSerie + 1}/{exercicio.series}
          </p>
          <button
            onClick={retomarTreino}
            className="mt-8 w-full rounded-2xl bg-primary px-4 py-6 text-xl font-extrabold text-primary-foreground uppercase"
          >
            Retomar
          </button>
          <button
            onClick={() => {
              if (confirm("Encerrar o treino e salvar o que já foi feito?")) {
                salvarTreino(montarTreino(sessao));
                void navigate({ to: "/historico" });
              }
            }}
            className="mt-3 w-full rounded-2xl bg-secondary px-4 py-5 text-lg font-bold uppercase"
          >
            Encerrar treino
          </button>
          <button
            onClick={() => {
              if (confirm("Descartar este treino sem salvar?")) {
                cancelarSessao();
                void navigate({ to: "/" });
              }
            }}
            className="mt-3 w-full rounded-2xl px-4 py-4 text-sm font-bold text-destructive uppercase"
          >
            Descartar treino
          </button>
        </div>
      ) : emDescanso ? (
        <div className="mx-auto max-w-md px-4">
          <div className="card-treino px-4 py-12 text-center">
            <p className="text-lg tracking-[0.3em] text-accent uppercase">
              {sessao.entreExercicios ? "Descanso entre exercícios" : "Descanso"}
            </p>
            <p className="numero-gigante mt-6 text-[5.5rem] text-primary">
              {formatarTempo(segRest ?? 0)}
            </p>
            <p className="mt-4 text-xl font-bold uppercase">Próxima série</p>
            <p className="text-muted-foreground">
              {exercicio.nome} · {sessao.idxSerie + 1}/{exercicio.series} · {exercicio.repeticoes}{" "}
              reps
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2">
              <button
                onClick={() => ajustarDescanso(-15)}
                className="rounded-2xl bg-secondary py-5 text-lg font-bold"
              >
                −15s
              </button>
              <button
                onClick={pausarTreino}
                className="rounded-2xl bg-secondary py-5 text-lg font-bold uppercase"
              >
                Pausar
              </button>
              <button
                onClick={() => ajustarDescanso(15)}
                className="rounded-2xl bg-secondary py-5 text-lg font-bold"
              >
                +15s
              </button>
            </div>
            <button
              onClick={() => {
                encerrarDescanso();
                pararVoz();
              }}
              className="mt-3 w-full rounded-2xl bg-primary py-5 text-lg font-extrabold text-primary-foreground uppercase"
            >
              Pular descanso
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-md px-4">
          <div className="card-treino px-4 py-8 text-center">
            {exercicio.imagem ? (
              <img
                src={exercicio.imagem}
                alt={`Execução do exercício ${exercicio.nome}`}
                loading="lazy"
                className="mx-auto mb-4 h-40 w-full rounded-2xl object-cover"
              />
            ) : null}
            <h2 className="text-4xl leading-tight font-extrabold uppercase">{exercicio.nome}</h2>
            <p className="text-accent uppercase">{exercicio.grupo}</p>

            <p className="numero-gigante mt-6 text-3xl text-muted-foreground">
              SÉRIE {sessao.idxSerie + 1} / {exercicio.series}
            </p>
            <p className="numero-gigante mt-4 text-6xl">{exercicio.repeticoes}</p>
            <p className="text-sm tracking-widest text-muted-foreground uppercase">repetições</p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => ajustarCarga(-1)}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary"
                aria-label="Diminuir 1 kg"
              >
                <Minus className="h-7 w-7" />
              </button>
              <div>
                <input
                  type="number"
                  inputMode="decimal"
                  value={sessao.cargaAtual}
                  onChange={(e) => definirCarga(Number(e.target.value))}
                  className="numero-gigante w-32 rounded-2xl border border-input bg-card py-3 text-center text-4xl"
                />
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  {exercicio.unidade}
                  {exercicio.cargaTipo === "lado" ? " por lado" : " total"}
                </p>
              </div>
              <button
                onClick={() => ajustarCarga(1)}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary"
                aria-label="Aumentar 1 kg"
              >
                <Plus className="h-7 w-7" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-secondary/60 px-3 py-3">
                <p className="text-xs text-muted-foreground uppercase">Último treino</p>
                <p className="font-bold">
                  {anterior
                    ? `${anterior.carga} ${anterior.unidade} × ${anterior.repeticoes}`
                    : "sem registro"}
                </p>
              </div>
              <div className="rounded-xl bg-secondary/60 px-3 py-3">
                <p className="text-xs text-muted-foreground uppercase">Carga programada</p>
                <p className="font-bold">
                  {exercicio.carga} {exercicio.unidade} × {exercicio.repeticoes}
                </p>
              </div>
            </div>

            {exercicio.observacoes ? (
              <p className="mt-4 text-sm text-muted-foreground">{exercicio.observacoes}</p>
            ) : null}

            <button
              onClick={() => {
                vibrar(config.vibracao, 60);
                falar(
                  `Série concluída. Descanso de ${exercicio.descanso || config.descansoPadrao} segundos.`,
                  config.vozAtiva,
                  config.volume,
                );
                concluirSerie(config, exercicio.repeticoes);
              }}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-3xl bg-primary py-7 text-2xl font-extrabold text-primary-foreground uppercase shadow-[var(--shadow-glow)]"
            >
              <Check className="h-8 w-8" /> Concluída
            </button>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => pularSerie(config)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-secondary py-4 font-bold uppercase"
              >
                <SkipForward className="h-5 w-5" /> Pular série
              </button>
              <button
                onClick={() => {
                  if (
                    !config.confirmarPular ||
                    confirm(`Pular o exercício ${exercicio.nome}?`)
                  ) {
                    pularExercicio(config);
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-secondary py-4 font-bold uppercase"
              >
                <X className="h-5 w-5" /> Pular exercício
              </button>
            </div>
          </div>

          {config.mostrarHistorico && sessao.series.length > 0 && (
            <div className="card-treino mt-4 px-4 py-3">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                Séries desta sessão
              </p>
              <ul className="mt-2 grid gap-1 text-sm">
                {sessao.series.slice(-6).map((s, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {s.exercicioNome} · série {s.serie}
                    </span>
                    <span className="font-bold">
                      {s.carga} {s.unidade} × {s.repeticoes}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {proximo && sessao.idxExercicio + 1 < sessao.exercicios.length && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Próximo exercício: {sessao.exercicios[sessao.idxExercicio + 1]?.nome}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <span className="text-sm text-muted-foreground uppercase">{rotulo}</span>
      <span className="text-lg font-bold">{valor}</span>
    </div>
  );
}
