import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tela, Vazio } from "../components/Tela";
import { formatarData, useEstado } from "../lib/store";

export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: "Meu progresso — JB Training Pro" },
      {
        name: "description",
        content:
          "Acompanhe a evolução das cargas por exercício com tabela e gráfico dos seus registros de treino.",
      },
      { property: "og:title", content: "Meu progresso — JB Training Pro" },
      { property: "og:description", content: "Evolução de carga e repetições por exercício." },
    ],
  }),
  component: Progresso,
});

function Progresso() {
  const { historico } = useEstado();
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const porExercicio = useMemo(() => {
    const mapa = new Map<
      string,
      { data: number; carga: number; repeticoes: number; unidade: string }[]
    >();
    [...historico]
      .sort((a, b) => a.fim - b.fim)
      .forEach((t) => {
        t.series.forEach((s) => {
          const arr = mapa.get(s.exercicioNome) ?? [];
          arr.push({
            data: t.fim,
            carga: s.carga,
            repeticoes: s.repeticoes,
            unidade: s.unidade,
          });
          mapa.set(s.exercicioNome, arr);
        });
      });
    return mapa;
  }, [historico]);

  const nomes = [...porExercicio.keys()].sort((a, b) => a.localeCompare(b));
  const atual = selecionado ?? nomes[0] ?? null;
  const registros = atual ? (porExercicio.get(atual) ?? []) : [];

  const maior = registros.reduce((m, r) => Math.max(m, r.carga), 0);
  const ultima = registros[registros.length - 1];
  const treinos = new Set(registros.map((r) => formatarData(r.data))).size;
  const melhor = registros.reduce(
    (m, r) => (r.carga * r.repeticoes > m.carga * m.repeticoes ? r : m),
    registros[0] ?? { carga: 0, repeticoes: 0, data: 0, unidade: "kg" },
  );

  const grafico = registros.map((r) => ({
    dia: formatarData(r.data),
    carga: r.carga,
  }));

  return (
    <Tela titulo="Meu progresso">
      {nomes.length === 0 ? (
        <Vazio texto="Ainda não há registros. Faça um treino para começar a acompanhar sua evolução." />
      ) : (
        <>
          <select
            value={atual ?? ""}
            onChange={(e) => setSelecionado(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-input bg-card px-4 py-4 text-lg font-bold uppercase"
          >
            {nomes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <Cartao rotulo="Maior carga" valor={`${maior} kg`} />
            <Cartao rotulo="Última carga" valor={ultima ? `${ultima.carga} kg` : "—"} />
            <Cartao rotulo="Treinos registrados" valor={String(treinos)} />
            <Cartao
              rotulo="Melhor desempenho"
              valor={`${melhor.carga} kg × ${melhor.repeticoes}`}
            />
          </div>

          <div className="card-treino mt-4 px-2 py-4">
            <p className="mb-2 px-2 text-xs tracking-widest text-muted-foreground uppercase">
              Evolução da carga
            </p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={grafico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} width={34} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      color: "var(--foreground)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="carga"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-treino mt-4 px-4 py-4">
            <p className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
              Registros
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-1 font-medium">Data</th>
                  <th className="py-1 font-medium">Carga</th>
                  <th className="py-1 font-medium">Reps</th>
                </tr>
              </thead>
              <tbody>
                {[...registros].reverse().map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2">{formatarData(r.data)}</td>
                    <td className="py-2 font-bold">
                      {r.carga} {r.unidade}
                    </td>
                    <td className="py-2">{r.repeticoes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Estes dados são apenas registros dos seus treinos e não constituem orientação médica
            ou profissional.
          </p>
        </>
      )}
    </Tela>
  );
}

function Cartao({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="card-treino px-4 py-4">
      <p className="text-xs tracking-widest text-muted-foreground uppercase">{rotulo}</p>
      <p className="numero-gigante mt-1 text-2xl">{valor}</p>
    </div>
  );
}
