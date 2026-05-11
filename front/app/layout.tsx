import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'To-Do List',
  description: 'Gerenciador de tarefas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
