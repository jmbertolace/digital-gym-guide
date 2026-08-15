import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Dumbbell,
  ClipboardList,
  TrendingUp,
  History,
  Settings,
  Zap,
  Play,
} from "lucide-react";
import { useEstado, formatarDataHora, formatarTempo } from "../lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JB Training Pro — Assistente de treino de academia" },
      {
        name: "description",
        content:
          "Conduza seu treino de academia com fichas, cronômetro de descanso, avisos por voz e registro de cargas. Funciona offline.",
      },
      { property: "og:title", content: "JB Training Pro — Assistente de treino" },
      {
        property: "og:description",
        content: "Fichas, cronômetro inteligente, voz e histórico de cargas. Tudo offline.",
      },
    ],
  }),
  component: Inicio,
});

const MENU = [
  { to: "/fichas", icone: ClipboardList, rotulo: "Minhas fichas", emoji: "📋" },
  { to: "/progresso", icone: TrendingUp, rotulo: "Meu progresso", emoji: "📊" },
  { to: "/historico", icone: History, rotulo: "Histórico", emoji: "🕘" },
  { to: "/configuracoes", icone: Settings, rotulo: "Configurações", emoji: "⚙️" },
] as const;

function Inicio() {
  const { fichas, historico, sessao } = useEstado();
  const ultimaFicha = [...fichas].sort((a, b) => (b.usadaEm ?? 0) - (a.usadaEm ?? 0))[0];
  const ultimoTreino = historico[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 pt-10 pb-16">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Dumbbell className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl leading-none font-extrabold uppercase">
              JB <span className="texto-forca">Training</span> Pro
            </h1>
            <p className="text-sm text-muted-foreground">Seu assistente de treino</p>
          </div>
        </div>

        {sessao && !sessao.concluido && (
          <Link
            to="/sessao"
            className="mt-6 flex items-center gap-3 rounded-2xl border border-accent bg-accent/15 px-4 py-4"
          >
            <Play className="h-6 w-6 text-accent" />
            <div className="flex-1">
              <p className="font-bold uppercase">Treino em andamento</p>
              <p className="text-sm text-muted-foreground">
                {sessao.fichaNome} · retomar de onde parou
              </p>
            </div>
          </Link>
        )}

        <Link
          to="/fichas"
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-3xl bg-primary px-6 py-7 text-2xl font-extrabold tracking-wide text-primary-foreground uppercase shadow-[var(--shadow-glow)] active:scale-[0.99]"
        >
          🏋️ Iniciar treino
        </Link>

        <Link
          to="/rapido"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-accent/60 bg-accent/10 px-6 py-4 text-lg font-bold text-accent uppercase"
        >
          <Zap className="h-5 w-5" /> Treino rápido
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {MENU.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="card-treino flex flex-col gap-2 px-4 py-5 active:scale-[0.98]"
            >
              <m.icone className="h-7 w-7 text-primary" />
              <span className="text-lg leading-tight font-bold uppercase">{m.rotulo}</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-3">
          <div className="card-treino px-4 py-4">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">
              Última ficha utilizada
            </p>
            {ultimaFicha ? (
              <Link
                to="/treino/$fichaId"
                params={{ fichaId: ultimaFicha.id }}
                className="mt-1 block"
              >
                <p className="text-xl font-bold uppercase">{ultimaFicha.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {ultimaFicha.exercicios.length} exercícios
                  {ultimaFicha.usadaEm ? ` · ${formatarDataHora(ultimaFicha.usadaEm)}` : ""}
                </p>
              </Link>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Nenhuma ficha ainda. Crie a sua primeira em “Minhas fichas”.
              </p>
            )}
          </div>

          <div className="card-treino px-4 py-4">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">
              Último treino realizado
            </p>
            {ultimoTreino ? (
              <Link to="/historico" className="mt-1 block">
                <p className="text-xl font-bold uppercase">{ultimoTreino.fichaNome}</p>
                <p className="text-sm text-muted-foreground">
                  {formatarDataHora(ultimoTreino.fim)} · {formatarTempo(ultimoTreino.duracaoSeg)}{" "}
                  · {ultimoTreino.series.length} séries
                </p>
              </Link>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">Nenhum treino registrado ainda.</p>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Os dados exibidos são apenas registros dos seus treinos e não substituem orientação
          profissional.
        </p>
      </div>
    </div>
  );
}
