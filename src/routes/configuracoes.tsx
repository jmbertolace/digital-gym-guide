import { createFileRoute } from "@tanstack/react-router";
import { Tela } from "../components/Tela";
import { setEstado, useEstado } from "../lib/store";
import type { Configuracoes } from "../lib/types";
import { falar } from "../lib/voz";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — JB Training Pro" },
      {
        name: "description",
        content:
          "Ajuste voz, volume, vibração, sons, tempos de descanso padrão e aparência do aplicativo.",
      },
      { property: "og:title", content: "Configurações — JB Training Pro" },
      { property: "og:description", content: "Personalize áudio, cronômetro e aparência." },
    ],
  }),
  component: TelaConfig,
});

function TelaConfig() {
  const { config } = useEstado();

  function mudar<K extends keyof Configuracoes>(chave: K, valor: Configuracoes[K]) {
    setEstado((e) => ({ ...e, config: { ...e.config, [chave]: valor } }));
  }

  return (
    <Tela titulo="Configurações">
      <Secao titulo="Áudio">
        <Toggle
          rotulo="Voz do assistente"
          ativo={config.vozAtiva}
          onChange={(v) => {
            mudar("vozAtiva", v);
            if (v) falar("Voz ativada.", true, config.volume);
          }}
        />
        <div className="py-3">
          <p className="font-medium">Volume ({Math.round(config.volume * 100)}%)</p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={config.volume}
            onChange={(e) => mudar("volume", Number(e.target.value))}
            className="mt-2 w-full accent-[var(--primary)]"
          />
        </div>
        <Toggle
          rotulo="Avisos durante o descanso"
          ativo={config.avisosDescanso}
          onChange={(v) => mudar("avisosDescanso", v)}
        />
        <Toggle
          rotulo="Aviso de início de série"
          ativo={config.avisoInicioSerie}
          onChange={(v) => mudar("avisoInicioSerie", v)}
        />
      </Secao>

      <Secao titulo="Vibração">
        <Toggle
          rotulo="Vibração"
          ativo={config.vibracao}
          onChange={(v) => mudar("vibracao", v)}
        />
      </Secao>

      <Secao titulo="Cronômetro">
        <Toggle
          rotulo="Som ao terminar o descanso"
          ativo={config.somFinalDescanso}
          onChange={(v) => mudar("somFinalDescanso", v)}
        />
        <Toggle
          rotulo="Contagem regressiva (5…1)"
          ativo={config.contagemRegressiva}
          onChange={(v) => mudar("contagemRegressiva", v)}
        />
        <Numero
          rotulo="Descanso padrão entre séries (s)"
          valor={config.descansoPadrao}
          onChange={(v) => mudar("descansoPadrao", v)}
        />
        <Numero
          rotulo="Descanso entre exercícios (s)"
          valor={config.descansoEntreExercicios}
          onChange={(v) => mudar("descansoEntreExercicios", v)}
        />
      </Secao>

      <Secao titulo="Aparência">
        <div className="grid grid-cols-2 gap-2 py-3">
          {(["escuro", "claro"] as const).map((t) => (
            <button
              key={t}
              onClick={() => mudar("tema", t)}
              className={`rounded-xl px-3 py-4 font-bold uppercase ${
                config.tema === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Tema {t}
            </button>
          ))}
        </div>
      </Secao>

      <Secao titulo="Treino">
        <Toggle
          rotulo="Mostrar carga anterior"
          ativo={config.mostrarCargaAnterior}
          onChange={(v) => mudar("mostrarCargaAnterior", v)}
        />
        <Toggle
          rotulo="Mostrar histórico durante o treino"
          ativo={config.mostrarHistorico}
          onChange={(v) => mudar("mostrarHistorico", v)}
        />
        <Toggle
          rotulo="Confirmar antes de pular exercício"
          ativo={config.confirmarPular}
          onChange={(v) => mudar("confirmarPular", v)}
        />
      </Secao>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Todos os dados ficam salvos apenas neste aparelho e funcionam sem internet.
      </p>
    </Tela>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="card-treino mb-4 px-4 py-3">
      <h2 className="mb-1 text-sm tracking-widest text-primary uppercase">{titulo}</h2>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

function Toggle({
  rotulo,
  ativo,
  onChange,
}: {
  rotulo: string;
  ativo: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!ativo)}
      className="flex w-full items-center justify-between py-4 text-left"
    >
      <span className="font-medium">{rotulo}</span>
      <span
        className={`relative h-7 w-12 rounded-full transition-colors ${
          ativo ? "bg-primary" : "bg-secondary"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-background transition-all ${
            ativo ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function Numero({
  rotulo,
  valor,
  onChange,
}: {
  rotulo: string;
  valor: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="font-medium">{rotulo}</span>
      <input
        type="number"
        inputMode="numeric"
        value={valor}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-24 rounded-xl border border-input bg-card px-3 py-2 text-center text-lg font-bold"
      />
    </div>
  );
}
