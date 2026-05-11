'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, registro } from '@/services/api';
import { saveSession } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) { setErro('Preencha todos os campos'); return; }
    setErro('');
    setLoading(true);
    try {
      const fn = modo === 'login' ? login : registro;
      const data = await fn({ email, senha });
      saveSession(data.token, data.email);
      router.push('/');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-blue-500 mb-2 text-center">To-Do List</h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          {modo === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition placeholder-gray-600"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder={modo === 'registro' ? 'Senha (mínimo 6 caracteres)' : 'Senha'}
            className="w-full bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition placeholder-gray-600"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          {modo === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button
            onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setErro(''); }}
            className="text-blue-500 hover:text-blue-400 transition"
          >
            {modo === 'login' ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </main>
  );
}
