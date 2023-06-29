interface LoginConfig {
  user: string,
  pass: string,
  headless?: boolean
  clientId: string,
}

interface Token {
  accessToken: string,
  refreshToken: string,
  expireSec: number,
}

export type { LoginConfig, Token };
