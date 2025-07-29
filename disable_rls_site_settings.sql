-- Script para deshabilitar RLS en la tabla site_settings
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- Deshabilitar RLS en site_settings para permitir operaciones públicas
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'site_settings'; 