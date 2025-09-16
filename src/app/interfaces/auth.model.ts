export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateAccountCredentials extends LoginCredentials {
  name: string;
}

export interface LoginResponse {
  name: string;
  token: string;
}
