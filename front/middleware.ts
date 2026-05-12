// DEMONSTRAÇÃO — padrão correto de proteção de rotas no Next.js App Router.
//
// O middleware roda no servidor (Edge Runtime), onde localStorage não existe.
// Para funcionar de verdade, o token JWT precisaria estar em um cookie
// (preferencialmente httpOnly) em vez do localStorage.
//
// Fluxo correto com cookies:
//   1. No login: o backend seta o cookie via Set-Cookie header (httpOnly)
//   2. O browser envia o cookie automaticamente em toda requisição
//   3. O middleware lê o cookie e decide se redireciona ou não
//   4. O Axios precisa de withCredentials: true para incluir cookies
//
// A implementação atual com localStorage é simples e funciona para
// portfólio. Em produção, prefira cookies httpOnly (mais seguro contra XSS).

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Exemplo com cookie (descomente ao migrar de localStorage para cookie):
  //
  // const token = request.cookies.get('api_todo_token')?.value;
  // if (!token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon.ico).*)'],
};
