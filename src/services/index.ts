// Export du client HTTP
export { httpClient, HttpClient, type ApiResponse } from './httpClient';

// Export des services
export { authService } from './authService';
export { siteService } from './siteService';
export { productService } from './productService';
export { orderService } from './orderService';
export { userService } from './userService';
export { creationService } from './creationService';
export { configService } from './configService';

// Export des services WhatsApp et téléphone
export * from './whatsapp';
export * from './phoneService';