type Level = "info" | "warn" | "error";
type Meta = Record<string, unknown>;

function emit(level: Level, msg: string, meta: Meta = {}) {
  const line = JSON.stringify({
    level,
    msg,
    time: new Date().toISOString(),
    ...meta,
  });
  console.log(line);
}

export const logger = {
  info:  (msg: string, meta?: Meta) => emit("info",  msg, meta),
  warn:  (msg: string, meta?: Meta) => emit("warn",  msg, meta),
  error: (msg: string, meta?: Meta) => emit("error", msg, meta),
};
