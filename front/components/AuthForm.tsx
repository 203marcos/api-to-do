'use client';

import { useState } from 'react';
import { extractErrorMessage } from '@/utils/error';
import { Input } from './Input';

interface Props {
  modo: 'login' | 'registro';
  onChangeModo: (modo: 'login' | 'registro') => void;
  onSubmit: (email: string, senha: string) => Promise<void>;
}

export function AuthForm({ modo, onChangeModo, onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      await onSubmit(email, senha);
    } catch (e) {
      setErro(extractErrorMessage(e, 'Erro ao autenticar'));
    } finally {
      setLoading(false);
    }
  }

  function handleChangeModo(novoModo: 'login' | 'registro') {
    setErro('');
    onChangeModo(novoModo);
  }

  return (
    <>
      <p className="text-gray-500 text-sm text-center mb-8">
        {modo === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          placeholder={modo === 'registro' ? 'Senha (mínimo 6 caracteres)' : 'Senha'}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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
          onClick={() => handleChangeModo(modo === 'login' ? 'registro' : 'login')}
          className="text-blue-500 hover:text-blue-400 transition"
        >
          {modo === 'login' ? 'Criar conta' : 'Entrar'}
        </button>
      </p>
    </>
  );
}
