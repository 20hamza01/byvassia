// Edge-safe constants shared by middleware (Edge runtime) and server code.
// Keep this file free of Node-only imports (e.g. `next/headers`) so the
// Edge middleware bundle stays clean.
export const SESSION_COOKIE = "vassia_admin";
