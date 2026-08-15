import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Tela, Vazio } from "../components/Tela";
import { useEstado } from "../lib/store";
import { criarSessao, iniciarSessao } from "../lib/sessao";

export const Route = createFileRoute("/treino/$fichaId")({
  head: () => ({
    meta: [
      { title: "Resumo do treino — JB Training Pro" },
      {
        name: "description",
        content: "Veja exercícios, séries e tempo estimado antes de iniciar o treino.",
      },
      { property: "og:title", content: "Resumo do treino — JB Training Pro" },
      { property: "og:description", content: "Confira sua ficha e inicie o treino guiado." },
    ],
  }),
  component: ResumoTreino,
});

function ResumoTreino() {
  const { fichaId } = Route.useParams();
  const { fichas, config } = useEstado();
  const navigate = useNavigate();
  const ficha = fichas.find((f) => f.id === fichaId);

  if (!ficha) {
    return (
      <Tela titulo="Treino" voltarPara="/fichas">
        <Vazio texto="Ficha não encontrada." />
      </Tela>
    );
  }

  const totalSeries = ficha.exercicios.reduce((a, e) => a + e.series, 0);
  const descansoSeries = ficha.exercicios.reduce(
    (a, e) => a + (e.series - 1) * (e.descanso || config.descansoPadrao),
    0,
  );
  const estimado = Math.round(
    (totalSeries * 40 +
      descansoSeries +
      Math.max(0, ficha.exercicios.length - 1) * config.descansoEntreExercicios) /
      60,
  );

  return (
    <Tela titulo={ficha.nome} voltarPara="/fichas">
      <div className="card-treino px-4 py-6 text-center">
        <p className="text-3xl font-extrabold uppercase">{ficha.nome}</p>
        <p className="mt-2 text-muted-foreground">
          {ficha.exercicios.length} exercícios · {totalSeries} séries
        </p>
        <p className="text-muted-foreground">Tempo estimado: {estimado} minutos</p>
      </div>

      <ul className="mt-4 grid gap-2">
        {ficha.exercicios.map((e, i) => (
          <li key={e.id} className="card-treino flex items-center gap-3 px-4 py-3">
            <span className="numero-gigante w-8 text-2xl text-primary">{i + 1}</span>
            <div className="flex-1">
              <p className="font-bold uppercase">{e.nome}</p>
              <p className="text-sm text-muted-foreground">
                {e.grupo} · {e.series}×{e.repeticoes} · {e.carga} {e.unidade}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <button
        disabled={ficha.exercicios.length === 0}
        onClick={() => {
          iniciarSessao(criarSessao(ficha.id, ficha.nome, ficha.exercicios));
          void navigate({ to: "/sessao" });
        }}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-3xl bg-primary px-6 py-7 text-2xl font-extrabold text-primary-foreground uppercase shadow-[var(--shadow-glow)] disabled:opacity-40"
      >
        <Play className="h-7 w-7" /> Iniciar treino
      </button>
    </Tela>
  );
}
