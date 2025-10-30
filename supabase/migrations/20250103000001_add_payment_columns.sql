-- Agregar columnas de pago a la tabla reservations
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2);

-- Crear tabla de pagos si no existe
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  external_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_reservations_payment_method ON reservations(payment_method);
CREATE INDEX IF NOT EXISTS idx_reservations_payment_status ON reservations(payment_status);

-- Habilitar RLS en la tabla payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción de pagos
CREATE POLICY "Allow payment insertions" ON payments
  FOR INSERT WITH CHECK (true);

-- Política para permitir lectura de pagos
CREATE POLICY "Allow payment reads" ON payments
  FOR SELECT USING (true);

-- Política para permitir actualización de pagos
CREATE POLICY "Allow payment updates" ON payments
  FOR UPDATE USING (true);
