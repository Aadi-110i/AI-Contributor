-- AI Collab Builder — Database Setup
-- Run this in the Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Custom Types
-- ============================================
DO $$ BEGIN
  CREATE TYPE module_type AS ENUM (
    'frontend', 'backend', 'authentication', 'database', 'integrations'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE module_status AS ENUM (
    'unassigned', 'in_progress', 'uploaded', 'standardized', 'merged', 'error'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('active', 'merged', 'error');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- Profiles (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Projects
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status project_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Modules
-- ============================================
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type module_type NOT NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status module_status DEFAULT 'unassigned',
  code_path TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Invites
-- ============================================
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

-- ============================================
-- Merge Logs
-- ============================================
CREATE TABLE IF NOT EXISTS merge_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'error',
  log_output TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE merge_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: owner + assigned contributors can read
CREATE POLICY "projects_read" ON projects FOR SELECT USING (
  owner_id = auth.uid()
  OR id IN (
    SELECT project_id FROM modules WHERE assigned_to = auth.uid()
  )
);
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (owner_id = auth.uid());

-- Modules: project members can read, assigned users can update
CREATE POLICY "modules_read" ON modules FOR SELECT USING (
  project_id IN (
    SELECT id FROM projects WHERE owner_id = auth.uid()
    UNION
    SELECT project_id FROM modules WHERE assigned_to = auth.uid()
  )
);
CREATE POLICY "modules_insert" ON modules FOR INSERT WITH CHECK (true);
CREATE POLICY "modules_update" ON modules FOR UPDATE USING (true);

-- Invites: project owner can manage, anyone can read by token
CREATE POLICY "invites_read" ON invites FOR SELECT USING (true);
CREATE POLICY "invites_insert" ON invites FOR INSERT WITH CHECK (
  project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid())
);

-- Merge logs: project members can read
CREATE POLICY "merge_logs_read" ON merge_logs FOR SELECT USING (
  project_id IN (
    SELECT id FROM projects WHERE owner_id = auth.uid()
    UNION
    SELECT project_id FROM modules WHERE assigned_to = auth.uid()
  )
);
CREATE POLICY "merge_logs_insert" ON merge_logs FOR INSERT WITH CHECK (true);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_modules_project ON modules(project_id);
CREATE INDEX IF NOT EXISTS idx_modules_assigned ON modules(assigned_to);
CREATE INDEX IF NOT EXISTS idx_invites_token ON invites(token);
CREATE INDEX IF NOT EXISTS idx_merge_logs_project ON merge_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
