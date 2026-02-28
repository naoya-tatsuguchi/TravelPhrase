-- ユーザーごとのフレーズデータを保存するテーブル
CREATE TABLE IF NOT EXISTS user_phrase_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{"schemaVersion":1,"languages":[],"lastUpdated":0}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: 各ユーザーは自分のデータのみアクセス可能
ALTER TABLE user_phrase_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON user_phrase_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON user_phrase_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON user_phrase_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
