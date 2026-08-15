import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tela, Vazio } from "../components/Tela";
import { salvarFicha, uid, useEstado, setEstado } from "../lib/store";
import { BIBLIOTECA, GRUPOS } from "../lib/biblioteca";
import type { Exercicio, Ficha } from "../lib/types";

export const Route = createFileRoute("/fichas/$fichaId")({
  head: () => ({
    meta: [
      { title: "Editor de ficha — JB Training Pro" },
      {
        name: "description",
        content:
          "Adicione, edite, duplique e reordene exercícios da sua ficha de treino de academia.",
      },
      { property: "og:title", content: "Editor de ficha — JB Training Pro" },
      { property: "og:description", content: "Monte sua ficha de treino exercício por exercício." },
    ],
  }),
  component: Editor,
});

function novoExercicio(nome: string, grupo: string, descansoPadrao: number): Exercicio {
  return {
    id: uid(),
    nome,
    grupo,
    series: 4,
    repeticoes: 10,
    carga: 20,
    unidade: "kg",
    cargaTipo: "total",
    descanso: descansoPadrao,
    observacoes: "",
  };
}

function Editor() {
  const { fichaId } = Route.useParams();
  const { fichas, config, exerciciosCustom } = useEstado();
  const navigate = useNavigate();
  const ficha = fichas.find((f) => f.id === fichaId);
  const [busca, setBusca] = useState("");
  const [mostrarBiblioteca, setMostrarBiblioteca] = useState(false);
  const [arrastando, setArrastando] = useState<number | null>(null);
  const [aberto, setAberto] = useState<string | null>(null);

  const lista = useMemo(() => {
    const todos = [...BIBLIOTECA, ...exerciciosCustom];
    const q = busca.trim().toLowerCase();
    return q ? todos.filter((e) => e.nome.toLowerCase().includes(q)) : todos;
  }, [busca, exerciciosCustom]);

  if (!ficha) {
    return (
      <Tela titulo="Ficha" voltarPara="/fichas">
        <Vazio texto="Ficha não encontrada." />
      </Tela>
    );
  }

  const f: Ficha = ficha;

  function atualizar(mudanca: Partial<Ficha>) {
    salvarFicha({ ...f, ...mudanca });
  }

  function atualizarExercicio(id: string, mudanca: Partial<Exercicio>) {
    atualizar({ exercicios: f.exercicios.map((e) => (e.id === id ? { ...e, ...mudanca } : e)) });
  }

  function mover(de: number, para: number) {
    if (para < 0 || para >= f.exercicios.length) return;
    const arr = [...f.exercicios];
    const [item] = arr.splice(de, 1);
    if (!item) return;
    arr.splice(para, 0, item);
    atualizar({ exercicios: arr });
  }

  function adicionar(nome: string, grupo: string) {
    const ex = novoExercicio(nome, grupo, config.descansoPadrao);
    atualizar({ exercicios: [...f.exercicios, ex] });
    setAberto(ex.id);
    setMostrarBiblioteca(false);
    setBusca("");
    toast.success(`${nome} adicionado`);
  }

  function criarPersonalizado() {
    const nome = busca.trim();
    if (!nome) return;
    setEstado((e) => ({
      ...e,
      exerciciosCustom: [...e.exerciciosCustom, { nome, grupo: "Peito" }],
    }));
    adicionar(nome, "Peito");
  }

  return (
    <Tela titulo="Editar ficha" voltarPara="/fichas">
      <label className="mb-2 block text-xs tracking-widest text-muted-foreground uppercase">
        Nome da ficha
      </label>
      <input
        value={f.nome}
        onChange={(e) => atualizar({ nome: e.target.value.toUpperCase() })}
        className="mb-4 w-full rounded-2xl border border-input bg-card px-4 py-4 text-xl font-bold uppercase"
      />

      <button
        onClick={() => setMostrarBiblioteca((v) => !v)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-lg font-bold text-primary-foreground uppercase"
      >
        <Plus className="h-5 w-5" /> Adicionar exercício
      </button>

      {mostrarBiblioteca && (
        <div className="card-treino mb-4 p-3">
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-secondary px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar exercício..."
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>
          {busca.trim() && lista.length === 0 && (
            <button
              onClick={criarPersonalizado}
              className="mb-3 w-full rounded-xl bg-accent px-3 py-3 font-bold text-accent-foreground uppercase"
            >
              Criar “{busca.trim()}”
            </button>
          )}
          <div className="max-h-80 overflow-y-auto pr-1">
            {GRUPOS.map((g) => {
              const itens = lista.filter((e) => e.grupo === g);
              if (itens.length === 0) return null;
              return (
                <div key={g} className="mb-3">
                  <p className="mb-1 text-xs tracking-widest text-primary uppercase">{g}</p>
                  <div className="grid gap-1">
                    {itens.map((e) => (
                      <button
                        key={`${g}-${e.nome}`}
                        onClick={() => adicionar(e.nome, e.grupo)}
                        className="rounded-lg bg-secondary px-3 py-3 text-left font-medium"
                      >
                        {e.nome}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {f.exercicios.length === 0 ? (
        <Vazio texto="Nenhum exercício nesta ficha ainda." />
      ) : (
        <ul className="grid gap-3">
          {f.exercicios.map((ex, i) => (
            <li
              key={ex.id}
              draggable
              onDragStart={() => setArrastando(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (arrastando !== null) mover(arrastando, i);
                setArrastando(null);
              }}
              className="card-treino p-4"
            >
              <div className="flex items-start gap-2">
                <GripVertical className="mt-1 h-5 w-5 shrink-0 cursor-grab text-muted-foreground" />
                <button
                  onClick={() => setAberto(aberto === ex.id ? null : ex.id)}
                  className="flex-1 text-left"
                >
                  <p className="text-lg font-bold uppercase">{ex.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {ex.grupo} · {ex.series}×{ex.repeticoes} · {ex.carga} {ex.unidade}
                    {ex.cargaTipo === "lado" ? " (por lado)" : ""} · descanso {ex.descanso}s
                  </p>
                </button>
                <div className="flex flex-col gap-1">
                  <button onClick={() => mover(i, i - 1)} aria-label="Subir">
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <button onClick={() => mover(i, i + 1)} aria-label="Descer">
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {aberto === ex.id && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Campo
                    rotulo="Nome"
                    className="col-span-2"
                    valor={ex.nome}
                    onChange={(v) => atualizarExercicio(ex.id, { nome: v })}
                  />
                  <div className="col-span-2">
                    <label className="text-xs tracking-widest text-muted-foreground uppercase">
                      Grupo muscular
                    </label>
                    <select
                      value={ex.grupo}
                      onChange={(e) => atualizarExercicio(ex.id, { grupo: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-3"
                    >
                      {GRUPOS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <CampoNum
                    rotulo="Séries"
                    valor={ex.series}
                    onChange={(v) => atualizarExercicio(ex.id, { series: Math.max(1, v) })}
                  />
                  <CampoNum
                    rotulo="Repetições"
                    valor={ex.repeticoes}
                    onChange={(v) => atualizarExercicio(ex.id, { repeticoes: Math.max(1, v) })}
                  />
                  <CampoNum
                    rotulo="Carga"
                    valor={ex.carga}
                    onChange={(v) => atualizarExercicio(ex.id, { carga: Math.max(0, v) })}
                  />
                  <Campo
                    rotulo="Unidade"
                    valor={ex.unidade}
                    onChange={(v) => atualizarExercicio(ex.id, { unidade: v })}
                  />
                  <div className="col-span-2">
                    <label className="text-xs tracking-widest text-muted-foreground uppercase">
                      Tipo de carga
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      {(["total", "lado"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => atualizarExercicio(ex.id, { cargaTipo: t })}
                          className={`rounded-xl px-3 py-3 font-bold uppercase ${
                            ex.cargaTipo === t
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {t === "total" ? "Carga total" : "Por lado"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <CampoNum
                    rotulo="Descanso (s)"
                    valor={ex.descanso}
                    onChange={(v) => atualizarExercicio(ex.id, { descanso: Math.max(0, v) })}
                  />
                  <Campo
                    rotulo="Imagem (URL)"
                    valor={ex.imagem ?? ""}
                    onChange={(v) => atualizarExercicio(ex.id, { imagem: v })}
                  />
                  <Campo
                    rotulo="Observações"
                    className="col-span-2"
                    valor={ex.observacoes ?? ""}
                    onChange={(v) => atualizarExercicio(ex.id, { observacoes: v })}
                  />
                  <div className="col-span-2 flex gap-2">
                    <button
                      onClick={() => {
                        const copia = { ...ex, id: uid() };
                        const arr = [...f.exercicios];
                        arr.splice(i + 1, 0, copia);
                        atualizar({ exercicios: arr });
                      }}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-secondary px-3 py-3 font-bold uppercase"
                    >
                      <Copy className="h-4 w-4" /> Duplicar
                    </button>
                    <button
                      onClick={() =>
                        atualizar({ exercicios: f.exercicios.filter((x) => x.id !== ex.id) })
                      }
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-destructive/15 px-3 py-3 font-bold text-destructive uppercase"
                    >
                      <Trash2 className="h-4 w-4" /> Excluir
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => navigate({ to: "/treino/$fichaId", params: { fichaId: f.id } })}
        disabled={f.exercicios.length === 0}
        className="mt-6 w-full rounded-2xl bg-primary px-4 py-5 text-lg font-bold text-primary-foreground uppercase disabled:opacity-40"
      >
        Ir para o treino
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        As alterações são salvas automaticamente no seu aparelho.
      </p>
    </Tela>
  );
}

function Campo({
  rotulo,
  valor,
  onChange,
  className = "",
}: {
  rotulo: string;
  valor: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs tracking-widest text-muted-foreground uppercase">{rotulo}</label>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-3"
      />
    </div>
  );
}

function CampoNum({
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
