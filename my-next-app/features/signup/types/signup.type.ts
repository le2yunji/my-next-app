export interface SignupForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  interestCategories: string[];
  customInterestCategories: string[];
}
