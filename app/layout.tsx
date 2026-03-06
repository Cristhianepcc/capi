import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Capi — Plataforma de Voluntariado",
  description:
    "Organiza, promueve y gestiona eventos sin fines de lucro. Conecta voluntarios, instituciones y empresas patrocinadoras.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={lexend.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
