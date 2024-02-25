export interface CreateUserInterface {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface LogInUserInterface {
  username: string;
  email: string;
  password: string;
}

export interface UpdatePasswordInterface {
  id: string;
  oldPassword: string;
  newPassword: string;
}
