-- Crear tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, canceled
  payment_method VARCHAR(50), -- card, deposit, whatsapp
  payment_type VARCHAR(50), -- full, deposit
  deposit_amount DECIMAL(10,2), -- monto del depósito si aplica
  remaining_amount DECIMAL(10,2), -- monto restante si es depósito
  metadata JSONB, -- datos adicionales del pago
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Agregar columna de pago a la tabla de reservas
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at en payments
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Crear trigger para actualizar updated_at en reservations
CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON reservations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción de pagos (para el sistema)
CREATE POLICY "Allow payment insertion" ON payments
    FOR INSERT WITH CHECK (true);

-- Política para permitir lectura de pagos (para el dashboard)
CREATE POLICY "Allow payment reading" ON payments
    FOR SELECT USING (true);

-- Política para permitir actualización de pagos (para webhooks de Stripe)
CREATE POLICY "Allow payment updates" ON payments
    FOR UPDATE USING (true);

-- Comentarios para documentación
COMMENT ON TABLE payments IS 'Tabla para almacenar información de pagos de reservas';
COMMENT ON COLUMN payments.stripe_payment_intent_id IS 'ID del PaymentIntent de Stripe';
COMMENT ON COLUMN payments.payment_method IS 'Método de pago utilizado (card, deposit, whatsapp)';
COMMENT ON COLUMN payments.payment_type IS 'Tipo de pago (full, deposit)';
COMMENT ON COLUMN payments.metadata IS 'Datos adicionales del pago en formato JSON';
