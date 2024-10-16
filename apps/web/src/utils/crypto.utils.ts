import { encodeHexUpperCase } from "@oslojs/encoding";

export const encryptPayload = (data: string) => {
  const str = new TextEncoder().encode(data);
  return encodeHexUpperCase(str);
};
