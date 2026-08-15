import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function Tela({
  titulo,
  voltarPara = "/",
  acao,
  children,
}: {
  titulo: string;
  voltarPara?: string;
  acao?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/90 px-3 py-3 backdrop-blur">
        <Link
          to={voltarPara}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="flex-1 truncate text-2xl font-bold uppercase">{titulo}</h1>
        {acao}
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-4">{children}</main>
    </div>
  );
}

export function Vazio({ texto }: { texto: string }) {
  return (
    <p className="card-treino px-4 py-10 text-center text-sm text-muted-foreground">{texto}</p>
  );
}
