import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, Pencil, Plus, Trash2, Play } from "lucide-react";
import { toast } from "sonner";
import { Tela, Vazio } from "../components/Tela";
import { duplicarFicha, excluirFicha, salvarFicha, uid, useEstado } from "../lib/store";
import type { Ficha } from "../lib/types";

export const Route = createFileRoute("/fichas/")({
  head: () => ({
    meta: [
      { title: "Minhas fichas — JB Training Pro" },
      {
        name: "description",
        content: "Crie, edite e organize suas fichas de treino com exercícios, séries e cargas.",
      },
      { property: "og:title", content: "Minhas fichas — JB Training Pro" },
      { property: "og:description", content: "Gerencie suas fichas de treino de academia." },
    ],
  }),
  component: Fichas,
});

function Fichas() {
  const { fichas } = useEstado();
  const navigate = useNavigate();

  function criar() {
    const nova: Ficha = {
      id: uid(),
      nome: "NOVA FICHA",
      exercicios: [],
      criadaEm: Date.now(),
    };
    salvarFicha(nova);
    void navigate({ to: "/fichas/$fichaId", params: { fichaId: nova.id } });
  }

  return (
    <Tela titulo="Minhas fichas">
      <button
        onClick={criar}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-5 text-lg font-bold text-primary-foreground uppercase"
      >
        <Plus className="h-6 w-6" /> Nova ficha
      </button>

      {fichas.length === 0 ? (
        <Vazio texto="Você ainda não tem fichas. Crie a primeira, por exemplo: TREINO A – PEITO/TRÍCEPS." />
      ) : (
        <ul className="grid gap-3">
          {fichas.map((f) => {
            const totalSeries = f.exercicios.reduce((a, e) => a + e.series, 0);
            return (
              <li key={f.id} className="card-treino px-4 py-4">
                <p className="text-xl font-bold uppercase">{f.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {f.exercicios.length} exercícios · {totalSeries} séries
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to="/treino/$fichaId"
                    params={{ fichaId: f.id }}
                    className="flex items-center gap-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground uppercase"
                  >
                    <Play className="h-4 w-4" /> Treinar
                  </Link>
                  <Link
                    to="/fichas/$fichaId"
                    params={{ fichaId: f.id }}
                    className="flex items-center gap-1 rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground uppercase"
                  >
                    <Pencil className="h-4 w-4" /> Editar
                  </Link>
                  <button
                    onClick={() => {
                      duplicarFicha(f.id);
                      toast.success("Ficha duplicada");
                    }}
                    className="flex items-center gap-1 rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground uppercase"
                  >
                    <Copy className="h-4 w-4" /> Duplicar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir a ficha ${f.nome}?`)) {
                        excluirFicha(f.id);
                        toast.success("Ficha excluída");
                      }
                    }}
                    className="flex items-center gap-1 rounded-xl bg-destructive/15 px-4 py-3 text-sm font-bold text-destructive uppercase"
                  >
                    <Trash2 className="h-4 w-4" /> Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Tela>
  );
}
