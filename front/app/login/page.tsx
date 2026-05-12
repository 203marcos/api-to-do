'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, registro } from '@/services/auth.service';
import { saveSession } from '@/lib/session';
import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<'login' | 'registro'>('login');

  async function handleSubmit(email: string, senha: string) {
    const fn = modo === 'login' ? login : registro;
    const data = await fn({ email, senha });
    saveSession(data.token, data.email);
    router.push('/');
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-blue-500 mb-2 text-center">To-Do List</h1>
        <AuthForm modo={modo} onChangeModo={setModo} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
