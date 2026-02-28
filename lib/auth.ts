'use client';

import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export async function signUp(email: string, password: string) {
  const supabase = createClient();
  if (!supabase) throw new Error('Supabase が設定されていません');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  // メール確認が有効な場合、session は null のまま（確認リンク後にログイン可能）
  if (data.user && !data.session) {
    throw new Error(
      'CONFIRM_EMAIL: 確認メールを送信しました。メール内のリンクをクリックしてアカウントを有効化し、ログインしてください。'
    );
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  if (!supabase) throw new Error('Supabase が設定されていません');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  if (supabase) await supabase.auth.signOut();
}

export async function getSession() {
  const supabase = createClient();
  if (!supabase) return { data: { session: null } };
  return supabase.auth.getSession();
}

export async function getUser(): Promise<User | null> {
  const { data } = await getSession();
  return data.session?.user ?? null;
}
