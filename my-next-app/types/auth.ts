export interface SignupForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

export type LoginForm = {
  identifier: string;
  password: string;
};
