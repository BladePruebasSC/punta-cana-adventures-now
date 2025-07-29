
-- Crear tabla para mensajes de contacto
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Política permisiva para todos los usuarios (puedes ajustar según necesites)
CREATE POLICY "Allow all operations on contact_messages" ON public.contact_messages FOR ALL USING (true);

-- Crear índice para mejorar el rendimiento de consultas por fecha
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Crear índice para consultas por status
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
