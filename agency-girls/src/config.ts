// Detectar si estamos en desarrollo o producción
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// SIEMPRE usar la URL completa para evitar problemas con React Router
export const apiUrl = isDevelopment 
  ? 'https://agencygirls.cloud'  // Para desarrollo local
  : 'https://agencygirls.cloud';  // Para producción también usa URL completa