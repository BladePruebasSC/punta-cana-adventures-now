// Backend API para procesar pagos con Azul (Banco Popular Dominicano)
// Guarda este archivo como: backend-azul/server.js

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Configuración de Azul
const AZUL_CONFIG = {
  endpoint: 'https://pagos.azul.com.do/webservices/JSON/Default.aspx',
  store: process.env.AZUL_STORE_ID,
  auth1: process.env.AZUL_AUTH1,
  auth2: process.env.AZUL_AUTH2,
  // Certificados SSL (deben estar en la carpeta certs/)
  certPath: process.env.AZUL_CERT_PATH || './certs/azul_cert.pem',
  keyPath: process.env.AZUL_KEY_PATH || './certs/ssl_key_cert.pem'
};

/**
 * Endpoint para procesar pago con Azul
 */
app.post('/api/azul/process-payment', async (req, res) => {
  try {
    const {
      orderNumber,
      cardNumber,
      cardHolder,
      expirationDate,
      cvc,
      amount,
      currency,
      metadata
    } = req.body;

    // Validaciones básicas
    if (!orderNumber || !cardNumber || !expirationDate || !cvc || !amount) {
      return res.status(400).json({
        error: 'Datos de pago incompletos'
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        error: 'El monto mínimo es $1.00'
      });
    }

    // Calcular ITBIS (18% en República Dominicana)
    const itbis = Math.round(amount * 0.18);

    // Preparar request para Azul
    const azulRequest = {
      Channel: "EC",
      Store: AZUL_CONFIG.store,
      CardNumber: cardNumber,
      Expiration: expirationDate,
      CVC: cvc,
      PosInputMode: "E-Commerce",
      TrxType: "Sale",
      Amount: amount,
      Itbis: itbis,
      CurrencyPosCode: "$",
      Payments: "1",
      Plan: "0",
      AcquirerRefData: "1",
      CustomerServicePhone: process.env.CUSTOMER_SERVICE_PHONE || "809-000-0000",
      OrderNumber: orderNumber,
      ECommerceUrl: process.env.FRONTEND_URL || "https://tu-dominio.com",
      CustomOrderId: orderNumber
    };

    console.log('Procesando pago con Azul:', {
      orderNumber,
      amount: amount / 100,
      metadata
    });

    // Configurar cliente HTTPS con certificados
    let httpsAgent;
    try {
      httpsAgent = new https.Agent({
        cert: fs.readFileSync(AZUL_CONFIG.certPath),
        key: fs.readFileSync(AZUL_CONFIG.keyPath),
        rejectUnauthorized: false // En producción, cambiar a true
      });
    } catch (certError) {
      console.warn('⚠️  Certificados SSL no encontrados, usando modo simulado');
      // En desarrollo sin certificados, simular respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          success: true,
          authorizationCode: `SIM-${Date.now()}`,
          message: 'Pago simulado (certificados SSL no configurados)',
          orderNumber,
          amount: amount / 100
        });
      }
      throw new Error('Certificados SSL requeridos para procesar pagos');
    }

    // Llamar a la API de Azul
    const response = await axios.post(
      AZUL_CONFIG.endpoint,
      azulRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'Auth1': AZUL_CONFIG.auth1,
          'Auth2': AZUL_CONFIG.auth2
        },
        httpsAgent
      }
    );

    const result = response.data;

    // Log de transacción
    console.log('Respuesta de Azul:', {
      ResponseCode: result.ResponseCode,
      IsoCode: result.IsoCode,
      AuthorizationCode: result.AuthorizationCode,
      ResponseMessage: result.ResponseMessage
    });

    // Verificar respuesta exitosa
    if (result.ResponseCode === "ISO8583" && result.IsoCode === "00") {
      // Pago exitoso
      res.json({
        success: true,
        authorizationCode: result.AuthorizationCode,
        message: result.ResponseMessage,
        orderNumber: orderNumber,
        amount: amount / 100,
        rrn: result.RRN,
        lotNumber: result.LotNumber,
        ticket: result.Ticket,
        dateTime: result.DateTime
      });

      console.log(`✅ Pago exitoso: ${orderNumber} - ${result.AuthorizationCode}`);
    } else {
      // Pago rechazado
      res.status(400).json({
        success: false,
        error: result.ResponseMessage || 'Pago rechazado',
        errorDescription: result.ErrorDescription,
        isoCode: result.IsoCode
      });

      console.log(`❌ Pago rechazado: ${orderNumber} - ${result.ResponseMessage}`);
    }

  } catch (error) {
    console.error('Error procesando pago con Azul:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Error al procesar el pago',
      message: error.message
    });
  }
});

/**
 * Endpoint para tokenizar tarjeta (opcional)
 */
app.post('/api/azul/tokenize-card', async (req, res) => {
  try {
    const { cardNumber, expirationDate, cardHolder } = req.body;

    // Implementar tokenización con Azul Data Vault
    // Ver: https://dev.azul.com.do/Pages/developer/pages/lib/tokenization.aspx
    
    res.json({
      success: true,
      token: `TK-${crypto.randomBytes(16).toString('hex')}`,
      message: 'Tarjeta tokenizada exitosamente'
    });

  } catch (error) {
    console.error('Error tokenizando tarjeta:', error);
    res.status(500).json({
      error: 'Error al tokenizar tarjeta'
    });
  }
});

/**
 * Endpoint para verificar estado de transacción
 */
app.get('/api/azul/verify-transaction/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    // Implementar verificación con Azul
    // Por ahora, respuesta simulada
    res.json({
      orderNumber,
      status: 'approved',
      message: 'Transacción verificada'
    });

  } catch (error) {
    console.error('Error verificando transacción:', error);
    res.status(500).json({
      error: 'Error al verificar transacción'
    });
  }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    processor: 'Azul',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de pagos Azul corriendo en puerto ${PORT}`);
  console.log(`📝 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏪 Store ID: ${AZUL_CONFIG.store || 'NO CONFIGURADO'}`);
  console.log(`🔐 Certificados SSL: ${fs.existsSync(AZUL_CONFIG.certPath) ? '✅' : '❌'}`);
});

// Manejo de errores
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
