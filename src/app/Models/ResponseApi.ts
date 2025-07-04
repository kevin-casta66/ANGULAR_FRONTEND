export interface ResponseApi {
  isSucess: boolean;  // Asegúrate que coincida con el backend (camelCase vs PascalCase)
  message?: string;    // Opcional si no siempre viene
  data?: any;         // Para los datos devueltos
  errors?: string[];  // Para errores de validación
}
