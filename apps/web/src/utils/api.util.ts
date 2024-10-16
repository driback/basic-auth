import { hcWithType } from "@vevibe/api/hc";
import { env } from "~/env";

export const api = hcWithType(env.API_URL);
