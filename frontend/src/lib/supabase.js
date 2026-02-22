// This file exists for compatibility. The actual client is implemented in
// the TypeScript module `supabase.ts`. Re-export from it so imports that
// resolve to `../lib/supabase` continue to work in either environment.
export * from "./supabase"
