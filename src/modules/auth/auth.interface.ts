export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
}

export interface ILoginInput {
  email: string;
  password: string;
}
