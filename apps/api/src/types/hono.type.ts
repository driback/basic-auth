import type { Env } from "hono";

export type Session = {
  id: string;
  userId: string;
  ipAddress: string;
};

export type RefreshToken = {
  token: string;
  sessionId: string;
  expiresAt: number;
};

export type User = {
  name: string;
  image: string | null;
};

export type HonoContext = Env & {
  Variables: {
    user: User | null;
    session: Session | null;
    refreshToken: RefreshToken | null;
  };
};
