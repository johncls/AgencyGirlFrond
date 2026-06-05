// En desarrollo usa HTTP, en producción necesitarás HTTPS
export const apiUrl = window.location.protocol === 'https:' 
  ? 'http://2.25.165.220:5000'  // Esto causará error CORS en producción HTTPS
  : 'http://2.25.165.220:5000';

// Nota: Para que funcione en producción HTTPS, necesitas:
// 1. Configurar SSL en tu servidor API (recomendado)
// 2. O configurar tu sitio en Hostinger para usar HTTP (no recomendado)