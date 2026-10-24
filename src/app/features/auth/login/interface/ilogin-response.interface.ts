export interface IloginResponse {
  headers: Headers2;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  redirected: boolean;
  responseType: string;
  name: string;
  message: string;
  error: Error;
}

interface Error {
  success: boolean;
  message: string;
  errors: string;
}

interface Headers2 {
  headers: Headers;
  normalizedNames: Headers;
  lazyUpdate: null;
}

interface Headers {}
