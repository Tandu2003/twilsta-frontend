// DTOs for auth feature (Rule 30)

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
  displayName: string;
}
