import { Argon2id } from "oslo/password";

const option = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const hashPassword = (password: string) => {
  const argon = new Argon2id(option);
  return argon.hash(password);
};

export const comparePassword = (plainPassword: string, hashedPassword: string) => {
  const argon = new Argon2id(option);
  return argon.verify(hashedPassword, plainPassword);
};
