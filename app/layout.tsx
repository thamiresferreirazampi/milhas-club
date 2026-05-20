import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Milhas Club — Aprenda a viajar de graça com milhas",
  description: "Mais de 5.000 alunos aprenderam a acumular milhas e emitir passagens com até 80% de desconto. Comece hoje, acesso vitalício.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
