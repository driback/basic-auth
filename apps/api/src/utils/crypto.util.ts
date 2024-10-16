import crypto from "node:crypto";
import { base32, decodeHex } from "oslo/encoding";

export const generateIdFromEntropySize = (size: number): string => {
  const buffer = crypto.getRandomValues(new Uint8Array(size));
  return base32
    .encode(buffer, {
      includePadding: false,
    })
    .toLowerCase();
};

export const decodePayload = (payload: string) => {
  const d = decodeHex(payload);
  return new TextDecoder().decode(d);
};
