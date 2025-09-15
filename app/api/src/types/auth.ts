export type Role = 'admin' | 'carer' | 'family';

export type User = {
  id: string;
  email: string;
  role: Role;
  passwordHash: string;
  salt: string;
};

