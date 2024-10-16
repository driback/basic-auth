export const serializeToCookies = (obj: Record<string, PropertyKey>): string => {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`)
    .join("; ");
};

export const parseCookies = (cookieString: string): Record<string, PropertyKey> => {
  const cookies: Record<string, string> = {};

  if (cookieString) {
    const pairs = cookieString.split("; ");
    for (const pair of pairs) {
      const [name, value] = pair.split("=");
      if (!name || !value) continue;
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
};
