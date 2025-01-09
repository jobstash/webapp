class AppError extends Error {
  info: string | null;
  constructor(message: string, info?: string) {
    super(message);
    this.info = info ?? null;
  }

  async stringify() {
    return JSON.stringify({
      message: this.message,
      info: this.info,
    });
  }
}

export class MwSchemaError extends AppError {
  constructor(message: string, info?: string) {
    super(message, info);
  }
}

export const ERROR_MESSAGE = {
  TIMEOUT: 'Request took too long to complete.',
  NOT_FOUND: "We can't find the job you are looking for.",
  INTERNAL: 'Something went wrong. Please try again later.',
  MW_SCHEMA: (label: string) => `Invalid ${label} schema`,
} as const;
