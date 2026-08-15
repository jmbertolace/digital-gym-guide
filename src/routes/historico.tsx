import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Tela, Vazio } from "../components/Tela";
import { excluirTreino, formatarDataHora, formatarTempo, useEstado } from "../lib/store";
import { volumeTotal } from "../lib/sessao";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de treinos — JB Training Pro" },
      {
        name: "description",
        content: "Todos os treinos realizados com duração, exercícios, séries e cargas usadas.",
      },
      { property: "og:title", content: "Histórico de treinos — JB Training Pro" },
      { property: "og:description", content: "Consulte seus treinos anteriores em detalhes." },
    ],
  }),
  component: Historico,
});

function Historico() {
  const { historico } = useEstado();
  const [aberto, setAberto] = useState<string | null>(null);

  return (
    <Tela titulo="Histórico">
      {historico.length === 0 ? (
        <Vazio texto="Nenhum treino registrado ainda." />
      ) : (
        <ul className="grid gap-3">
          {historico.map((t) => (
            <li key={t.id} className="card-treino px-4 py-4">
              <button
                onClick={() => setAberto(aberto === t.id ? null : t.id)}
                className="w-full text-left"
              >
                <p className="text-sm text-muted-foreground">{formatarDataHora(t.fim)}</p>
                <p className="text-xl font-bold uppercase">{t.fichaNome}</p>
                <p className="text-sm text-muted-foreground">
                  Duração: {formatarTempo(t.duracaoSeg)} · {t.totalExercicios} exercícios ·{" "}
                  {t.series.length} séries · {Math.round(volumeTotal(t.series))} kg movimentados
                </p>
              </button>
              {aberto === t.id && (
                <div className="mt-3 border-t border-border pt-3">
                  <ul className="grid gap-1 text-sm">
                    {t.series.map((s, i) => (
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
                  <button
                    onClick={() => {
                      if (confirm("Excluir este treino do histórico?")) excluirTreino(t.id);
                    }}
                    className="mt-3 flex items-center gap-1 rounded-xl bg-destructive/15 px-3 py-2 text-sm font-bold text-destructive uppercase"
                  >
                    <Trash2 className="h-4 w-4" /> Excluir
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Tela>
  );
}
