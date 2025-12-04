export interface LoginCredentials {
  email: string
  password: string
  origem?: string
  colaborador?: string
  password_colaborador?: string
  sygecomUser?: string
  sygecomPassword?: string
  sygecomRemember?: boolean
  remember?: boolean
  terms?: boolean
}

export interface User {
  token: string
  email: string
  usuario: string
  [key: string]: any
}

export interface LoginResponse {
  user: User[]
  [key: string]: any
}
