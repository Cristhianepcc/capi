"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { headers } from "next/headers";

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  );
}

export async function loginWithPassword(email: string, password: string) {
  const ip = await getClientIp();

  const { allowed, retryAfterMs } = checkRateLimit(
    `login:${ip}:${email}`,
    5,
    15 * 60 * 1000
  );
  if (!allowed) {
    const minutes = Math.ceil(retryAfterMs / 60000);
    return {
      error: `Demasiados intentos. Intenta de nuevo en ${minutes} minuto(s).`,
    };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  return { success: true };
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string
) {
  const ip = await getClientIp();

  const { allowed, retryAfterMs } = checkRateLimit(
    `register:${ip}`,
    3,
    60 * 60 * 1000
  );
  if (!allowed) {
    const minutes = Math.ceil(retryAfterMs / 60000);
    return {
      error: `Demasiados registros. Intenta de nuevo en ${minutes} minuto(s).`,
    };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { error: error.message };
  return { success: true };
}
