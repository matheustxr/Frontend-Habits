export interface UserProfile {
  name: string;
  email: string;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
}
