/**
 * Minimal structured logger (one JSON object per line — friendly to Vercel's log drains).
 * Never pass personal data (names, emails, message bodies) as context; log identifiers instead.
 */
type LogLevel = "info" | "warn" | "error";
type LogContext = Record<string, unknown>;

function serializeError(error: unknown): unknown {
  if (error instanceof Error) return { name: error.name, message: error.message, stack: error.stack };
  return error;
}

function write(level: LogLevel, message: string, context: LogContext = {}): void {
  const entry: LogContext = { level, message, time: new Date().toISOString() };
  for (const [key, value] of Object.entries(context))
    entry[key] = key === "error" ? serializeError(value) : value;
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message: string, context?: LogContext): void => write("info", message, context),
  warn: (message: string, context?: LogContext): void => write("warn", message, context),
  error: (message: string, context?: LogContext): void => write("error", message, context),
};
