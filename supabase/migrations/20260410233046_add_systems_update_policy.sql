/*
  # Add UPDATE policy to systems table

  ## Problem
  The systems table has RLS enabled with SELECT and INSERT policies,
  but no UPDATE policy. This causes all update calls to silently fail
  (no error returned, but zero rows updated).

  ## Change
  - Add a permissive UPDATE policy on systems that allows anon and authenticated
    roles to update any system row (matching the existing anon select pattern
    used throughout this app).
*/

CREATE POLICY "Allow anon update on systems"
  ON systems
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
