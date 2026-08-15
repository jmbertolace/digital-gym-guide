import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Zap } from "lucide-react";
import { Tela } from "../components/Tela";
import { GRUPOS } from "../lib/biblioteca";
import { uid, useEstado } from "../lib/store";
import { criarSessao, iniciarSessao } from "../lib/sessao";

export const Route = createFileRoute("/rapido")({
  head: () => ({
    meta: [
      { title: "Treino rápido — JB Training Pro" },
      {
        name: "description",
        content:
          "Comece um treino imediatamente escolhendo exercício, séries, repetições, carga e descanso.",
      },
      { property: "og:title", content: "Treino rápido — JB Training Pro" },
      { property: "og:description", content: "Treine sem precisar cadastrar uma ficha completa." },
    ],
  }),
  component: Rapido,
});

function Rapido() {
  const { config } = useEstado();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [grupo, setGrupo] = useState<string>(GRUPOS[0]);
  const [series, setSeries] = useState(4);
  const [reps, setReps] = useState(10);
  const [carga, setCarga] = useState(20);
  const [descanso, setDescanso] = useState(config.descansoPadrao);

  function comecar() {
    const exercicio = {
      id: uid(),
      nome: (nome.trim() || "EXERCÍCIO").toUpperCase(),
      grupo,
      series,
      repeticoes: reps,
      carga,
      unidade: "kg",
      cargaTipo: "total" as const,
      descanso,
      observacoes: "",
    };
    iniciarSessao(criarSessao("rapido", "TREINO RÁPIDO", [exercicio]));
    void navigate({ to: "/sessao" });
  }

  return (
    <Tela titulo="Treino rápido">
      <div className="card-treino grid gap-3 px-4 py-4">
        <div>
          <label className="text-xs tracking-widest text-muted-foreground uppercase">
            Exercício
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Supino reto"
            className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-3 text-lg"
          />
        </div>
        <div>
          <label className="text-xs tracking-widest text-muted-foreground uppercase">
            Grupo muscular
          </label>
          <select
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-3"
          >
            {GRUPOS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Num rotulo="Séries" valor={series} onChange={(v) => setSeries(Math.max(1, v))} />
          <Num rotulo="Repetições" valor={reps} onChange={(v) => setReps(Math.max(1, v))} />
          <Num rotulo="Carga (kg)" valor={carga} onChange={(v) => setCarga(Math.max(0, v))} />
          <Num
            rotulo="Descanso (s)"
            valor={descanso}
            onChange={(v) => setDescanso(Math.max(0, v))}
          />
        </div>
      </div>

      <button
        onClick={comecar}
        className="mt-5 flex w-full items-center justify-center gap-3 rounded-3xl bg-primary px-6 py-7 text-2xl font-extrabold text-primary-foreground uppercase shadow-[var(--shadow-glow)]"
      >
        <Zap className="h-7 w-7" /> Começar agora
      </button>
    </Tela>
  );
}

function Num({
  rotulo,
  valor,
  onChange,
}: {
  rotulo: string;
  valor: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-xs tracking-widest text-muted-foreground uppercase">{rotulo}</label>
      <input
        type="number"
        inputMode="decimal"
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-3 text-lg font-bold"
      />
    </div>
  );
}
