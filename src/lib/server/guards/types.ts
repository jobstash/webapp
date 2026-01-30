export type GuardResult = Response | null;
export type GuardFn = () => GuardResult | Promise<GuardResult>;

export const guardError = (message: string, status: number): Response =>
  Response.json({ error: message }, { status });
